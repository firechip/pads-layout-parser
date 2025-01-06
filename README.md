Here is an improved version of the README with a more detailed description of the file formats and the system:

---

# PADS Layout Parser

[![npm version](https://badge.fury.io/js/pads-layout-parser.svg)](https://badge.fury.io/js/pads-layout-parser)
[![pages-build-deployment](https://github.com/firechip/pads-layout-parser/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/firechip/pads-layout-parser/actions/workflows/pages/pages-build-deployment)
[![Downloads](https://img.shields.io/npm/dm/pads-layout-parser.svg)](https://www.npmjs.com/package/pads-layout-parser)
[![Build Status](https://travis-ci.com/firechip/pads-layout-parser.svg?branch=main)](https://travis-ci.com/firechip/pads-layout-parser)
[![Coverage Status](https://coveralls.io/repos/github/firechip/pads-layout-parser/badge.svg?branch=main)](https://coveralls.io/github/firechip/pads-layout-parser?branch=main)

The **PADS Layout Parser** is a modern TypeScript library designed to parse **PADS Layout ASCII files** (`.asc` format), which are widely used in the design and manufacturing of PCBs (Printed Circuit Boards). This library provides an efficient way to transform netlist data from PADS files into structured object representations. These objects can be used for circuit analysis, design automation, or data conversion tasks.

## 🚀 Features

- ✅ Parses PADS Layout ASCII netlist files (`.asc` format).
- ✅ Handles key sections such as `*PART*`, `*NET*`, and `*SIGNAL*`.
- ✅ Extracts important design information like part reference designators, footprints, net names, and pin connections.
- ✅ Robust error handling with line number reporting for invalid syntax or unexpected data.
- ✅ Fully typed TypeScript API for enhanced developer experience.
- ✅ Optimized for compatibility with existing design and simulation tools.

## 📦 Installation

To install the **PADS Layout Parser** library via npm, use the following command:

```bash
npm install pads-layout-parser
```

## 📖 Usage Examples

You can use the library to parse PADS Layout ASCII files and extract the design information, including parts and net connections.

### Parsing from String
```typescript
import { PADSParser, PADSNetlist } from 'pads-layout-parser';

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
const netlist: PADSNetlist = parser.parse(padsData);
console.log(JSON.stringify(netlist, null, 2));
```

### Parsing from File
```typescript
import * as fs from 'fs';
import { PADSParser } from 'pads-layout-parser';

const filename = 'my_netlist.asc';
const fileContent = fs.readFileSync(filename, 'utf8');

const parser = new PADSParser();
const netlistFromFile = parser.parse(fileContent);
console.log(JSON.stringify(netlistFromFile, null, 2));
```

## 📚 File Format Description

### PADS Layout ASCII File Format

The PADS Layout ASCII file format consists of a structured text representation of PCB design data. It uses control statements enclosed in asterisks (`*`) to demarcate different sections. The key sections and their format are described below:

#### `*PADS-PCB*`
The file starts with the `*PADS-PCB*` marker, which indicates that the file is a PADS Layout PCB file. This section does not contain data but signals the start of the file.

#### `*PART*`
The `*PART*` section defines the components in the PCB design. Each part consists of a reference designator (e.g., `U1`) and a footprint (e.g., `MY_FOOTPRINT`). Optionally, a value (e.g., `RES0805`) may also be included.
```plaintext
*PART*
U1 MY_FOOTPRINT
R1 RES0805
```

#### `*NET*`
The `*NET*` section defines the nets in the design. This section starts the netlist definition and does not contain net information itself. It indicates that subsequent `*SIGNAL*` sections will define the connections between pins of parts.
```plaintext
*NET*
```

#### `*SIGNAL*`
The `*SIGNAL*` section defines the actual signal connections between parts in the PCB design. Each signal has a net name (e.g., `NET1`) and one or more pin connections (e.g., `U1.1 R1.1`), where each pin pair represents a connection between two parts.
```plaintext
*SIGNAL* NET1
U1.1 R1.1
*SIGNAL* NET2
U1.2 R1.2
```

#### `*END*`
The `*END*` control statement marks the end of the file or the end of a section.

### Data Structures

The following data structures are used to represent the parsed PADS data:

#### `PADSNetlist`
```typescript
interface PADSNetlist {
  parts: PADSPart[];
  nets: PADSNet[];
}
```

#### `PADSPart`
```typescript
interface PADSPart {
  refdes: string; // Reference designator (e.g., U1, R1)
  footprint: string; // Footprint name (e.g., MY_FOOTPRINT, RES0805)
  value?: string; // Optional value (e.g., RES0805)
}
```

#### `PADSNet`
```typescript
interface PADSNet {
  name: string; // Net name (e.g., NET1, NET2)
  pins: PADSPin[]; // Array of pin pairs
}
```

#### `PADSPin`
```typescript
interface PADSPin {
  refdes: string; // Reference designator (e.g., U1, R1)
  pin: string; // Pin number (e.g., 1, 2)
}
```

## ⚙️ Error Handling

The parser provides detailed error messages when it encounters invalid syntax or unexpected data in the input file. The error messages include line numbers and descriptions of the issue, making it easier to debug PADS Layout ASCII files.

## 🧪 Testing & Coverage

To run the test suite and ensure the parser works correctly, use the following command:

```bash
npm test
```

Code coverage reports are automatically generated and accessible via [Coveralls](https://coveralls.io/github/firechip/pads-layout-parser).

## 👥 Contributing

We welcome contributions! Please review our [Contributing Guidelines](https://github.com/firechip/pads-layout-parser/blob/main/CONTRIBUTING.md) before submitting a pull request.

## 📄 License

This project is licensed under the [MIT License](https://github.com/firechip/pads-layout-parser/blob/main/LICENSE).

## 📈 Development

To set up the project for development, follow these steps:

1. Clone the repository:
    ```bash
    git clone git@github.com:firechip/pads-layout-parser.git
    ```
2. Install dependencies:
    ```bash
    cd pads-layout-parser
    npm install
    ```
3. Build the project:
    ```bash
    npm run build
    ```
4. Run tests:
    ```bash
    npm test
    ```

## 📌 TODO

- [ ] Add more comprehensive unit tests.
- [ ] Improve error handling and reporting.
- [ ] Add support for advanced PADS features.
- [ ] Enhance compatibility with Yosys JSON conversion.

For questions or feedback, feel free to open an issue or reach out to the project maintainers.
