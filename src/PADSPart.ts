/**
 * Represents a part in a PADS netlist.
 */
export interface PADSPart {
  /**
   * The reference designator of the part.
   * @example "U1", "R5", "C10"
   */
  refdes: string;

  /**
   * The footprint name of the part.
   * @example "DIP14", "0805", "SOIC16"
   */
  footprint: string;

  /**
   * The optional value of the part.
   * @example "10k", "0.1uF", "74LS00"
   */
  value?: string;
}