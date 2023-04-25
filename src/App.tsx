import Display from "./components/Display/Display";
import Keyboard from "./components/Keyboard/Keyboard";
import "./style/App.css";
import useMachineState from "./components/MachineState/MachineState";
import Processor from "./components/processor/Processor";
import Disassembly from "./components/Disassembly/Disassembly";

export default function App() {
  const index_register = useMachineState(state=> state.index_register);
  const delay_timer = useMachineState(state=> state.delay_timer);
  const sound_timer = useMachineState(state=> state.sound_timer);
  const load_assets = useMachineState((state) => state.load_assets);
  const load_rom = useMachineState((state) => state.load_rom);
  const registers = useMachineState((state) => state.registers);
  const Chip = useMachineState(state => state.chip)

  function uploadRom(event: React.ChangeEvent<HTMLInputElement>) {
    const reader = new FileReader();
    if (event.target.files === undefined) return;
    if (event.target.files!.length !== 1) return;
    const file = event.target.files![0];

    reader.onload = () => {
      load_assets();
      load_rom(new Uint8Array(reader.result as ArrayBuffer));
    };
    reader.readAsArrayBuffer(file);
  }

  return (
    <div className="App">
      <input type="file" onChange={uploadRom} />
      <Processor />
      <Display />
      <Keyboard />
    </div>
  );
}
