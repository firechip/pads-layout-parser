export const ErrorCodes = {
    // General File Errors
    FILE_NOT_FOUND: {
      code: "E001",
      message: "File not found.",
    },
    FILE_READ_ERROR: {
      code: "E002",
      message: "Error reading file.",
    },
    INVALID_FILE_HEADER: {
      code: "E003",
      message: "Invalid file header. Expected '*PADS-PCB*' or '*PADS2000*'.",
    },
    UNEXPECTED_EOF: {
      code: "E004",
      message: "Unexpected end of file.",
    },
  
    // Section Errors
    MISSING_PART_SECTION: {
      code: "E101",
      message: "Missing '*PART*' section.",
    },
    MISSING_NET_SECTION: {
      code: "E102",
      message: "Missing '*NET*' section.",
    },
    INVALID_SECTION_HEADER: {
      code: "E103",
      message: "Invalid section header. Expected '*PART*' or '*NET*'.",
    },
    UNEXPECTED_SECTION: {
      code: "E104",
      message: "Unexpected section found.",
    },
  
    // Part Errors
    INVALID_PART_FORMAT: {
      code: "E201",
      message: "Invalid part format. Expected 'RefDes Footprint [Value]'.",
    },
    DUPLICATE_PART: {
      code: "E202",
      message: "Duplicate part reference designator found.",
    },
    PART_REFDES_TOO_LONG: {
      code: "E203",
      message: "Part reference designator exceeds maximum length.",
    },
    INVALID_PART_REFDES: {
      code: "E204",
      message: "Part reference designator contains invalid characters.",
    },
    FOOTPRINT_NAME_TOO_LONG: {
      code: "E205",
      message: "Footprint name exceeds maximum length.",
    },
  
    // Net Errors
    INVALID_NET_FORMAT: {
      code: "E301",
      message: "Invalid net format. Expected '*SIGNAL* NetName'.",
    },
    EMPTY_NET_NAME: {
      code: "E302",
      message: "Net name cannot be empty",
    },
    DUPLICATE_NET_NAME: {
      code: "E303",
      message: "Duplicate net name found.",
    },
    NET_NAME_TOO_LONG: {
      code: "E304",
      message: "Net name exceeds maximum length.",
    },
    INVALID_NET_NAME: {
      code: "E305",
      message: "Net name contains invalid characters.",
    },
  
    // Pin Errors
    INVALID_PIN_FORMAT: {
      code: "E401",
      message: "Invalid pin format. Expected 'RefDes.Pin'.",
    },
    DUPLICATE_PIN: {
      code: "E402",
      message: "Duplicate pin connection found in net.",
    },
    PIN_REFDES_TOO_LONG: {
      code: "E403",
      message: "Pin reference designator exceeds maximum length.",
    },
    PIN_NAME_TOO_LONG: {
      code: "E404",
      message: "Pin name exceeds maximum length.",
    },
  
    // Other Errors
    UNEXPECTED_TOKEN: {
      code: "E501",
      message: "Unexpected token found.",
    },
    MISSING_TOKEN: {
      code: "E502",
      message: "Expected token is missing.",
    },
    // Add more specific error codes as needed...
  };