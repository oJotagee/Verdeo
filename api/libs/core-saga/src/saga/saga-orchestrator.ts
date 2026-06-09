import { Result, ok, err } from 'neverthrow';

import { Logger, NoOpLogger } from './logger.interface';
import { SagaStep } from '../steps/saga-step.interface';
import { SagaError } from './saga-error';

/**
 * Orquestrador de saga com suporte a rollback distribuído.
 *
 * Executa uma sequência de passos em ordem. Se algum passo falhar,
 * os passos já executados são compensados (revertidos) em ordem reversa.
 *
 * Classe TypeScript pura, sem dependências de NestJS — fácil de testar unitariamente.
 */
export class SagaOrchestrator<TContext> {
  private readonly logger: Logger;

  constructor(
    private readonly steps: SagaStep<TContext>[],
    logger?: Logger,
  ) {
    this.logger = logger ?? new NoOpLogger();
  }

  async execute(initialContext: TContext): Promise<Result<TContext, SagaError>> {
    let context = initialContext;

    const executedSteps: SagaStep<TContext>[] = [];

    for (const step of this.steps) {
      const stepName = step.constructor.name;

      this.logger.log(`[SagaOrchestrator] Executando passo: ${stepName}`);

      const result = await step.execute(context);

      if (result.isErr()) {
        this.logger.error(
          `[SagaOrchestrator] Passo '${stepName}' falhou: ${result.error.message}. Iniciando compensações.`,
        );

        const compensationErrors: Error[] = [];

        for (const executedStep of [...executedSteps].reverse()) {
          const executedStepName = executedStep.constructor.name;
          this.logger.log(`[SagaOrchestrator] Compensando passo: ${executedStepName}`);

          try {
            await executedStep.compensate(context);

            this.logger.log(
              `[SagaOrchestrator] Compensação do passo '${executedStepName}' concluída.`,
            );
          } catch (compensateError) {
            const error = compensateError as Error;

            this.logger.error(
              `[SagaOrchestrator] Erro na compensação do passo '${executedStepName}': ${error.message}`,
            );

            compensationErrors.push(error);
          }
        }

        return err(new SagaError(stepName, result.error, compensationErrors));
      }

      context = result.value;

      executedSteps.push(step);

      this.logger.log(`[SagaOrchestrator] Passo '${stepName}' concluído com sucesso.`);
    }

    this.logger.log(`[SagaOrchestrator] Saga concluída com sucesso.`, context);
    return ok(context);
  }
}
