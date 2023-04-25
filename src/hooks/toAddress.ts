export default function toAddress(nibbles: number[]) {
  let address = nibbles[0];
  address <<= 4;
  address += nibbles[1];
  address <<= 4;
  address += nibbles[2];
  return address;
}