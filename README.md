# PADS Layout Parser

[![npm version](https://badge.fury.io/js/pads-layout-parser.svg)](https://badge.fury.io/js/pads-layout-parser)
[![Downloads](https://img.shields.io/npm/dm/pads-layout-parser.svg)](https://www.npmjs.com/package/pads-layout-parser)
[![Build Status](https://travis-ci.com/firechip/pads-layout-parser.svg?branch=main)](https://travis-ci.com/firechip/pads-layout-parser)
[![Coverage Status](https://coveralls.io/repos/github/firechip/pads-layout-parser/badge.svg?branch=main)](https://coveralls.io/github/firechip/pads-layout-parser?branch=main)

`pads-layout-parser` is a TypeScript library for parsing netlists in the PADS Layout ASCII format (`.asc` files). It provides a structured object representation of the netlist data, making it easy to process and convert to other formats like the Yosys JSON format used for circuit analysis and visualization.

## Features

*   Parses PADS Layout ASCII netlist files.
*   Handles `*PART*` and `*NET*` sections.
*   Extracts part reference designators, footprint names, and optional values.
*   Extracts net names and pin connections.
*   Provides error handling for invalid or unexpected input.
*   Provides a simple and easy-to-use API.
*   Written in TypeScript with type safety.

## Installation

```bash
npm install pads-layout-parser
````

## Usage

```typescript
import { PADSParser, PADSNetlist } from 'pads-layout-parser';
import * as fs from 'fs';

// Example 1: Parse a PADS netlist from a string
const padsData = `
*PADS-PCB*
*PART*
U1 MY_FOOTPRINT
R1 RES0805
*NET*
*SIGNAL* NET1
U1.1 R1.1
*SIGNAL* NET2
U1.2 R1.2
*END*
`;

const parser = new PADSParser();
try {
  const netlist: PADSNetlist = parser.parse(padsData);
  console.log(JSON.stringify(netlist, null, 2));
} catch (error) {
  console.error('Error parsing PADS data:', error.message);
}

// Example 2: Parse a PADS netlist from a file
const filename = 'my_netlist.asc';
try {
  const fileContent = fs.readFileSync(filename, 'utf8');
  const netlist: PADSNetlist = parser.parse(fileContent);
  console.log(JSON.stringify(netlist, null, 2));
} catch (error) {
  console.error(`Error reading or parsing file ${filename}:`, error.message);
}
```

## API Reference

### `PADSParser`

The main class for parsing PADS netlists.

#### `constructor()`

Creates a new `PADSParser` instance.

#### `parse(data: string): PADSNetlist`

Parses a PADS netlist from a string.

  * `data`: The PADS netlist data as a string.
  * `Returns`: The parsed `PADSNetlist` object.
  * `Throws`: An `Error` if parsing fails.

### `PADSNetlist`

An interface representing the parsed PADS netlist.

```typescript
interface PADSNetlist {
  parts: PADSPart[];
  nets: PADSNet[];
}
```

### `PADSPart`

An interface representing a part in the netlist.

```typescript
interface PADSPart {
  refdes: string;
  footprint: string;
  value?: string; // Optional value
}
```

### `PADSNet`

An interface representing a net in the netlist.

```typescript
interface PADSNet {
  name: string;
  pins: PADSPin[];
}
```

### `PADSPin`

An interface representing a pin connection in a net.

```typescript
interface PADSPin {
  refdes: string;
  pin: string;
}
```

## Error Handling

The `PADSParser` throws an `Error` object if it encounters invalid syntax or unexpected data in the PADS file. The error message will provide information about the location and nature of the error, including the line number if available.

## Contributing

Contributions are welcome\! Please feel free to submit issues or pull requests on [GitHub](https://www.google.com/url?sa=E&source=gmail&q=https://github.com/firechip/pads-layout-parser).

## License

This project is licensed under the MIT License - see the [LICENSE](https://www.google.com/url?sa=E&source=gmail&q=LICENSE) file for details.

## Development

To get started with development:

1.  Clone the repository:
    ```bash
    git clone [invalid URL removed]
    ```
2.  Install dependencies:
    ```bash
    cd pads-layout-parser
    npm install
    ```
3.  Build the project:
    ```bash
    npm run build
    ```
4.  Run tests:
    ```bash
    npm test
    ```

## TODO

  * Add more comprehensive unit tests.
  * Improve error handling and reporting.
  * Add support for more advanced PADS features (if needed).
  * Integrate with Yosys JSON conversion.

