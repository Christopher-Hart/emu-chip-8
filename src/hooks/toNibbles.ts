export default function toNibbles(bytes: number[]) {
  let nibbles: number[] = [];
  bytes.forEach((byte) => {
    let upper = byte >> 4;
    let lower = byte & 0xf;
    nibbles.push(upper);
    nibbles.push(lower);
  });
  return nibbles;
}