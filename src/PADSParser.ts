import { PADSNetlist } from "./PADSNetlist";
import { PADSPart } from "./PADSPart";
import { PADSNet } from "./PADSNet";
import { PADSPin } from "./PADSPin";
import { ErrorCodes } from "./ErrorCodes";
import { ParserError } from "./PADSParserError";

enum ParserState {
  Start,
  Header,
  PartSection,
  NetSection,
  InSignal,
  Done,
  Error,
}

/**
 * Parses PADS Layout ASCII netlist files (.asc).
 */
export class PADSParser {
  private netlist: PADSNetlist;
  private errors: ParserError[];
  private partialParsing: boolean;

  /**
   * Creates a new PADSParser instance.
   * @param partialParsing Whether to enable partial parsing mode.
   * In partial parsing mode the parser will not throw errors, but it will
   * collect them in the `errors` array and attempt to continue parsing.
   */
  constructor(partialParsing: boolean = false) {
    this.partialParsing = partialParsing;
    this.netlist = {
      parts: [],
      nets: [],
      errors: [],
    };
    this.errors = [];
  }

  /**
   * Parses a PADS Layout ASCII netlist from a string.
   * @param data The PADS netlist data as a string.
   * @returns A promise that resolves to the parsed PADSNetlist object.
   * @throws ParserError if parsing fails and partialParsing is false.
   */
  public async parse(data: string): Promise<PADSNetlist> {
    this.errors = []; // Reset errors for each parse
    const lines = data.split("\n");
    let state = ParserState.Start;
    // Initialize currentNet with an empty pins array
    let currentNet: PADSNet = { name: "", pins: [] };
    let lineNum = 0;
    let inPartSection = false;
    let inNetSection = false;

    for (const line of lines) {
      lineNum++;
      const trimmedLine = line.trim();

      if (!trimmedLine || trimmedLine.startsWith("//")) {
        continue; // Skip empty lines and comments
      }

      try {
        switch (state) {
          case ParserState.Start:
            if (
              trimmedLine.startsWith("*PADS-PCB*") ||
              trimmedLine.startsWith("*PADS2000*")
            ) {
              state = ParserState.Header;
            } else {
              this.addError(ErrorCodes.INVALID_FILE_HEADER, lineNum);
              if (!this.partialParsing) {
                throw new ParserError(ErrorCodes.INVALID_FILE_HEADER, lineNum);
              }
            }
            break;

          case ParserState.Header:
            if (trimmedLine.startsWith("*PART*")) {
              state = ParserState.PartSection;
              inPartSection = true;
            } else {
              this.addError(ErrorCodes.MISSING_PART_SECTION, lineNum);
              if (!this.partialParsing) {
                throw new ParserError(ErrorCodes.MISSING_PART_SECTION, lineNum);
              }
            }
            break;

          case ParserState.PartSection:
            if (trimmedLine.startsWith("*NET*")) {
              state = ParserState.NetSection;
              inPartSection = false;
              inNetSection = true;
            } else if (trimmedLine.startsWith("*")) {
              this.addError(ErrorCodes.INVALID_SECTION_HEADER, lineNum);
              if (!this.partialParsing) {
                throw new ParserError(
                  ErrorCodes.INVALID_SECTION_HEADER,
                  lineNum
                );
              }
            } else {
              this.parsePartLine(trimmedLine, lineNum);
            }
            break;

          case ParserState.NetSection:
          case ParserState.InSignal:
            if (trimmedLine.startsWith("*SIGNAL*")) {
              if (currentNet && currentNet.pins.length > 0) {
                this.netlist.nets.push(currentNet);
              }
              const parts = trimmedLine.split(" ");
              if (parts.length >= 2) {
                currentNet = { name: parts[1], pins: [] };
                state = ParserState.InSignal;
              } else {
                this.addError(ErrorCodes.INVALID_NET_FORMAT, lineNum);
                if (!this.partialParsing) {
                  throw new ParserError(ErrorCodes.INVALID_NET_FORMAT, lineNum);
                }
              }
            } else if (trimmedLine.startsWith("*END*")) {
              if (currentNet && currentNet.pins.length > 0) {
                this.netlist.nets.push(currentNet);
              }
              state = ParserState.Done;
              inNetSection = false;
            } else if (state === ParserState.InSignal) {
              this.parseNetLine(trimmedLine, currentNet, lineNum);
            }
            break;

          case ParserState.Done:
            break; // Ignore any lines after *END*

          default:
            this.addError(ErrorCodes.UNEXPECTED_TOKEN, lineNum);
            if (!this.partialParsing) {
              throw new ParserError(ErrorCodes.UNEXPECTED_TOKEN, lineNum);
            }
            break;
        }
      } catch (error) {
        if (!this.partialParsing) {
          if (error instanceof ParserError) {
            throw error;
          } else {
            // Handle other error types
            throw new Error(`Unexpected error: ${error}`);
          }
        } else {
          if (error instanceof ParserError) {
            this.addError(
              { code: error.code, message: error.message },
              error.line
            );
          } else if (error instanceof Error) {
            this.addError({ code: "E000", message: error.message }, lineNum);
          } else {
            // Handle any other error type
            this.addError(
              { code: "E000", message: "An unknown error occurred" },
              lineNum
            );
          }
        }
      }
    }

    if (state !== ParserState.Done && !this.partialParsing) {
      this.addError(ErrorCodes.UNEXPECTED_EOF, lineNum);
      throw new ParserError(ErrorCodes.UNEXPECTED_EOF, lineNum);
    }

    return { ...this.netlist, errors: this.errors };
  }

  /**
   * Parses a line in the *PART* section.
   * @param line The line to parse.
   * @param lineNum The line number.
   * @throws ParserError if the line has an invalid format.
   */
  private parsePartLine(line: string, lineNum: number): void {
    const parts = line.split(" ");
    if (parts.length >= 2) {
      let value: string | undefined;
      let footprint = parts[1];
      const atIndex = footprint.indexOf("@");
      if (atIndex !== -1) {
        value = footprint.substring(0, atIndex);
        footprint = footprint.substring(atIndex + 1);
      }

      if (parts[0].length > MAX_REF_DES_SIZE) {
        console.warn(
          `Part refdes "${parts[0]}" at line ${lineNum} too long, it will be truncated`
        );
      }

      // Check if the refdes is valid
      if (!/^[A-Za-z0-9]+$/.test(parts[0])) {
        throw new ParserError(ErrorCodes.INVALID_PART_REFDES, lineNum);
      }

      // Check if the footprint name is valid
      if (!/^[A-Za-z0-9_-]+$/.test(footprint)) {
        throw new ParserError(ErrorCodes.INVALID_PART_FORMAT, lineNum);
      }

      // Check for duplicate parts
      if (
        this.netlist.parts.some(
          (existingPart) => existingPart.refdes === parts[0]
        )
      ) {
        throw new ParserError(ErrorCodes.DUPLICATE_PART, lineNum);
      }

      this.netlist.parts.push({
        refdes: parts[0].substring(0, MAX_REF_DES_SIZE),
        footprint,
        value,
      });
    } else {
      throw new ParserError(ErrorCodes.INVALID_PART_FORMAT, lineNum);
    }
  }

  /**
   * Parses a line in the *SIGNAL* section of a net.
   * @param line The line to parse.
   * @param currentNet The current net being parsed.
   * @param lineNum The line number.
   * @throws ParserError if the line has an invalid format or contains a duplicate pin.
   */
  private parseNetLine(
    line: string,
    currentNet: PADSNet,
    lineNum: number
  ): void {
    const pins = line.split(" ");
    for (const pin of pins) {
      const parts = pin.split(".");
      if (parts.length === 2) {
        if (parts[0].length > MAX_REF_DES_SIZE) {
          console.warn(
            `Pin refdes "${parts[0]}" at line ${lineNum} too long, it will be truncated`
          );
        }

        // Check for duplicate pins
        const pinExists = currentNet.pins.some(
          (existingPin) =>
            existingPin.refdes === parts[0].substring(0, MAX_REF_DES_SIZE) &&
            existingPin.pin === parts[1]
        );

        if (pinExists) {
          throw new ParserError(ErrorCodes.DUPLICATE_PIN, lineNum);
        }

        currentNet.pins.push({
          refdes: parts[0].substring(0, MAX_REF_DES_SIZE),
          pin: parts[1],
        });
      } else {
        throw new ParserError(ErrorCodes.INVALID_PIN_FORMAT, lineNum);
      }
    }
  }

  /**
   * Adds an error to the errors array.
   * @param errorInfo The error code and message from ErrorCodes.
   * @param lineNum The line number where the error occurred.
   */
  private addError(
    errorInfo: { code: string; message: string },
    lineNum: number
  ) {
    this.errors.push(new ParserError(errorInfo, lineNum));
  }
}

// Constants
const MAX_REF_DES_SIZE = 8; // Maximum size for reference designators
