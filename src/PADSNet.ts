import { PADSPin } from './PADSPin';

/**
 * Represents a net in a PADS netlist.
 */
export interface PADSNet {
  /**
   * The name of the net.
   * @example "GND", "VCC", "N00123"
   */
  name: string;

  /**
   * An array of pins connected to this net.
   */
  pins: PADSPin[];
}