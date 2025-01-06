import { PADSPart } from './PADSPart';
import { PADSNet } from './PADSNet';
import { ParserError } from './PADSParserError';

/**
 * Represents a complete PADS netlist.
 */
export interface PADSNetlist {
  /**
   * An array of parts in the netlist.
   */
  parts: PADSPart[];

  /**
   * An array of nets in the netlist.
   */
  nets: PADSNet[];

  /**
   * An optional array of parsing errors encountered.
   */
  errors?: ParserError[];
}