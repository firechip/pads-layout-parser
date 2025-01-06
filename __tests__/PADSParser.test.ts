import { PADSParser } from '../src/PADSParser';
import { PADSNetlist } from '../src/PADSNetlist';
import { ErrorCodes } from '../src/ErrorCodes';
import { ParserError } from '../src/PADSParserError';
import * as fs from 'fs';
import * as path from 'path';

const VALID_TEST_FILES_DIR = path.join(__dirname, 'valid');
const INVALID_TEST_FILES_DIR = path.join(__dirname, 'invalid');

describe('PADSParser', () => {
  let parser: PADSParser;

  beforeEach(() => {
    parser = new PADSParser();
  });

  describe('Valid PADS files', () => {
    it('should parse a basic valid PADS file', () => {
      const padsData = fs.readFileSync(path.join(VALID_TEST_FILES_DIR, 'basic.pads'), 'utf8');
      const expectedNetlist: PADSNetlist = {
        parts: [
          { refdes: 'U1', footprint: 'DIP14' },
          { refdes: 'R1', footprint: '0805' },
          { refdes: 'C1', footprint: '0805' },
        ],
        nets: [
          { name: 'VCC', pins: [{ refdes: 'U1', pin: '14' }] },
          { name: 'GND', pins: [{ refdes: 'U1', pin: '7' }] },
          { name: 'NET1', pins: [{ refdes: 'U1', pin: '1' }, { refdes: 'R1', pin: '1' }] },
          { name: 'NET2', pins: [{ refdes: 'U1', pin: '2' }, { refdes: 'R1', pin: '2' }, {refdes: 'C1', pin: '1'}] },
          { name: 'NET3', pins: [{ refdes: 'C1', pin: '2' }]},
        ],
      };

      const netlist = parser.parse(padsData);
      expect(netlist.parts).toEqual(expectedNetlist.parts);
      expect(netlist.nets).toEqual(expectedNetlist.nets);
    });

    it('should parse a valid PADS file with values in part definition', () => {
        const padsData = fs.readFileSync(path.join(VALID_TEST_FILES_DIR, 'values.pads'), 'utf8');
        const expectedNetlist: PADSNetlist = {
            parts: [
                { refdes: 'R1', footprint: 'RES0805', value: "10k" },
                { refdes: 'C1', footprint: 'CAP0805', value: "0.1uF" },
                { refdes: 'U1', footprint: 'QFP44', value: "MICROC" },
            ],
            nets: [
                { name: 'VCC', pins: [{ refdes: 'U1', pin: '44' }] },
                { name: 'GND', pins: [{ refdes: 'U1', pin: '22' }] },
                { name: 'DATA', pins: [{ refdes: 'U1', pin: '1' }, { refdes: 'R1', pin: '1' }] },
                { name: 'CLK', pins: [{ refdes: 'U1', pin: '2' }, { refdes: 'C1', pin: '2' }] },
            ],
        };

        const netlist = parser.parse(padsData);
        expect(netlist.parts).toEqual(expectedNetlist.parts);
        expect(netlist.nets).toEqual(expectedNetlist.nets);
    });

    it('should parse a valid PADS file with empty sections', () => {
        const padsData = fs.readFileSync(path.join(VALID_TEST_FILES_DIR, 'empty_part_section.pads'), 'utf8');
        let netlist = parser.parse(padsData);
        expect(netlist.parts).toEqual([]);
        
        const padsData2 = fs.readFileSync(path.join(VALID_TEST_FILES_DIR, 'empty_net_section.pads'), 'utf8');
        netlist = parser.parse(padsData2);
        expect(netlist.nets).toEqual([]);
    });

    it('should handle multiple nets correctly', () => {
        const padsData = fs.readFileSync(path.join(VALID_TEST_FILES_DIR, 'multiple_nets.pads'), 'utf8');
        const expectedNetlist: PADSNetlist = {
            parts: [
                { refdes: 'U1', footprint: 'DIP14' },
                { refdes: 'R1', footprint: '0805' },
                { refdes: 'R2', footprint: '0805' },
                { refdes: 'C1', footprint: '0805' },
                { refdes: 'C2', footprint: '0805' },
            ],
            nets: [
                { name: 'VCC', pins: [{ refdes: 'U1', pin: '14' }] },
                { name: 'GND', pins: [{ refdes: 'U1', pin: '7' }] },
                { name: 'NET1', pins: [{ refdes: 'U1', pin: '1' }, { refdes: 'R1', pin: '1' }] },
                { name: 'NET2', pins: [{ refdes: 'U1', pin: '2' }, { refdes: 'R2', pin: '1' }] },
                { name: 'NET3', pins: [{ refdes: 'R1', pin: '2' }, { refdes: 'C1', pin: '1' }] },
                { name: 'NET4', pins: [{ refdes: 'R2', pin: '2' }, { refdes: 'C2', pin: '1' }] },
                { name: 'NET5', pins: [{ refdes: 'C1', pin: '2' }, { refdes: 'C2', pin: '2' }]},
            ],
        };

        const netlist = parser.parse(padsData);
        expect(netlist.parts).toEqual(expectedNetlist.parts);
        expect(netlist.nets).toEqual(expectedNetlist.nets);
    });

    it('should handle long names correctly', () => {
        const padsData = fs.readFileSync(path.join(VALID_TEST_FILES_DIR, 'long_names.pads'), 'utf8');
        const expectedNetlist: PADSNetlist = {
            parts: [
                { refdes: 'THISISAVE', footprint: 'DIP14' },
                { refdes: 'R1234567', footprint: '0805' },
            ],
            nets: [
                { name: 'THISISAVERYLONGNETNAME1234567890', pins: [{ refdes: 'THISISAVE', pin: '1' }, { refdes: 'R1234567', pin: '1' }] },
                { name: 'SHORTNET', pins: [{ refdes: 'THISISAVE', pin: '2' }, { refdes: 'R1234567', pin: '2' }] },
            ],
        };

        const netlist = parser.parse(padsData);
        expect(netlist.parts).toEqual(expectedNetlist.parts);
        expect(netlist.nets).toEqual(expectedNetlist.nets);
    });

    it('should parse a valid PADS file with comments', () => {
        const padsData = fs.readFileSync(path.join(VALID_TEST_FILES_DIR, 'comments.pads'), 'utf8');
        const expectedNetlist: PADSNetlist = {
            parts: [
                { refdes: 'U1', footprint: 'DIP14' },
                { refdes: 'R1', footprint: '0805' },
            ],
            nets: [
                { name: 'VCC', pins: [{ refdes: 'U1', pin: '14' }] },
                { name: 'GND', pins: [{ refdes: 'U1', pin: '7' }] },
                { name: 'NET1', pins: [{ refdes: 'U1', pin: '1' }, { refdes: 'R1', pin: '1' }] },
            ],
        };

        const netlist = parser.parse(padsData);
        expect(netlist.parts).toEqual(expectedNetlist.parts);
        expect(netlist.nets).toEqual(expectedNetlist.nets);
    });

    it('should parse a valid PADS file with different order sections', () => {
        const padsData = fs.readFileSync(path.join(VALID_TEST_FILES_DIR, 'diff_order_sections.pads'), 'utf8');
        const expectedNetlist: PADSNetlist = {
            parts: [
                { refdes: 'U1', footprint: 'DIP14' },
                { refdes: 'R1', footprint: '0805' },
                { refdes: 'C1', footprint: '0805' },
            ],
            nets: [
                { name: 'VCC', pins: [{ refdes: 'U1', pin: '14' }] },
                { name: 'GND', pins: [{ refdes: 'U1', pin: '7' }] },
                { name: 'NET1', pins: [{ refdes: 'U1', pin: '1' }, { refdes: 'R1', pin: '1' }] },
                { name: 'NET2', pins: [{ refdes: 'U1', pin: '2' }, { refdes: 'R1', pin: '2' }, {refdes: 'C1', pin: '1'}] },
                { name: 'NET3', pins: [{ refdes: 'C1', pin: '2' }]},
            ],
        };

        const netlist = parser.parse(padsData);
        expect(netlist.parts).toEqual(expectedNetlist.parts);
        expect(netlist.nets).toEqual(expectedNetlist.nets);
    });

    it('should parse a valid PADS file with different case sensitive keywords', () => {
        const padsData = fs.readFileSync(path.join(VALID_TEST_FILES_DIR, 'case_sensitive.pads'), 'utf8');
        const expectedNetlist: PADSNetlist = {
            parts: [
                { refdes: 'U1', footprint: 'Dip14' },
                { refdes: 'r1', footprint: '0805' },
                { refdes: 'c1', footprint: '0805' },
            ],
            nets: [
                { name: 'vCc', pins: [{ refdes: 'u1', pin: '14' }] },
                { name: 'gNd', pins: [{ refdes: 'U1', pin: '7' }] },
                { name: 'nEt1', pins: [{ refdes: 'u1', pin: '1' }, { refdes: 'r1', pin: '1' }] },
                { name: 'NeT2', pins: [{ refdes: 'u1', pin: '2' }, { refdes: 'r1', pin: '2' }, {refdes: 'c1', pin: '1'}] },
                { name: 'nEt3', pins: [{ refdes: 'c1', pin: '2' }]},
            ],
        };

        const netlist = parser.parse(padsData);
        expect(netlist.parts).toEqual(expectedNetlist.parts);
        expect(netlist.nets).toEqual(expectedNetlist.nets);
    });


    // Add more tests for valid cases...
  });

  describe('Invalid PADS files', () => {
    it('should throw an error for missing header', () => {
      const padsData = fs.readFileSync(path.join(INVALID_TEST_FILES_DIR, 'invalid_missing_header.pads'), 'utf8');
      expect(() => parser.parse(padsData)).toThrowError(
        new ParserError(ErrorCodes.INVALID_FILE_HEADER, 1) // Error on line 1
      );
    });

    it('should throw an error for missing part section', () => {
      const padsData = fs.readFileSync(path.join(INVALID_TEST_FILES_DIR, 'invalid_missing_part_section.pads'), 'utf8');
      expect(() => parser.parse(padsData)).toThrowError(
        new ParserError(ErrorCodes.MISSING_PART_SECTION, 1)
      );
    });

    it('should throw an error for missing net section', () => {
        const padsData = fs.readFileSync(path.join(INVALID_TEST_FILES_DIR, 'invalid_missing_net_section.pads'), 'utf8');
        expect(() => parser.parse(padsData)).toThrowError(
          new ParserError(ErrorCodes.MISSING_NET_SECTION, 5)
        );
      });

    it('should throw an error for duplicate part', () => {
        const padsData = fs.readFileSync(path.join(INVALID_TEST_FILES_DIR, 'invalid_duplicate_part.pads'), 'utf8');
      expect(() => parser.parse(padsData)).toThrowError();
    });

    it('should throw an error for invalid part format', () => {
        const padsData = fs.readFileSync(path.join(INVALID_TEST_FILES_DIR, 'invalid_part_format.pads'), 'utf8');
      expect(() => parser.parse(padsData)).toThrowError(
        new ParserError(ErrorCodes.INVALID_PART_FORMAT, 3)
      );
    });

    it('should throw an error for part refdes too long', () => {
        const padsData = fs.readFileSync(path.join(INVALID_TEST_FILES_DIR, 'invalid_part_refdes_too_long.pads'), 'utf8');
      expect(() => parser.parse(padsData)).toThrowError();
    });

    it('should throw an error for invalid part refdes', () => {
        const padsData = fs.readFileSync(path.join(INVALID_TEST_FILES_DIR, 'invalid_part_refdes.pads'), 'utf8');
      expect(() => parser.parse(padsData)).toThrowError(
        new ParserError(ErrorCodes.INVALID_PART_REFDES, 3)
      );
    });

    it('should throw an error for footprint name too long', () => {
        const padsData = fs.readFileSync(path.join(INVALID_TEST_FILES_DIR, 'invalid_footprint_name_too_long.pads'), 'utf8');
      expect(() => parser.parse(padsData)).toThrowError();
    });

    it('should throw an error for invalid net format', () => {
        const padsData = fs.readFileSync(path.join(INVALID_TEST_FILES_DIR, 'invalid_net_format.pads'), 'utf8');
      expect(() => parser.parse(padsData)).toThrowError(
        new ParserError(ErrorCodes.INVALID_NET_FORMAT, 4)
      );
    });

    it('should throw an error for empty net name', () => {
        const padsData = fs.readFileSync(path.join(INVALID_TEST_FILES_DIR, 'invalid_empty_net_name.pads'), 'utf8');
      expect(() => parser.parse(padsData)).toThrowError(
        new ParserError(ErrorCodes.EMPTY_NET_NAME, 5)
      );
    });

    it('should throw an error for duplicate net name', () => {
        const padsData = fs.readFileSync(path.join(INVALID_TEST_FILES_DIR, 'invalid_duplicate_net_name.pads'), 'utf8');
      expect(() => parser.parse(padsData)).toThrowError();
    });

    it('should throw an error for net name too long', () => {
        const padsData = fs.readFileSync(path.join(INVALID_TEST_FILES_DIR, 'invalid_net_name_too_long.pads'), 'utf8');
      expect(() => parser.parse(padsData)).toThrowError();
    });

    it('should throw an error for invalid net name', () => {
        const padsData = fs.readFileSync(path.join(INVALID_TEST_FILES_DIR, 'invalid_net_name.pads'), 'utf8');
      expect(() => parser.parse(padsData)).toThrowError(
        new ParserError(ErrorCodes.INVALID_NET_NAME, 5)
      );
    });

    it('should throw an error for invalid pin format', () => {
        const padsData = fs.readFileSync(path.join(INVALID_TEST_FILES_DIR, 'invalid_pin_format.pads'), 'utf8');
      expect(() => parser.parse(padsData)).toThrowError(
        new ParserError(ErrorCodes.INVALID_PIN_FORMAT, 5)
      );
    });

    it('should throw an error for duplicate pin', () => {
        const padsData = fs.readFileSync(path.join(INVALID_TEST_FILES_DIR, 'invalid_duplicate_pin.pads'), 'utf8');
      expect(() => parser.parse(padsData)).toThrowError(
        new ParserError(ErrorCodes.DUPLICATE_PIN, 6)
      );
    });

    it('should throw an error for pin refdes too long', () => {
        const padsData = fs.readFileSync(path.join(INVALID_TEST_FILES_DIR, 'invalid_pin_refdes_too_long.pads'), 'utf8');
        expect(() => parser.parse(padsData)).toThrowError();
    });

    it('should throw an error for unexpected end of file', () => {
        const padsData = fs.readFileSync(path.join(INVALID_TEST_FILES_DIR, 'invalid_unexpected_eof.pads'), 'utf8');
        expect(() => parser.parse(padsData)).toThrowError(
          new ParserError(ErrorCodes.UNEXPECTED_EOF, 6)
        );
      });
    // Add more tests for invalid cases...
  });

  // Add more describe() blocks for other aspects of the parser...
});