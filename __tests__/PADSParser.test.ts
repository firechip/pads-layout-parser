import { PADSParser } from "../src/PADSParser";
import { PADSNetlist } from "../src/PADSNetlist";
import { ErrorCodes } from "../src/ErrorCodes";
import { ParserError } from "../src/PADSParserError";
import * as fs from "fs";
import * as path from "path";

const VALID_TEST_FILES_DIR = path.join(__dirname, "valid");
const INVALID_TEST_FILES_DIR = path.join(__dirname, "invalid");

describe("PADSParser", () => {
  let parser: PADSParser;

  beforeEach(() => {
    parser = new PADSParser();
  });

  describe("Valid PADS files", () => {
    it("should parse a basic valid PADS file", async () => {
      const padsData = fs.readFileSync(
        path.join(VALID_TEST_FILES_DIR, "basic.pads"),
        "utf8"
      );
      const expectedNetlist: PADSNetlist = {
        parts: [
          { refdes: "U1", footprint: "DIP14" },
          { refdes: "R1", footprint: "0805" },
          { refdes: "C1", footprint: "0805" },
        ],
        nets: [
          { name: "VCC", pins: [{ refdes: "U1", pin: "14" }] },
          { name: "GND", pins: [{ refdes: "U1", pin: "7" }] },
          {
            name: "NET1",
            pins: [
              { refdes: "U1", pin: "1" },
              { refdes: "R1", pin: "1" },
            ],
          },
          {
            name: "NET2",
            pins: [
              { refdes: "U1", pin: "2" },
              { refdes: "R1", pin: "2" },
              { refdes: "C1", pin: "1" },
            ],
          },
          { name: "NET3", pins: [{ refdes: "C1", pin: "2" }] },
        ],
      };

      const netlist = await parser.parse(padsData);
      expect(netlist.parts).toEqual(expectedNetlist.parts);
      expect(netlist.nets).toEqual(expectedNetlist.nets);
    });

    it("should parse a valid PADS file with values in part definition", async () => {
      const testFile = path.join(VALID_TEST_FILES_DIR, "values.pads");
      expect(fs.existsSync(testFile)).toBeTruthy();

      const padsData = fs.readFileSync(testFile, "utf8");
      const expectedNetlist: PADSNetlist = {
        parts: [
          { refdes: "U2", footprint: "SIN-6", value: "PICkit3" },
          { refdes: "R1", footprint: "0603", value: "10k" },
          { refdes: "C3", footprint: "0603", value: "100n" },
          { refdes: "R4", footprint: "0603", value: "470e" },
          { refdes: "J7", footprint: "Mount" },
          { refdes: "J8", footprint: "Mount" },
          { refdes: "U1", footprint: "SOIC-14", value: "PIC16F676" },
          { refdes: "C1", footprint: "SMT-6mm", value: "47u" },
          { refdes: "C2", footprint: "0603", value: "100n" },
          { refdes: "S1", footprint: "D-Pot", value: "Volume" },
          { refdes: "S2", footprint: "Push-Button-THT", value: "Prev" },
          { refdes: "R11", footprint: "0603", value: "10k" },
          { refdes: "R7", footprint: "0603", value: "100k" },
          { refdes: "R5", footprint: "0603", value: "100k" },
          { refdes: "C6", footprint: "0603", value: "100n" },
          { refdes: "D1", footprint: "LED_3mm", value: "Tx" },
          { refdes: "R12", footprint: "0603", value: "220e" },
          { refdes: "C4", footprint: "0603", value: "100n" },
          { refdes: "S3", footprint: "Push-Button-THT", value: "Stop" },
          { refdes: "S4", footprint: "Push-Button-THT", value: "Next" },
          { refdes: "J1", footprint: "Clip-AAA", value: "AAA-1.5V" },
          { refdes: "J2", footprint: "Clip-AAA", value: "AAA-1.5V" },
          { refdes: "R10", footprint: "0603", value: "10k" },
          { refdes: "R9", footprint: "0603", value: "10k" },
          { refdes: "R8", footprint: "0603", value: "10k" },
          { refdes: "R6", footprint: "0603", value: "10k" },
          { refdes: "R2", footprint: "0603", value: "10k" },
          { refdes: "R3", footprint: "0603", value: "10k" },
          { refdes: "J3", footprint: "Clip-A23", value: "A23-12V" },
          { refdes: "C5", footprint: "SMT-6mm", value: "47u" },
          { refdes: "R13", footprint: "0603", value: "DNP" },
          { refdes: "R14", footprint: "0603", value: "DNP" },
          { refdes: "R15", footprint: "0603", value: "DNP" },
          { refdes: "U3", footprint: "FS1000A", value: "FS1000A" },
        ],
        nets: [
          {
            name: "nReset",
            pins: [
              { refdes: "U2", pin: "1" },
              { refdes: "R1", pin: "2" },
              { refdes: "U1", pin: "4" },
              { refdes: "R13", pin: "1" },
              { refdes: "R4", pin: "1" }
            ]
          },
          {
            name: "3V",
            pins: [
              { refdes: "C2", pin: "1" },
              { refdes: "U1", pin: "1" },
              { refdes: "C4", pin: "1" },
              { refdes: "U2", pin: "2" },
              { refdes: "R6", pin: "1" },
              { refdes: "R2", pin: "1" },
              { refdes: "R3", pin: "1" },
              { refdes: "R5", pin: "1" },
              { refdes: "R7", pin: "2" },
              { refdes: "R1", pin: "1" },
              { refdes: "C1", pin: "1" },
              { refdes: "J1", pin: "3" },
              { refdes: "J1", pin: "4" }
            ]
          },
          {
            name: "Gnd",
            pins: [
              { refdes: "C3", pin: "2" },
              { refdes: "J7", pin: "1" },
              { refdes: "J8", pin: "1" },
              { refdes: "C1", pin: "2" },
              { refdes: "C2", pin: "2" },
              { refdes: "S1", pin: "7" },
              { refdes: "S1", pin: "6" },
              { refdes: "R11", pin: "2" },
              { refdes: "U1", pin: "14" },
              { refdes: "C6", pin: "2" },
              { refdes: "D1", pin: "2" },
              { refdes: "U3", pin: "1" },
              { refdes: "C4", pin: "2" },
              { refdes: "J2", pin: "1" },
              { refdes: "J2", pin: "2" },
              { refdes: "R10", pin: "2" },
              { refdes: "U2", pin: "3" },
              { refdes: "R9", pin: "2" },
              { refdes: "R8", pin: "2" },
              { refdes: "S1", pin: "2" },
              { refdes: "J3", pin: "1" },
              { refdes: "J3", pin: "2" },
              { refdes: "C5", pin: "2" },
              { refdes: "R13", pin: "2" },
              { refdes: "R14", pin: "2" },
              { refdes: "R15", pin: "2" }
            ]
          },
          {
            name: "Tx",
            pins: [
              { refdes: "U1", pin: "5" },
              { refdes: "U3", pin: "3" }
            ]
          },
          {
            name: "Interrupt",
            pins: [
              { refdes: "S1", pin: "4" },
              { refdes: "R6", pin: "2" },
              { refdes: "S3", pin: "1" },
              { refdes: "S3", pin: "3" },
              { refdes: "S4", pin: "1" },
              { refdes: "S4", pin: "3" },
              { refdes: "U1", pin: "11" },
              { refdes: "S2", pin: "1" },
              { refdes: "S2", pin: "3" }
            ]
          },
          {
            name: "Play_Pause",
            pins: [
              { refdes: "S1", pin: "5" },
              { refdes: "U1", pin: "7" },
              { refdes: "R8", pin: "1" }
            ]
          },
          {
            name: "LED",
            pins: [
              { refdes: "R12", pin: "1" },
              { refdes: "U1", pin: "6" }
            ]
          },
          {
            name: "Vol1",
            pins: [
              { refdes: "R5", pin: "2" },
              { refdes: "S1", pin: "1" },
              { refdes: "U1", pin: "2" }
            ]
          },
          {
            name: "Vol2",
            pins: [
              { refdes: "R7", pin: "1" },
              { refdes: "S1", pin: "3" },
              { refdes: "U1", pin: "3" }
            ]
          },
          {
            name: "Prev",
            pins: [
              { refdes: "S2", pin: "2" },
              { refdes: "R9", pin: "1" },
              { refdes: "S2", pin: "4" },
              { refdes: "U1", pin: "8" }
            ]
          },
          {
            name: "Stop",
            pins: [
              { refdes: "S3", pin: "2" },
              { refdes: "R10", pin: "1" },
              { refdes: "S3", pin: "4" },
              { refdes: "U1", pin: "9" }
            ]
          },
          {
            name: "Next",
            pins: [
              { refdes: "S4", pin: "2" },
              { refdes: "R11", pin: "1" },
              { refdes: "S4", pin: "4" },
              { refdes: "U1", pin: "10" }
            ]
          },
          {
            name: "12V",
            pins: [
              { refdes: "J3", pin: "3" },
              { refdes: "J3", pin: "4" },
              { refdes: "C5", pin: "1" },
              { refdes: "C6", pin: "1" },
              { refdes: "U3", pin: "2" }
            ]
          },
          {
            name: "N000000",
            pins: [
              { refdes: "R4", pin: "2" },
              { refdes: "C3", pin: "1" }
            ]
          },
          {
            name: "N000001",
            pins: [
              { refdes: "R12", pin: "2" },
              { refdes: "D1", pin: "1" }
            ]
          },
          {
            name: "N000002",
            pins: [
              { refdes: "J1", pin: "1" },
              { refdes: "J1", pin: "2" },
              { refdes: "J2", pin: "3" },
              { refdes: "J2", pin: "4" }
            ]
          },
          {
            name: "N000003",
            pins: [
              { refdes: "R14", pin: "1" },
              { refdes: "U1", pin: "13" },
              { refdes: "R2", pin: "2" },
              { refdes: "U2", pin: "4" }
            ]
          },
          {
            name: "N000004",
            pins: [
              { refdes: "R15", pin: "1" },
              { refdes: "U2", pin: "5" },
              { refdes: "R3", pin: "2" },
              { refdes: "U1", pin: "12" }
            ]
          }
        ]
      };

      const netlist = await parser.parse(padsData);
      expect(netlist).toBeDefined();
      expect(netlist.parts).toEqual(expectedNetlist.parts);
      expect(netlist.nets).toEqual(expectedNetlist.nets);
    });

    it("should parse a valid PADS file with empty sections", async () => {
      const padsData = fs.readFileSync(
        path.join(VALID_TEST_FILES_DIR, "empty_part_section.pads"),
        "utf8"
      );
      let netlist = await parser.parse(padsData);
      expect(netlist.parts).toEqual([]);

      const padsData2 = fs.readFileSync(
        path.join(VALID_TEST_FILES_DIR, "empty_net_section.pads"),
        "utf8"
      );
      netlist = await parser.parse(padsData2);
      expect(netlist.nets).toEqual([]);
    });

    it("should handle multiple nets correctly", async () => {
      const padsData = fs.readFileSync(
        path.join(VALID_TEST_FILES_DIR, "multiple_nets.pads"),
        "utf8"
      );
      const expectedNetlist: PADSNetlist = {
        parts: [
          { refdes: "U1", footprint: "DIP14" },
          { refdes: "R1", footprint: "0805" },
          { refdes: "R2", footprint: "0805" },
          { refdes: "C1", footprint: "0805" },
          { refdes: "C2", footprint: "0805" },
        ],
        nets: [
          { name: "VCC", pins: [{ refdes: "U1", pin: "14" }] },
          { name: "GND", pins: [{ refdes: "U1", pin: "7" }] },
          {
            name: "NET1",
            pins: [
              { refdes: "U1", pin: "1" },
              { refdes: "R1", pin: "1" },
            ],
          },
          {
            name: "NET2",
            pins: [
              { refdes: "U1", pin: "2" },
              { refdes: "R2", pin: "1" },
            ],
          },
          {
            name: "NET3",
            pins: [
              { refdes: "R1", pin: "2" },
              { refdes: "C1", pin: "1" },
            ],
          },
          {
            name: "NET4",
            pins: [
              { refdes: "R2", pin: "2" },
              { refdes: "C2", pin: "1" },
            ],
          },
          {
            name: "NET5",
            pins: [
              { refdes: "C1", pin: "2" },
              { refdes: "C2", pin: "2" },
            ],
          },
        ],
      };

      const netlist = await parser.parse(padsData);
      expect(netlist.parts).toEqual(expectedNetlist.parts);
      expect(netlist.nets).toEqual(expectedNetlist.nets);
    });

    it("should handle long names correctly", async () => {
      const padsData = fs.readFileSync(
        path.join(VALID_TEST_FILES_DIR, "long_names.pads"),
        "utf8"
      );
      const expectedNetlist: PADSNetlist = {
        parts: [
          { refdes: "THISISAVE", footprint: "DIP14" },
          { refdes: "R1234567", footprint: "0805" },
        ],
        nets: [
          {
            name: "THISISAVERYLONGNETNAME1234567890",
            pins: [
              { refdes: "THISISAVE", pin: "1" },
              { refdes: "R1234567", pin: "1" },
            ],
          },
          {
            name: "SHORTNET",
            pins: [
              { refdes: "THISISAVE", pin: "2" },
              { refdes: "R1234567", pin: "2" },
            ],
          },
        ],
      };

      const netlist = await parser.parse(padsData);
      expect(netlist.parts).toEqual(expectedNetlist.parts);
      expect(netlist.nets).toEqual(expectedNetlist.nets);
    });

    it("should parse a valid PADS file with comments", async () => {
      const padsData = fs.readFileSync(
        path.join(VALID_TEST_FILES_DIR, "comments.pads"),
        "utf8"
      );
      const expectedNetlist: PADSNetlist = {
        parts: [
          { refdes: "U1", footprint: "DIP14" },
          { refdes: "R1", footprint: "0805" },
        ],
        nets: [
          { name: "VCC", pins: [{ refdes: "U1", pin: "14" }] },
          { name: "GND", pins: [{ refdes: "U1", pin: "7" }] },
          {
            name: "NET1",
            pins: [
              { refdes: "U1", pin: "1" },
              { refdes: "R1", pin: "1" },
            ],
          },
        ],
      };

      const netlist = await parser.parse(padsData);
      expect(netlist.parts).toEqual(expectedNetlist.parts);
      expect(netlist.nets).toEqual(expectedNetlist.nets);
    });

    it("should parse a valid PADS file with different order sections", async () => {
      const padsData = fs.readFileSync(
        path.join(VALID_TEST_FILES_DIR, "diff_order_sections.pads"),
        "utf8"
      );
      const expectedNetlist: PADSNetlist = {
        parts: [
          { refdes: "U1", footprint: "DIP14" },
          { refdes: "R1", footprint: "0805" },
          { refdes: "C1", footprint: "0805" },
        ],
        nets: [
          { name: "VCC", pins: [{ refdes: "U1", pin: "14" }] },
          { name: "GND", pins: [{ refdes: "U1", pin: "7" }] },
          {
            name: "NET1",
            pins: [
              { refdes: "U1", pin: "1" },
              { refdes: "R1", pin: "1" },
            ],
          },
          {
            name: "NET2",
            pins: [
              { refdes: "U1", pin: "2" },
              { refdes: "R1", pin: "2" },
              { refdes: "C1", pin: "1" },
            ],
          },
          { name: "NET3", pins: [{ refdes: "C1", pin: "2" }] },
        ],
      };

      const netlist = await parser.parse(padsData);
      expect(netlist.parts).toEqual(expectedNetlist.parts);
      expect(netlist.nets).toEqual(expectedNetlist.nets);
    });

    it("should parse a valid PADS file with different case sensitive keywords", async () => {
      const padsData = fs.readFileSync(
        path.join(VALID_TEST_FILES_DIR, "case_sensitive.pads"),
        "utf8"
      );
      const expectedNetlist: PADSNetlist = {
        parts: [
          { refdes: "U1", footprint: "Dip14" },
          { refdes: "r1", footprint: "0805" },
          { refdes: "c1", footprint: "0805" },
        ],
        nets: [
          { name: "vCc", pins: [{ refdes: "u1", pin: "14" }] },
          { name: "gNd", pins: [{ refdes: "U1", pin: "7" }] },
          {
            name: "nEt1",
            pins: [
              { refdes: "u1", pin: "1" },
              { refdes: "r1", pin: "1" },
            ],
          },
          {
            name: "NeT2",
            pins: [
              { refdes: "u1", pin: "2" },
              { refdes: "r1", pin: "2" },
              { refdes: "c1", pin: "1" },
            ],
          },
          { name: "nEt3", pins: [{ refdes: "c1", pin: "2" }] },
        ],
      };

      const netlist = await parser.parse(padsData);
      expect(netlist.parts).toEqual(expectedNetlist.parts);
      expect(netlist.nets).toEqual(expectedNetlist.nets);
    });
  });

  describe("Invalid PADS files", () => {
    it("should throw an error for missing header", async () => {
      const padsData = fs.readFileSync(
        path.join(INVALID_TEST_FILES_DIR, "invalid_missing_header.pads"),
        "utf8"
      );
      await expect(parser.parse(padsData)).rejects.toThrow(
        new ParserError(ErrorCodes.INVALID_FILE_HEADER, 1)
      );
    });

    it("should throw an error for missing part section", async () => {
      const padsData = fs.readFileSync(
        path.join(INVALID_TEST_FILES_DIR, "invalid_missing_part_section.pads"),
        "utf8"
      );
      await expect(parser.parse(padsData)).rejects.toThrow(
        new ParserError(ErrorCodes.MISSING_PART_SECTION, 1)
      );
    });

    it("should throw an error for missing net section", async () => {
      const padsData = fs.readFileSync(
        path.join(INVALID_TEST_FILES_DIR, "invalid_missing_net_section.pads"),
        "utf8"
      );
      await expect(parser.parse(padsData)).rejects.toThrow(
        new ParserError(ErrorCodes.MISSING_NET_SECTION, 5)
      );
    });

    it("should throw an error for duplicate part", async () => {
      const padsData = fs.readFileSync(
        path.join(INVALID_TEST_FILES_DIR, "invalid_duplicate_part.pads"),
        "utf8"
      );
      await expect(parser.parse(padsData)).rejects.toThrow(
        new ParserError(ErrorCodes.DUPLICATE_PART, 4)
      );
    });

    it("should throw an error for invalid part format", async () => {
      const padsData = fs.readFileSync(
        path.join(INVALID_TEST_FILES_DIR, "invalid_part_format.pads"),
        "utf8"
      );
      await expect(parser.parse(padsData)).rejects.toThrow(
        new ParserError(ErrorCodes.INVALID_PART_FORMAT, 3)
      );
    });

    it("should throw an error for part refdes too long", async () => {
      const padsData = fs.readFileSync(
        path.join(INVALID_TEST_FILES_DIR, "invalid_part_refdes_too_long.pads"),
        "utf8"
      );
      await expect(parser.parse(padsData)).rejects.toThrow(
        new ParserError(ErrorCodes.INVALID_PART_REFDES, 3)
      );
    });

    it("should throw an error for invalid part refdes", async () => {
      const padsData = fs.readFileSync(
        path.join(INVALID_TEST_FILES_DIR, "invalid_part_refdes.pads"),
        "utf8"
      );
      await expect(parser.parse(padsData)).rejects.toThrow(
        new ParserError(ErrorCodes.INVALID_PART_REFDES, 3)
      );
    });

    it("should throw an error for footprint name too long", async () => {
      const padsData = fs.readFileSync(
        path.join(
          INVALID_TEST_FILES_DIR,
          "invalid_footprint_name_too_long.pads"
        ),
        "utf8"
      );
      await expect(parser.parse(padsData)).rejects.toThrow(
        new ParserError(ErrorCodes.FOOTPRINT_NAME_TOO_LONG, 3)
      );
    });

    it("should throw an error for invalid net format", async () => {
      const padsData = fs.readFileSync(
        path.join(INVALID_TEST_FILES_DIR, "invalid_net_format.pads"),
        "utf8"
      );
      await expect(parser.parse(padsData)).rejects.toThrow(
        new ParserError(ErrorCodes.INVALID_NET_FORMAT, 4)
      );
    });

    it("should throw an error for empty net name", async () => {
      const padsData = fs.readFileSync(
        path.join(INVALID_TEST_FILES_DIR, "invalid_empty_net_name.pads"),
        "utf8"
      );
      await expect(parser.parse(padsData)).rejects.toThrow(
        new ParserError(ErrorCodes.EMPTY_NET_NAME, 5)
      );
    });

    it("should throw an error for duplicate net name", async () => {
      const padsData = fs.readFileSync(
        path.join(INVALID_TEST_FILES_DIR, "invalid_duplicate_net_name.pads"),
        "utf8"
      );
      await expect(parser.parse(padsData)).rejects.toThrow(
        new ParserError(ErrorCodes.DUPLICATE_NET_NAME, 6)
      );
    });

    it("should throw an error for net name too long", async () => {
      const padsData = fs.readFileSync(
        path.join(INVALID_TEST_FILES_DIR, "invalid_net_name_too_long.pads"),
        "utf8"
      );
      await expect(parser.parse(padsData)).rejects.toThrow(
        new ParserError(ErrorCodes.NET_NAME_TOO_LONG, 4)
      );
    });

    it("should throw an error for unexpected end of file", async () => {
      const padsData = fs.readFileSync(
        path.join(INVALID_TEST_FILES_DIR, "invalid_unexpected_eof.pads"),
        "utf8"
      );

      await expect(parser.parse(padsData)).rejects.toThrow(
        new ParserError(ErrorCodes.UNEXPECTED_EOF, 7)
      );
    });
  });
});
