import type { HeadingFoldCommand } from '../markdown/headingSectionCollapse'

type HeadingFoldRunner = (command: HeadingFoldCommand) => boolean

let runner: HeadingFoldRunner | null = null

export function registerHeadingFoldRunner(next: HeadingFoldRunner | null): void {
  runner = next
}

export function runHeadingFold(command: HeadingFoldCommand): boolean {
  return runner?.(command) ?? false
}

export function canRunHeadingFold(): boolean {
  return runner != null
}
