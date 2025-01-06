import { ErrorCodes } from './ErrorCodes';

export class ParserError extends Error {
  public code: string;
  public line: number;

  constructor(errorInfo: { code: string; message: string }, line: number) {
    super(`${errorInfo.message} (line ${line})`);
    this.code = errorInfo.code;
    this.line = line;
    this.name = 'ParserError';
  }
}