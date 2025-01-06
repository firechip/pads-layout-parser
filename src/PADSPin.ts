/**
 * Represents a pin connection in a PADS net.
 */
export interface PADSPin {
  /**
   * The reference designator of the component to which the pin belongs.
   * @example "U1", "R5"
   */
  refdes: string;

  /**
   * The pin number or name.
   * @example "1", "A2", "VCC"
   */
  pin: string;
}