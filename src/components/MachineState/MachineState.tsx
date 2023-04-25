import { create } from "zustand";
import { Chip_8 } from "./Chip_8";

interface MachineState {
  registers: Uint8Array;
  index_register: number;
  memory: Uint8Array;
  rom_loaded: boolean;
  delay_timer: number;
  sound_timer: number;
  blocking_target: number;
  chip: Chip_8;
  load_assets: () => void;
  load_rom: (rom: Uint8Array) => void;
  set_register_by_value: (register: number, value: number) => void;
  set_register_by_register: (final: number, target: number) => void;
  add_register_by_value: (register: number, value: number) => void;
  add_register_by_register: (final: number, target: number) => void;
  subtract_register_by_register: (final: number, target: number) => void;
  subtract_register_by_register_flip: (final: number, target: number) => void;
  shift_register_right: (register: number) => void;
  shift_register_left: (register: number) => void;
  set_index_by_value: (value: number) => void;
  add_index_by_register: (register: number) => void;
  set_blocking_target: (value: number) => void;
  set_delay_timer: (value: number) => void;
  set_sound_timer: (value: number) => void;
  decriment_timers: () => void;
  set_memory: (location: number, value: number) => void;
}

const sprites = [
  0xf0,
  0x90,
  0x90,
  0x90,
  0xf0, // 0
  0x20,
  0x60,
  0x20,
  0x20,
  0x70, // 1
  0xf0,
  0x10,
  0xf0,
  0x80,
  0xf0, // 2
  0xf0,
  0x10,
  0xf0,
  0x10,
  0xf0, // 3
  0x90,
  0x90,
  0xf0,
  0x10,
  0x10, // 4
  0xf0,
  0x80,
  0xf0,
  0x10,
  0xf0, // 5
  0xf0,
  0x80,
  0xf0,
  0x90,
  0xf0, // 6
  0xf0,
  0x10,
  0x20,
  0x40,
  0x40, // 7
  0xf0,
  0x90,
  0xf0,
  0x90,
  0xf0, // 8
  0xf0,
  0x90,
  0xf0,
  0x10,
  0xf0, // 9
  0xf0,
  0x90,
  0xf0,
  0x90,
  0x90, // A
  0xe0,
  0x90,
  0xe0,
  0x90,
  0xe0, // B
  0xf0,
  0x80,
  0x80,
  0x80,
  0xf0, // C
  0xe0,
  0x90,
  0x90,
  0x90,
  0xe0, // D
  0xf0,
  0x80,
  0xf0,
  0x80,
  0xf0, // E
  0xf0,
  0x80,
  0xf0,
  0x80,
  0x80, // F
];

const useMachineState = create<MachineState>()((set) => ({
  registers: new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
  index_register: 0,
  memory: new Uint8Array(4096),
  rom_loaded: false,
  delay_timer: 0,
  sound_timer: 0,
  program_counter: 0x200,
  stack_pointer: 0,
  stack: [],
  blocking: false,
  blocking_target: 0,
  chip: new Chip_8(),

  load_assets: () => {
    set((state) => {
      let load_offset = 0x0;
      let current = state.memory;
      sprites.forEach((byte) => {
        current.fill(byte, load_offset, load_offset + 1);
        load_offset++;
      });
      return { memory: current };
    });
  },

  load_rom: (rom: Uint8Array) => {
    set((state) => {
      let load_offset = 0x200;
      let current = state.memory;
      rom.forEach((byte) => {
        current.fill(byte, load_offset, load_offset + 1);
        load_offset++;
      });

      return { memory: current, rom_loaded: true };
    });
  },

  set_register_by_value: (register: number, value: number) => {
    set((state) => {
      let current = state.registers;
      if (register < 0 || register > 0xf) return {};
      let set_value = value;
      if(set_value > 255) {
        while(set_value > 255){
          set_value -=256
        }
      }
      if(set_value < 0) {
        while(set_value < 255){
          set_value +=256
        }
      }

      return { registers: { ...current, [register]: value } };
    });
  },

  set_register_by_register: (final: number, target: number) => {
    set((state) => {
      let current = state.registers;
      let value = current[target];

      return { registers: { ...current, [final]: value } };
    });
  },

  add_register_by_value: (register: number, value: number) => {
    set((state) => {
      let current = state.registers;
      let new_value = current[register];
      new_value += value;

      while (new_value > 255) {
        new_value -= 256;
      }

      return { registers: { ...current, [register]: new_value } };
    });
  },

  add_register_by_register: (final: number, target: number) => {
    set((state) => {
      let current = state.registers;
      let vx = current[final];
      let vy = current[target];
      let carry = 0;
      let value = vx + vy;
      while (value > 255) {
        value -= 256;
      }

      if (vx + vy > 255) {
        carry = 1;
      }

      return { registers: { ...current, [final]: value, [0xf]: carry } };
    });
  },

  subtract_register_by_register: (final: number, target: number) => {
    set((state) => {
      let current = state.registers;
      let vx = current[final];
      let vy = current[target];
      let carry = 0;
      let value = vx - vy;
      while (value < 0) {
        value += 256;
      }

      if (vx > vy) {
        carry = 1;
      }

      return { registers: { ...current, [final]: value, [0xf]: carry } };
    });
  },

  subtract_register_by_register_flip: (final: number, target: number) => {
    set((state) => {
      let current = state.registers;
      let vx = current[final];
      let vy = current[target];
      let carry = 0;
      let value = vy - vx;
      while (value < 0) {
        value += 256;
      }

      if (vy > vx) {
        carry = 1;
      }

      return { registers: { ...current, [final]: value, [0xf]: carry } };
    });
  },

  shift_register_right: (register: number) => {
    set((state) => {
      let current = state.registers;
      let vx = current[register];
      let carry = vx & 0x1;
      let value = vx >> 1;

      return { registers: { ...current, [register]: value, [0xf]: carry } };
    });
  },

  shift_register_left: (register: number) => {
    set((state) => {
      let current = state.registers;
      let vx = current[register];
      let carry = vx & 0x80;
      let value = vx << 1;
      while (value > 255) {
        value -= 256;
      }

      return { registers: { ...current, [register]: value, [0xf]: carry } };
    });
  },

  set_index_by_value: (value: number) => set({ index_register: value }),

  add_index_by_register: (register: number) => {
    set((state) => {
      let index = state.index_register;
      let current = state.registers;
      let vx = current[register];

      return { index_register: index + vx };
    });
  },

  set_blocking_target: (value: number) => set({ blocking_target: value }),

  set_delay_timer: (value: number) => set({ delay_timer: value }),

  set_sound_timer: (value: number) => set({ sound_timer: value }),

  decriment_timers: () =>
    set((state) => {
      let st = state.sound_timer - 1;
      let dt = state.delay_timer - 1;
      if (st < 0) st = 0;
      if (dt < 0) dt = 0;
      return { sound_timer: st, delay_timer: dt };
    }),

  set_memory: (location: number, value: number) =>
    set((state) => {
      let current = state.memory;
      current[location] = value;
      return { memory: current };
    }),
}));

export default useMachineState;
