export class Chip_8 {
  ctx: CanvasRenderingContext2D | null
  index_register: number
  memory: Uint8Array
  frame_buffer: number[][]
  stack: number[]
  delay_timer: number
  sound_timer: number
  blocking_target: number
  program_counter: number
  registers: Map<number,number>
  constructor() {
    this.ctx = null;
    this.index_register = 0;
    this.memory = new Uint8Array(4096);
    this.frame_buffer = this.populateFrameBuffer();
    this.stack = [];
    this.delay_timer = 0;
    this.sound_timer = 0;
    this.blocking_target = 0;
    this.program_counter = 0x200;
    this.registers = this.populateRegisters();
  }

  populateFrameBuffer() {
    let buffer: number[][] = [];
  
    for (var i = 0; i < 32; i++) {
      buffer[i] = new Array();
      for (var j = 0; j < 64; j++) {
        buffer[i][j] = 0;
      }
    }
    return buffer;
  }

  clearFrameBuffer() {
    if(this.ctx === null) return
    this.frame_buffer = this.populateFrameBuffer()
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0,0,832,416)
  }

  populateRegisters() {
    const registers = new Map();
    registers.set(0x0,0x0)
    registers.set(0x1,0x0)
    registers.set(0x2,0x0)
    registers.set(0x3,0x0)
    registers.set(0x4,0x0)
    registers.set(0x5,0x0)
    registers.set(0x6,0x0)
    registers.set(0x7,0x0)
    registers.set(0x8,0x0)
    registers.set(0x9,0x0)
    registers.set(0xa,0x0)
    registers.set(0xb,0x0)
    registers.set(0xc,0x0)
    registers.set(0xd,0x0)
    registers.set(0xe,0x0)
    registers.set(0xf,0x0)

    return registers
  }

  drawPixel(x: number, y: number, value: number) {
    if(this.ctx === null) return

    if (value === 1) {
      this.ctx.fillStyle = "lime";
    } else {
      this.ctx.fillStyle = "black";
    }
    this.ctx.fillRect(
        x * 13,
        y * 13,
        13,
        13
      );
  }

  setCanvas(canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d') 
  }

  incrementProgramCounter() {
    this.program_counter += 2;
  }

  drawBuffer() {
    if(this.ctx === null) return
    this.frame_buffer.forEach((row, row_index) => {
      row.forEach((cell, col_index) => {
        if (this.frame_buffer[row_index][col_index] === 1) {
          this.ctx!.fillStyle = "lime";
        } else {
          this.ctx!.fillStyle = "black";
        }
        this.ctx!.fillRect(
            col_index * 13,
            row_index * 13,
            13,
            13
          );
      });
    });
  }
}