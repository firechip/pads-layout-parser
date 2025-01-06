# PADS Layout Parser

[![npm version](https://badge.fury.io/js/pads-layout-parser.svg)](https://badge.fury.io/js/pads-layout-parser)
[![Downloads](https://img.shields.io/npm/dm/pads-layout-parser.svg)](https://www.npmjs.com/package/pads-layout-parser)
[![Build Status](https://travis-ci.com/firechip/pads-layout-parser.svg?branch=main)](https://travis-ci.com/firechip/pads-layout-parser)
[![Coverage Status](https://coveralls.io/repos/github/firechip/pads-layout-parser/badge.svg?branch=main)](https://coveralls.io/github/firechip/pads-layout-parser?branch=main)

The **PADS Layout Parser** is a modern TypeScript library for parsing netlists in the PADS Layout ASCII format (`.asc` files). It transforms netlist data into a structured object representation, ideal for circuit analysis, design automation, and data conversion tasks.

## 🚀 Features

- ✅ Parses PADS Layout ASCII netlist files
- ✅ Handles `*PART*` and `*NET*` sections
- ✅ Extracts part reference designators, footprints, and optional values
- ✅ Extracts net names and pin connections
- ✅ Provides robust error handling
- ✅ Fully typed TypeScript API for enhanced developer experience

## 📦 Installation

```bash
npm install pads-layout-parser
```

## 📖 Usage Examples

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
const netlist: PADSNetlist = parser.parse(padsData);
console.log(JSON.stringify(netlist, null, 2));

const filename = 'my_netlist.asc';
const fileContent = fs.readFileSync(filename, 'utf8');
const netlistFromFile = parser.parse(fileContent);
console.log(JSON.stringify(netlistFromFile, null, 2));
```

## 📚 API Reference

### `PADSParser`

- **`constructor()`**: Creates a new parser instance.
- **`parse(data: string): PADSNetlist`**: Parses a PADS netlist string.

### `PADSNetlist` Interface

```typescript
interface PADSNetlist {
  parts: PADSPart[];
  nets: PADSNet[];
}
```

### `PADSPart` Interface

```typescript
interface PADSPart {
  refdes: string;
  footprint: string;
  value?: string;
}
```

### `PADSNet` Interface

```typescript
interface PADSNet {
  name: string;
  pins: PADSPin[];
}
```

### `PADSPin` Interface

```typescript
interface PADSPin {
  refdes: string;
  pin: string;
}
```

## ⚙️ Error Handling

The parser throws detailed error messages with line numbers and issue descriptions when it encounters invalid syntax or unexpected data.

## 🧪 Testing & Coverage

Run the test suite using:
```bash
npm test
```

Code coverage reports are automatically generated via Coveralls.

## 👥 Contributing

Contributions are welcome! Please review our [Contributing Guidelines](https://github.com/firechip/pads-layout-parser/blob/main/CONTRIBUTING.md) before submitting a pull request.

## 📄 License

This project is licensed under the [MIT License](https://github.com/firechip/pads-layout-parser/blob/main/LICENSE).

## 📈 Development

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

