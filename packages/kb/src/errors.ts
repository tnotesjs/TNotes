/**
 * src/errors.ts
 */

export type KbErrorCode =
  | 'NOTE_NOT_FOUND'
  | 'GROUP_NOT_FOUND'
  | 'NOTE_EXISTS'
  | 'INVALID_TITLE'
  | 'INVALID_INDEX'
  | 'REVISION_CONFLICT'
  | 'INVALID_CONFIG'
  | 'INVALID_OPERATION'

export class KbError extends Error {
  readonly code: KbErrorCode
  readonly details?: Record<string, unknown>

  constructor(code: KbErrorCode, message: string, details?: Record<string, unknown>) {
    super(message)
    this.name = 'KbError'
    this.code = code
    this.details = details
  }
}
