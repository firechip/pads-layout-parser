import { PADSPart } from './PADSPart';
import { PADSNet } from './PADSNet';
import { ParserError } from './PADSParserError';

export interface PADSNetlist {
  parts: PADSPart[];
  nets: PADSNet[];
  errors?: ParserError[];
}