import { useEffect, useRef, useState } from "react";
import useMachineState from "../MachineState/MachineState";
import "./style.css";

export default function Display() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const Chip = useMachineState(state => state.chip)


  useEffect(() => {
    if(Chip.ctx === null && canvas.current) {
      Chip.setCanvas(canvas.current)
    }
  },[])

  return (
    <div className="chip-8-display">
      <canvas ref={canvas} width={832} height={416}></canvas>
    </div>
  );
}
