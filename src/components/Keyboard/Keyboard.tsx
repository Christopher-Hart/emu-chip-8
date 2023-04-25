
import { useKeyboard } from "../../hooks/useKeyboard";
import Chip8Key from "./components/Key";
import "./style.css";
export default function Keyboard() {
  const {keys} = useKeyboard();

  return (
    <div className="chip-8-keyboard">
      <Chip8Key value="1" pressed={keys[1]}></Chip8Key>
      <Chip8Key value="2" pressed={keys[2]}></Chip8Key>
      <Chip8Key value="3" pressed={keys[3]}></Chip8Key>
      <Chip8Key value="C" pressed={keys[0xc]}></Chip8Key>

      <Chip8Key value="4" pressed={keys[4]}></Chip8Key>
      <Chip8Key value="5" pressed={keys[5]}></Chip8Key>
      <Chip8Key value="6" pressed={keys[6]}></Chip8Key>
      <Chip8Key value="D" pressed={keys[0xd]}></Chip8Key>

      <Chip8Key value="7" pressed={keys[7]}></Chip8Key>
      <Chip8Key value="8" pressed={keys[8]}></Chip8Key>
      <Chip8Key value="9" pressed={keys[9]}></Chip8Key>
      <Chip8Key value="E" pressed={keys[0xe]}></Chip8Key>

      <Chip8Key value="A" pressed={keys[0xa]}></Chip8Key>
      <Chip8Key value="0" pressed={keys[0]}></Chip8Key>
      <Chip8Key value="B" pressed={keys[0xb]}></Chip8Key>
      <Chip8Key value="F" pressed={keys[0xf]}></Chip8Key>
    </div>
  );
}
