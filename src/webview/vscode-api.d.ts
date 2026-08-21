interface VSCodeWebviewApi<State = unknown> {
  postMessage(message: unknown): void
  getState(): State | undefined
  setState(state: State): void
}

declare function acquireVsCodeApi<State = unknown>(): VSCodeWebviewApi<State>
