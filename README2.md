# PADS Layout Netlist Parser

[![npm version](https://badge.fury.io/js/pads-layout-parser.svg)](https://badge.fury.io/js/pads-layout-parser)
[![pages-build-deployment](https://github.com/firechip/pads-layout-parser/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/firechip/pads-layout-parser/actions/workflows/pages/pages-build-deployment)
[![Downloads](https://img.shields.io/npm/dm/pads-layout-parser.svg)](https://www.npmjs.com/package/pads-layout-parser)
[![Build Status](https://travis-ci.com/firechip/pads-layout-parser.svg?branch=main)](https://travis-ci.com/firechip/pads-layout-parser)
[![Coverage Status](https://coveralls.io/repos/github/firechip/pads-layout-parser/badge.svg?branch=main)](https://coveralls.io/github/firechip/pads-layout-parser?branch=main)

`pads-layout-parser` is a robust TypeScript library specifically designed for parsing netlists in the **PADS Layout ASCII** format (`.asc` files). It transforms your PADS netlist data into a structured, strongly-typed JavaScript object, ready for integration with your circuit analysis, design automation, or data conversion workflows.  It's built with real-time editors in mind, providing error-tolerant parsing and the ability to handle incomplete files.

## Key Features

*   **Accurate Parsing:** Handles the `*PART*`, `*NET*`, and `*SIGNAL*` sections of PADS Layout ASCII files with precision.
*   **Error Tolerant:** Designed for real-time editing scenarios. Continues parsing even with syntax errors, providing partial results and detailed error reports.
*   **TypeScript Strong Typing:**  Leverages TypeScript interfaces for a clear and maintainable codebase, enhancing developer experience with autocompletion and type checking.
*   **Asynchronous Parsing:** Uses Promises for non-blocking parsing, ensuring a responsive user interface in editor applications.
*   **Informative Error Reporting:** Generates detailed error messages with line numbers and error codes, simplifying debugging of PADS files.
*   **Easy Integration:** Simple and intuitive API for seamless integration into your projects.
*   **Well-Tested:** Includes a comprehensive test suite using Jest to ensure reliability and maintain high code quality.

## Why Use This Parser?

*   **Real-time Editor Integration:**  Specifically designed to parse incomplete PADS netlists during live editing sessions, providing continuous feedback to the user.
*   **PADS to Yosys Conversion:** Serves as a crucial component in converting PADS netlists to the Yosys JSON format, facilitating advanced circuit analysis and synthesis.
*   **Automation:** Enables automation of tasks involving PADS netlist data, such as design rule checking, report generation, and format conversion.

## Installation

```bash
npm install pads-layout-parser
```

## Usage

### Basic Parsing

```typescript
import { PADSParser, PADSNetlist } from 'pads-layout-parser';
import * as fs from 'fs';

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
parser.parse(padsData)
    .then((netlist: PADSNetlist) => {
        console.log(JSON.stringify(netlist, null, 2));
    })
    .catch((error) => {
        console.error('Error parsing PADS data:', error.message);
    });
```

### Parsing from a File

```typescript
import * as fs from 'fs';
import { PADSParser } from 'pads-layout-parser';

const filename = 'my_netlist.asc';
fs.readFile(filename, 'utf8', (err, fileContent) => {
  if (err) {
    console.error(`Error reading file ${filename}:`, err.message);
    return;
  }

  const parser = new PADSParser();
  parser.parse(fileContent)
    .then(netlist => {
      console.log(JSON.stringify(netlist, null, 2));
    })
    .catch(error => {
      console.error(`Error parsing file ${filename}:`, error.message);
    });
});
```

### Partial Parsing for Real-time Editors

Enable partial parsing to handle incomplete files and still get usable results:

```typescript
const parser = new PADSParser(true); // Enable partial parsing
parser.parse(incompletePadsData)
    .then(netlist => {
        console.log("Parsed Netlist (Partial):", JSON.stringify(netlist, null, 2));
        if (netlist.errors && netlist.errors.length > 0) {
            console.warn("Parsing Errors:", netlist.errors);
        }
    });
```

## API Reference

### `PADSParser`

The core class for parsing PADS netlists.

#### `constructor(partialParsing?: boolean)`

Creates a new `PADSParser` instance.

*   `partialParsing` (optional): Enables partial parsing mode for real-time editing. Defaults to `false`.

#### `parse(data: string): Promise<PADSNetlist>`

Parses a PADS netlist from a string asynchronously.

*   `data`: The PADS netlist data as a string.
*   `Returns`: A `Promise` that resolves to the parsed `PADSNetlist` object, including any parsing errors in the `errors` field.
*   `Throws`: A `ParserError` if parsing fails and `partialParsing` is `false`.

### Data Structures

The parser uses the following interfaces to represent the parsed data:

```typescript
// Represents a complete PADS netlist.
interface PADSNetlist {
  parts: PADSPart[];
  nets: PADSNet[];
  errors?: ParserError[]; // Parsing errors, if any
}

// Represents a part in the netlist.
interface PADSPart {
  refdes: string; // Reference designator (e.g., U1, R5)
  footprint: string; // Footprint name (e.g., DIP14, 0805)
  value?: string; // Optional value (e.g., 10k, 74LS00)
}

// Represents a net in the netlist.
interface PADSNet {
  name: string; // Net name (e.g., GND, VCC, N00123)
  pins: PADSPin[]; // Array of connected pins
}

// Represents a pin connection in a net.
interface PADSPin {
  refdes: string; // Reference designator (e.g., U1, R1)
  pin: string; // Pin number or name (e.g., 1, A2)
}
```

### `ParserError`

Represents an error encountered during parsing.

```typescript
class ParserError extends Error {
  code: string; // Error code (see ErrorCodes)
  line: number; // Line number where the error occurred
}
```

### `ErrorCodes`

A set of predefined error codes and messages. See the `ErrorCodes.ts` file for a complete list.

## PADS Layout ASCII File Format

This parser specifically handles the netlist portion of the PADS Layout ASCII file format. Here's a summary of the relevant sections:

### `*PADS-PCB*`

Marks the beginning of the PADS Layout ASCII file.

### `*PART*`

Defines the components used in the design.

**Format:**

```
*PART*
RefDes Footprint [Value]
...
```

**Example:**

```
*PART*
U1 DIP14
R1 RES0805@10k
C1 CAP0805@0.1uF
```

### `*NET*`

Starts the netlist definition section.

### `*SIGNAL*`

Defines a single net and its connections.

**Format:**

```
*NET*
*SIGNAL* NetName
RefDes.Pin RefDes.Pin ...
```

**Example:**

```
*NET*
*SIGNAL* VCC
U1.14
*SIGNAL* GND
U1.7
*SIGNAL* NET1
U1.1 R1.1
```

### `*END*`

Marks the end of the PADS Layout ASCII file.

## Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](https://github.com/firechip/pads-layout-parser/blob/main/CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the [MIT License](https://github.com/firechip/pads-layout-parser/blob/main/LICENSE).

## Development

(Instructions for cloning, installing, building, and testing the project - same as before)
