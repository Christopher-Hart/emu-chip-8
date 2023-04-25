import { useEffect, useRef, useState } from "react";
import useInterval from "../../hooks/useInterval";
import useMachineState from "../MachineState";
import toNibbles from "../../hooks/toNibbles";
import toAddress from "../../hooks/toAddress";
import { useKeyboard } from "../../hooks/useKeyboard";
import { Chip_8 } from "../MachineState/Chip_8";

const FPS = 60;

export default function Processor() {
  const Machine = useMachineState();
  const { keys, forceUp } = useKeyboard();
  const Chip = useMachineState(state => state.chip)
  const instuction = useRef<number>(0);
  const [blocked,setBlocked] = useState(false)


  const [going, setGoing] = useState(false);

  function processInstruction(instruction: number[]) {
    const nibbles = toNibbles(instruction);

    switch (true) {
      //NO OP
      case instruction[0] === 0 && instruction[1] === 0: {
        break;
      }

      // Return from call
      case instruction[0] === 0 && instruction[1] === 0xee: {
        Chip.program_counter = Chip.stack.pop() as number;
        break;
      }

      // Clear frame buffer
      case instruction[0] === 0 && instruction[1] === 0xe0: {
        Chip.clearFrameBuffer()
        break;
      }

      // SYS CALLS IGNORED
      case nibbles[0] === 0: {
        break;
      }

      // Jump to Address
      case nibbles[0] === 1: {
        const address = toAddress([nibbles[1], nibbles[2], nibbles[3]]);
        Chip.program_counter = address - 2;
        break;
      }

      // Call function at address
      case nibbles[0] === 2: {
        const address = toAddress([nibbles[1], nibbles[2], nibbles[3]]);
        Chip.stack.push(Chip.program_counter)
        Chip.program_counter = address - 2;
        break;
      }

      // Skip next instruction if register x == value
      case nibbles[0] === 3: {
        const vx = Machine.registers[nibbles[1]];
        const value = instruction[1];
        if (vx === value) Chip.program_counter += 2;
        break;
      }

      // Skip next instruction if register x != value
      case nibbles[0] === 4: {
        const vx = Machine.registers[nibbles[1]];
        const value = instruction[1];
        if (vx !== value) Chip.program_counter += 2;
        break;
      }

      // Skip next instruction if register x == register y
      case nibbles[0] === 5 && nibbles[3] === 0: {
        const vx = Machine.registers[nibbles[1]];
        const vy = Machine.registers[nibbles[2]];
        if (vx === vy) Chip.program_counter += 2;
        break;
      }

      // Load value into register x from value
      case nibbles[0] === 6: {
        const vx = nibbles[1];
        const value = instruction[1];
        Machine.set_register_by_value(vx, value);
        break;
      }

      // Add value to register x from value. Overflow flag is not set
      case nibbles[0] === 7: {
        const vx = nibbles[1];
        const value = instruction[1];
        Machine.add_register_by_value(vx, value);
        break;
      }

      // Load value into register x from register y
      case nibbles[0] === 8 && nibbles[3] === 0: {
        const vx = nibbles[1];
        const vy = nibbles[2];
        Machine.set_register_by_register(vx, vy);
        break;
      }

      // bitwise-OR the values of register x and register y, save the result in register x
      case nibbles[0] === 8 && nibbles[3] === 1: {
        const vx = nibbles[1];
        const vy = nibbles[2];
        const value = Machine.registers[vx] | Machine.registers[vy];
        Machine.set_register_by_value(vx, value);
        Machine.set_register_by_value(0xf, 0);
        break;
      }

      // bitwise-AND the values of register x and register y, save the result in register x
      case nibbles[0] === 8 && nibbles[3] === 2: {
        const vx = nibbles[1];
        const vy = nibbles[2];
        const value = Machine.registers[vx] & Machine.registers[vy];
        Machine.set_register_by_value(vx, value);
        Machine.set_register_by_value(0xf, 0);
        break;
      }

      // bitwise-XOR the values of register x and register y, save the result in register x
      case nibbles[0] === 8 && nibbles[3] === 3: {
        const vx = nibbles[1];
        const vy = nibbles[2];
        const value = Machine.registers[vx] ^ Machine.registers[vy];
        Machine.set_register_by_value(vx, value);
        Machine.set_register_by_value(0xf, 0);
        break;
      }

      // Add the values of register x and register y, save the result in register x. set register Vf on carry
      case nibbles[0] === 8 && nibbles[3] === 4: {
        const vx = nibbles[1];
        const vy = nibbles[2];
        Machine.add_register_by_register(vx, vy);
        break;
      }

      // Subtract the values of register y from register x, save the result in register x. set register Vf on carry
      case nibbles[0] === 8 && nibbles[3] === 5: {
        const vx = nibbles[1];
        const vy = nibbles[2];
        Machine.subtract_register_by_register(vx, vy);
        break;
      }

      // Saves the least significant bit of the value at register x and bit-shifts the value by 1 to the right
      case nibbles[0] === 8 && nibbles[3] === 6: {
        const vx = nibbles[1];
        Machine.shift_register_right(vx);
        break;
      }

      // Subtract the values of register x from register y, save the result in register x. set register Vf on carry
      case nibbles[0] === 8 && nibbles[3] === 7: {
        const vx = nibbles[1];
        const vy = nibbles[2];
        Machine.subtract_register_by_register_flip(vx, vy);
        break;
      }

      // Saves the least significant bit of the value at register x and bit-shifts the value by 1 to the left
      case nibbles[0] === 8 && nibbles[3] === 0xe: {
        const vx = nibbles[1];
        Machine.shift_register_left(vx);
        break;
      }

      // Skip next instruction if register x !== register y
      case nibbles[0] === 9 && nibbles[3] === 0: {
        const vx = Machine.registers[nibbles[1]];
        const vy = Machine.registers[nibbles[2]];
        if (vx !== vy) {
          Chip.program_counter += 2;
        }
        break;
      }

      // Load an address into the index register
      case nibbles[0] === 0xa: {
        const address = toAddress([nibbles[1], nibbles[2], nibbles[3]]);
        Machine.set_index_by_value(address);
        break;
      }

      // Jump to an address + the value of register 0x0
      case nibbles[0] === 0xb: {
        let address = toAddress([nibbles[1], nibbles[2], nibbles[3]]);
        address += Machine.registers[0x0];
        Chip.program_counter = address;
        break;
      }

      // Generates a random number betwee 0 and 255. That number is then AND'd with the give value and set to register x
      case nibbles[0] === 0xc: {
        const random = Math.floor(Math.random() * 0xff);
        const byte = instruction[1];
        const value = random & byte;
        Machine.set_register_by_value(nibbles[1], value);
        break;
      }

      // renders sprites to the frame buffer. This is an xor that sets the 0xf flag on collision
      case nibbles[0] === 0xd: {
        const SPRITE_WIDTH = 8;
        let collision = 0;
        const vx = Machine.registers[nibbles[1]];
        const vy = Machine.registers[nibbles[2]];
        let height = nibbles[3];

        let index = Machine.index_register;

        for (var row = 0; row < height; row++) {
          let sprite = Machine.memory[index + row];
          if (vy + row >= 32) return;
          for (var cell = 0; cell < SPRITE_WIDTH; cell++) {
            if (vx + cell >= 64) continue;
            if (sprite & 0x80) {
              switch (Chip.frame_buffer[vy + row][vx + cell]) {
                case 0: {
                  Chip.frame_buffer[vy + row][vx + cell] = 1;
                  Chip.drawPixel(vx + cell, vy + row, 1)
                  break;
                }
                case 1: {
                  Chip.frame_buffer[vy + row][vx + cell] = 0;
                  Chip.drawPixel(vx + cell, vy + row, 0)
                  collision = 1;
                }
              }
            }
            sprite = sprite << 1;
          }
        }
        Machine.set_register_by_value(0xf, collision);
        break;
      }

      // Skips the next instruction if the key corresponding the the value in register x is pressed
      case nibbles[0] === 0xe && instruction[1] === 0x9e: {
        const vx = Machine.registers[nibbles[1]];
        if (keys[vx]) Chip.program_counter += 2;
        break;
      }

      // Skips the next instruction if the key corresponding the the value in register x is not pressed
      case nibbles[0] === 0xe && instruction[1] === 0xa1: {
        const vx = Machine.registers[nibbles[1]];
        if (!keys[vx]) Chip.program_counter += 2;
        break;
      }

      // Load value into register x from delay timer
      case nibbles[0] === 0xf && instruction[1] === 0x07: {
        const vx = nibbles[1];
        const value = Machine.delay_timer;
        Machine.set_register_by_value(vx, value);
        break;
      }

      // Blocks until key is pressed, and saves that key press to register x
      case nibbles[0] === 0xf && instruction[1] === 0x0a: {
        forceUp();
        setBlocked(true);
        Machine.set_blocking_target(nibbles[1]);
        break;
      }

      // Set the delay timer to the value in register x
      case nibbles[0] === 0xf && instruction[1] === 0x15: {
        const value = Machine.registers[nibbles[1]];
        Machine.set_delay_timer(value);
        break;
      }

      // Set the sound timer to the value in register x
      case nibbles[0] === 0xf && instruction[1] === 0x18: {
        const value = Machine.registers[nibbles[1]];
        Machine.set_sound_timer(value);
        break;
      }

      // Add to the index register from the value stored in register x
      case nibbles[0] === 0xf && instruction[1] === 0x1e: {
        const register = nibbles[1];
        Machine.add_index_by_register(register);
        break;
      }

      // Set index register to the location of the sprite for the value X
      case nibbles[0] === 0xf && instruction[1] === 0x29: {
        const value = Machine.registers[nibbles[1]];
        Machine.set_index_by_value(value * 5);
        break;
      }

      case nibbles[0] === 0xf && instruction[1] === 0x33: {
        const vx = Machine.registers[nibbles[1]];
        const index = Machine.index_register;
        const string = vx.toString();
        Machine.set_memory(index, parseInt(string[0]));
        Machine.set_memory(index + 1, parseInt(string[1]));
        Machine.set_memory(index + 2, parseInt(string[2]));
        break;
      }

      case nibbles[0] === 0xf && instruction[1] === 0x55: {
        const index = Machine.index_register;
        const amount = nibbles[1];
        for (var i = 0; i <= amount; i++) {
          Machine.set_memory(index + i, Machine.registers[i]);
        }
        Machine.set_index_by_value(index + amount + 1);
        break;
      }

      case nibbles[0] === 0xf && instruction[1] === 0x65: {
        const index = Machine.index_register;
        const amount = nibbles[1];
        for (var i = 0; i <= amount; i++) {
          Machine.set_register_by_value(i, Machine.memory[index + i]);
        }
        Machine.set_index_by_value(Machine.index_register + amount + 1);
      }
    }
  }

  function tick() {
    if (
      Machine.rom_loaded &&
      Chip.program_counter <= Machine.memory.length - 1
    ) {
      let instruction = fetchInstruction(
        Chip.program_counter,
        Machine.memory
      );
      processInstruction(instruction);
      Chip.program_counter += 2;
    }
  }

  useInterval(() => {
    if (blocked) {
      for (var i = 0; i < 16; i++) {
        if (keys[i] == true) {
          Machine.set_register_by_value(Machine.blocking_target, i);
          setBlocked(false)
          Machine.set_blocking_target(0);
        }
      }
    }
    if (!blocked && going) {
      tick();
      instuction.current += 1;
      if (instuction.current % 10 === 0) {
        Machine.decriment_timers();
      }
    }
    
  }, 1);

  return (
    <div>
      <input
        type="button"
        onClick={() => setGoing((current) => !current)}
        value={`going: ${going}`}
      />
      <input type="button" onClick={() => tick()} value={`step`} />
    </div>
  );
}

export function fetchInstruction(pc: number, buffer: Uint8Array) {
  let instruction = [];

  if (pc <= buffer.length - 1) {
    instruction.push(buffer[pc]);
  } else {
    instruction.push(0);
    instruction.push(0);
  }

  if (pc + 1 <= buffer.length - 1) {
    instruction.push(buffer[pc + 1]);
  } else {
    instruction.push(0);
  }

  return instruction;
}

function decode(instruction: number[]) {
  throw new Error("Function not implemented.");
}
