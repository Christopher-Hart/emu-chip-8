import toAddress from "./toAddress";
import toNibbles from "./toNibbles";

export default function decodeInstruction(instruction: number[]) {
  let string_instrction = "";
  const nibbles = toNibbles(instruction);
  switch (true) {
    case instruction[0] === 0 && instruction[1] === 0: {
      string_instrction = `NO OP`
      break;
    }
    
    case instruction[0] === 0 && instruction[1] === 0xee: {
      string_instrction = `RET`;
      break;
    }

    case instruction[0] === 0 && instruction[1] === 0xe0: {
      string_instrction = `CLS`;
      break;
    }

    case nibbles[0] === 0: {
      string_instrction = `SYS [IGNORED]`;
      break;
    }

    case nibbles[0] === 1: {
      string_instrction = `JP 0x${toAddress([
        nibbles[1],
        nibbles[2],
        nibbles[3],
      ])
        .toString(16)
        .padStart(3, "0")}`;
      break;
    }

    case nibbles[0] === 2: {
      string_instrction = `CALL 0x${toAddress([
        nibbles[1],
        nibbles[2],
        nibbles[3],
      ])
        .toString(16)
        .padStart(3, "0")}`;
      break;
    }

    case nibbles[0] === 3: {
      string_instrction = `SE V${nibbles[1].toString(
        16
      )}, 0x${instruction[1].toString(16)}`;
      break;
    }

    case nibbles[0] === 4: {
      string_instrction = `SNE V${nibbles[1].toString(
        16
      )}, 0x${instruction[1].toString(16)}`;
      break;
    }

    case nibbles[0] === 5 && nibbles[3] === 0: {
      string_instrction = `SE V${nibbles[1].toString(
        16
      )}, V${nibbles[2].toString(16)}`;
      break;
    }

    case nibbles[0] === 6: {
      string_instrction = `LD V${nibbles[1].toString(
        16
      )}, 0x${instruction[1].toString(16)}`;
      break;
    }

    case nibbles[0] === 7: {
      string_instrction = `ADD V${nibbles[1].toString(
        16
      )}, 0x${instruction[1].toString(16)}`;
      break;
    }

    case nibbles[0] === 8 && nibbles[3] === 0: {
      string_instrction = `LD V${nibbles[1].toString(
        16
      )}, V${nibbles[2].toString(16)}`;
      break;
    }

    case nibbles[0] === 8 && nibbles[3] === 1: {
      string_instrction = `OR V${nibbles[1].toString(
        16
      )}, V${nibbles[2].toString(16)}`;
      break;
    }

    case nibbles[0] === 8 && nibbles[3] === 2: {
      string_instrction = `AND V${nibbles[1].toString(
        16
      )}, V${nibbles[2].toString(16)}`;
      break;
    }

    case nibbles[0] === 8 && nibbles[3] === 3: {
      string_instrction = `XOR V${nibbles[1].toString(
        16
      )}, V${nibbles[2].toString(16)}`;
      break;
    }

    case nibbles[0] === 8 && nibbles[3] === 4: {
      string_instrction = `ADD V${nibbles[1].toString(
        16
      )}, V${nibbles[2].toString(16)}`;
      break;
    }

    case nibbles[0] === 8 && nibbles[3] === 5: {
      string_instrction = `SUB V${nibbles[1].toString(
        16
      )}, V${nibbles[2].toString(16)}`;
      break;
    }

    case nibbles[0] === 8 && nibbles[3] === 6: {
      string_instrction = `SHR V${nibbles[1].toString(
        16
      )} {, V${nibbles[2].toString(16)}}`;
      break;
    }

    case nibbles[0] === 8 && nibbles[3] === 7: {
      string_instrction = `SUBN V${nibbles[1].toString(
        16
      )}, V${nibbles[2].toString(16)}`;
      break;
    }

    case nibbles[0] === 8 && nibbles[3] === 0xe: {
      string_instrction = `SHL V${nibbles[1].toString(
        16
      )} {, V${nibbles[2].toString(16)}}`;
      break;
    }

    case nibbles[0] === 9 && nibbles[3] === 0: {
      string_instrction = `SNE V${nibbles[1].toString(
        16
      )}, V${nibbles[2].toString(16)}`;
      break;
    }

    case nibbles[0] === 0xa: {
      string_instrction = `LD I, 0x${toAddress([
        nibbles[1],
        nibbles[2],
        nibbles[3],
      ])
        .toString(16)
        .padStart(3, "0")}`;
      break;
    }

    case nibbles[0] === 0xb: {
      string_instrction = `JP V0, 0x${toAddress([
        nibbles[1],
        nibbles[2],
        nibbles[3],
      ])
        .toString(16)
        .padStart(3, "0")}`;
      break;
    }

    case nibbles[0] === 0xc: {
      string_instrction = `RND V${nibbles[1].toString(
        16
      )}, 0x${instruction[1].toString(16)}`;
      break;
    }

    case nibbles[0] === 0xd: {
      string_instrction = `DRW V${nibbles[1].toString(
        16
      )}, V${nibbles[2].toString(
        16
      )}, 0x${nibbles[3].toString(16)}`;
      break;
    }

    case nibbles[0] === 0xe && instruction[1] === 0x9e: {
      string_instrction = `SKP V${nibbles[1].toString(
        16
      )}`;
      break;
    }

    case nibbles[0] === 0xe && instruction[1] === 0xa1: {
      string_instrction = `SKNP V${nibbles[1].toString(
        16
      )}`;
      break;
    }

    case nibbles[0] === 0xf && instruction[1] === 0x07: {
      string_instrction = `LD V${nibbles[1].toString(
        16
      )}, DT`;
      break;
    }

    case nibbles[0] === 0xf && instruction[1] === 0x0a: {
      string_instrction = `LD V${nibbles[1].toString(
        16
      )}, K`;
      break;
    }

    case nibbles[0] === 0xf && instruction[1] === 0x15: {
      string_instrction = `LD DT, V${nibbles[1].toString(
        16
      )}`;
      break;
    }

    case nibbles[0] === 0xf && instruction[1] === 0x18: {
      string_instrction = `LD ST, V${nibbles[1].toString(
        16
      )}`;
      break;
    }

    case nibbles[0] === 0xf && instruction[1] === 0x1e: {
      string_instrction = `ADD I, V${nibbles[1].toString(
        16
      )}`;
      break;
    }

    case nibbles[0] === 0xf && instruction[1] === 0x29: {
      string_instrction = `LD F, V${nibbles[1].toString(
        16
      )}`;
      break;
    }

    case nibbles[0] === 0xf && instruction[1] === 0x33: {
      string_instrction = `LD B, V${nibbles[1].toString(
        16
      )}`;
      break;
    }

    case nibbles[0] === 0xf && instruction[1] === 0x55: {
      string_instrction = `LD [I], V${nibbles[1].toString(
        16
      )}`;
      break;
    }

    case nibbles[0] === 0xf && instruction[1] === 0x65: {
      string_instrction = `LD V${nibbles[1].toString(
        16
      )}, [I]`;
      break;
    }
  }
  return string_instrction;
}
