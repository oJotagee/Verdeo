import { ResilienceBuilder } from './resilience.builder';

export class Resilience {
  private constructor() {}

  static create(): ResilienceBuilder {
    return new ResilienceBuilder();
  }
}
