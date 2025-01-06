import { ErrorCodes } from './ErrorCodes';

/**
 * Custom error class for PADS parser errors.
 */
export class ParserError extends Error {
  public code: string;
  public line: number;

  /**
   * Creates a new ParserError instance.
   * @param errorInfo The error code and message from ErrorCodes.
   * @param line The line number where the error occurred.
   */
  constructor(errorInfo: { code: string; message: string }, line: number) {
    super(`${errorInfo.message} (line ${line})`);
    this.code = errorInfo.code;
    this.line = line;
    this.name = 'ParserError';
  }
}