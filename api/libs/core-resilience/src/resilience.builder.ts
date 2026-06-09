import CircuitBreaker = require('opossum');

import { CircuitBreakerOptions } from './types/circuit-breaker.options';
import { TimeoutException } from './exceptions/timeout.exception';
import { TimeoutOptions } from './types/timeout.options';
import { RetryOptions } from './types/retry.options';

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export class ResilienceBuilder {
  private cbOptions?: CircuitBreakerOptions;
  private retryOptions?: RetryOptions;
  private timeoutOptions?: TimeoutOptions;
  private fallbackFn?: () => unknown;
  private circuitBreaker?: CircuitBreaker<[() => Promise<unknown>], unknown>;
  private halfOpenSuccessCount = 0;
  private reopeningForThreshold = false;

  withCircuitBreaker(opts: CircuitBreakerOptions): this {
    this.cbOptions = opts;
    return this;
  }

  withRetry(opts: RetryOptions): this {
    this.retryOptions = opts;
    return this;
  }

  withTimeout(opts: TimeoutOptions): this {
    this.timeoutOptions = opts;
    return this;
  }

  withFallback(fn: () => unknown): this {
    this.fallbackFn = fn;
    return this;
  }

  getState(): CircuitState {
    if (!this.circuitBreaker) return 'CLOSED';

    if (this.circuitBreaker.opened) return 'OPEN';

    if (this.circuitBreaker.halfOpen) return 'HALF_OPEN';

    return 'CLOSED';
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    const wrappedWithTimeout = this.timeoutOptions
      ? this.wrapWithTimeout(fn, this.timeoutOptions.timeoutMs)
      : fn;

    const wrappedWithRetry = this.retryOptions
      ? () => this.wrapWithRetry(wrappedWithTimeout, this.retryOptions!)
      : wrappedWithTimeout;

    if (this.cbOptions) {
      return this.executeWithCircuitBreaker(wrappedWithRetry as () => Promise<T>);
    }

    return wrappedWithRetry() as Promise<T>;
  }

  private wrapWithTimeout<T>(fn: () => Promise<T>, timeoutMs: number): () => Promise<T> {
    return () => {
      const timeoutPromise = new Promise<T>((_, reject) => {
        const timer = setTimeout(() => {
          reject(new TimeoutException(timeoutMs));
        }, timeoutMs);
        if (timer.unref) timer.unref();
      });
      return Promise.race([fn(), timeoutPromise]);
    };
  }

  private async wrapWithRetry<T>(fn: () => Promise<T>, opts: RetryOptions): Promise<T> {
    let lastError: unknown;
    for (let attempt = 0; attempt < opts.maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error: unknown) {
        lastError = error;
        if (attempt < opts.maxAttempts - 1) {
          const delay = opts.initialDelay * Math.pow(opts.backoffFactor, attempt);
          await this.sleep(delay);
        }
      }
    }
    throw lastError;
  }

  private async executeWithCircuitBreaker<T>(fn: () => Promise<T>): Promise<T> {
    if (!this.circuitBreaker) {
      this.circuitBreaker = this.createBreaker();
      if (this.fallbackFn) {
        this.circuitBreaker.fallback(this.fallbackFn as () => unknown);
      }
    }
    return this.circuitBreaker.fire(fn as () => Promise<unknown>) as Promise<T>;
  }

  private createBreaker(): CircuitBreaker<[() => Promise<unknown>], unknown> {
    const opts = this.cbOptions!;
    const successThreshold = opts.successThreshold ?? 1;

    const resetSuccessCount = () => {
      this.halfOpenSuccessCount = 0;
    };
    const action = async (fn: () => Promise<unknown>) => fn();

    const breaker = new CircuitBreaker(action, {
      volumeThreshold: opts.failureThreshold,
      errorThresholdPercentage: 50,
      timeout: opts.timeout > 0 ? opts.timeout : false,
      resetTimeout: opts.halfOpenTimeout,
      rollingCountBuckets: 1,
      rollingCountTimeout: 60000,
    });

    breaker.on('open', () => {
      if (!this.reopeningForThreshold) resetSuccessCount();

      this.reopeningForThreshold = false;
    });

    breaker.on('halfOpen', resetSuccessCount);

    breaker.on('close', () => {
      if (successThreshold > 1) {
        this.halfOpenSuccessCount++;
        if (this.halfOpenSuccessCount < successThreshold) {
          this.reopeningForThreshold = true;
          breaker.open();
        } else {
          resetSuccessCount();
        }
      }
    });

    return breaker;
  }

  protected sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
