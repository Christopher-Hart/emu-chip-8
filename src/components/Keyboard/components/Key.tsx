import { useEffect, useState } from "react";
import "../style.css";
import useMachineState from "../../MachineState";

interface KeyProp {
  value: string;
  pressed: boolean;
}

export default function Chip8Key(props: KeyProp) {
  
  return (
    <div className={`chip-8-key ${props.pressed ? "pressed" : ""}`}>
      {props.value}
    </div>
  );
}
11;
