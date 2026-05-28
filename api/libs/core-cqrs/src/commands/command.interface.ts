export interface ICommand<TResult = void> {
  readonly _resultType?: TResult;
}
