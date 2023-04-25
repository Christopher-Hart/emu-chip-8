import { useMemo, useRef } from "react";
import { fetchInstruction } from "../processor/Processor";
import decodeInstruction from "../../hooks/decodeInstruction";
import useMachineState from "../MachineState";

const FETCH_AMOUNT = 1000;

export default function Disassembly() {
  const romLoaded = useMachineState((state) => state.rom_loaded);
  const memory = useMachineState((state) => state.memory);
  const pc = useMachineState((state) => state.program_counter);
  const self = useRef<HTMLDivElement>(null)

  const instructions = useMemo(
    () => projectInstruction(pc, memory),
    [romLoaded]
  );

  return (
    <div ref={self} style={{fontFamily:"monospace", fontSize: "14pt", whiteSpace: "pre-wrap", overflowY: "auto", height: "200px", width: "250px"}}>
      {instructions.map((instruction) => (
        <p className={instruction.address == pc?"active":""}>{`0x${instruction.address.toString(16).padStart(3, "0")}: ${
          instruction.string
        }`}</p>
      ))}
    </div>
  );
}

function projectInstruction(pc: number, memory: Uint8Array) {
  let projection_counter = pc;
  let instructions = [];
  for (var i = 0; i < FETCH_AMOUNT; i++) {
    const instruction = fetchInstruction(projection_counter, memory);
    const decoded_instruction = decodeInstruction(instruction);
    instructions.push({
      address: projection_counter,
      string: decoded_instruction,
    });
    projection_counter += 2;
  }
  return instructions;
}
