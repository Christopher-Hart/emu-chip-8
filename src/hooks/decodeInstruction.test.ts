import decodeInstruction from "./decodeInstruction";
import toAddress from "./toAddress";
import toNibbles from "./toNibbles";

test("Turn instruction bytes into nibbles", () => {
  expect(toNibbles([0x13, 0x37])).toStrictEqual([0x1, 0x3, 0x3, 0x7]);
});

test("Turn 3-bits into address compresesd of each digit [1,a,3 => 0x1a3]", () => {
  expect(toAddress([0x1, 0xa, 0x3])).toBe(0x1a3);
});

test("Decodes a 2-byte instruction into chip-8 a assembly string", () => {
  expect(decodeInstruction([0x00, 0xe0])).toBe("CLS");
  expect(decodeInstruction([0x00, 0xee])).toBe("RET");
  expect(decodeInstruction([0x03, 0x00])).toBe("SYS [IGNORED]");
  expect(decodeInstruction([0x1a, 0x1b])).toBe("JP 0xa1b");
  expect(decodeInstruction([0x2a, 0x1b])).toBe("CALL 0xa1b");
  expect(decodeInstruction([0x33, 0x2a])).toBe("SE V3, 0x2a");
  expect(decodeInstruction([0x44, 0x2a])).toBe("SNE V4, 0x2a");
  expect(decodeInstruction([0x55, 0x90])).toBe("SE V5, V9");
  expect(decodeInstruction([0x66, 0x2a])).toBe("LD V6, 0x2a");
  expect(decodeInstruction([0x77, 0x2a])).toBe("ADD V7, 0x2a");
  expect(decodeInstruction([0x88, 0x00])).toBe("LD V8, V0");
  expect(decodeInstruction([0x88, 0x11])).toBe("OR V8, V1");
  expect(decodeInstruction([0x88, 0x22])).toBe("AND V8, V2");
  expect(decodeInstruction([0x88, 0x33])).toBe("XOR V8, V3");
  expect(decodeInstruction([0x88, 0x44])).toBe("ADD V8, V4");
  expect(decodeInstruction([0x88, 0x55])).toBe("SUB V8, V5");
  expect(decodeInstruction([0x88, 0x66])).toBe("SHR V8 {, V6}");
  expect(decodeInstruction([0x88, 0x77])).toBe("SUBN V8, V7");
  expect(decodeInstruction([0x88, 0xee])).toBe("SHL V8 {, Ve}");
  expect(decodeInstruction([0xaa, 0x1b])).toBe("LD I, 0xa1b");
  expect(decodeInstruction([0xba, 0x1b])).toBe("JP V0, 0xa1b");
  expect(decodeInstruction([0xcc, 0x2a])).toBe("RND Vc, 0x2a");
  expect(decodeInstruction([0xdd, 0xdd])).toBe("DRW Vd, Vd, 0xd");
  expect(decodeInstruction([0xee, 0x9e])).toBe("SKP Ve");
  expect(decodeInstruction([0xee, 0xa1])).toBe("SKNP Ve");
  expect(decodeInstruction([0xff, 0x07])).toBe("LD Vf, DT");
  expect(decodeInstruction([0xff, 0x0a])).toBe("LD Vf, K");
  expect(decodeInstruction([0xff, 0x15])).toBe("LD DT, Vf");
  expect(decodeInstruction([0xff, 0x18])).toBe("LD ST, Vf");
  expect(decodeInstruction([0xff, 0x1e])).toBe("ADD I, Vf");
  expect(decodeInstruction([0xff, 0x29])).toBe("LD F, Vf");
  expect(decodeInstruction([0xff, 0x33])).toBe("LD B, Vf");
  expect(decodeInstruction([0xff, 0x55])).toBe("LD [I], Vf");
  expect(decodeInstruction([0xff, 0x65])).toBe("LD Vf, [I]");
});
