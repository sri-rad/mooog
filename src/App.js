import './App.css';
import * as Tone from 'tone'
import { useState } from 'react';

Tone.context.lookAhead = 0.0;
const synth = new Tone.PolySynth().toDestination();

function BlackKey(props) {
  const [state, setState] = useState(0);

  let key_class = "black_key";
  if (state === 1) {
    key_class = "black_key_pressed";
  }

  return (
    <div onMouseDown={() => {
      attackNote(props.note);
      setState(1);
    }}
      onMouseUp={() => {
        releaseNote(props.note);
        setState(0);
      }}

      className={key_class} style={{ transform: "translateX(" + (props.tx) + "px)" }}></div>
  )
}

function WhiteKey(props) {
  const [state, setState] = useState(0);

  let key_class = "white_key";
  if (state === 1) {
    key_class = "white_key_pressed";
  }

  return (
    <div onMouseDown={() => {
      attackNote(props.note);
      setState(1);
    }}
      onMouseUp={() => {
        releaseNote(props.note);
        setState(0);
      }}

      className={key_class} style={{ transform: "translateX(" + (props.tx) + "px)" }}></div>
  )
}

function BlackKeys(props) {
  let keys = [];

  let notes = []
  if (props.count == 2) {
    notes = ["C#" + String(props.octave), "D#" + String(props.octave)];
  }
  if (props.count == 3) {
    notes = ["F#" + String(props.octave), "G#" + String(props.octave), "A#" + String(props.octave)];
  }
  for (let i = 0; i < props.count; i++) {
    keys = [...keys, <BlackKey note={notes[i]} tx={props.x + 12 + 30 * i} />]
  }
  return (
    <div>
      {keys}
    </div>
  );
}

function Switch(props) {
  return (
    <label className="rocker rocker-small">
      <input type="checkbox" />
      <span className="switch-left" style={{ backgroundColor: props.color }}></span>
      <span className="switch-right" style={{ backgroundColor: props.color }}></span>
    </label>
  )
}

function whiteKeyToMidi(key, octave) {
  let s = "CDEFGAB";
  let n = octave + parseInt(key / 7);
  return s[key % 7] + String(n);
}

function getNoteFromMidi(midiNote) {
  let octave = parseInt(midiNote / 12) - 1;
  let note = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"][(midiNote % 12)];
  return note + String(octave);
}

function attackNote(note) {
  const now = Tone.now()
  synth.triggerAttack(note, now);
}

function releaseNote(note) {
  const now = Tone.now()
  synth.triggerRelease(note, now);
}

function getMIDIMessage(message) {
  var command = message.data[0];
  var note = message.data[1];
  var velocity = (message.data.length > 2) ? message.data[2] : 0; // a velocity value might not be included with a noteOff command

  switch (command) {
    case 144: // noteOn
      if (velocity > 0) {
        attackNote(getNoteFromMidi(note));
      } else {
        releaseNote(getNoteFromMidi(note));
      }
      break;
    case 128: // noteOff
      releaseNote(getNoteFromMidi(note));
      break;
  }
}

navigator.requestMIDIAccess()
  .then(onMIDISuccess, onMIDIFailure);


function onMIDISuccess(midiAccess) {
  console.log("Midi Success");
  for (var input of midiAccess.inputs.values())
    input.onmidimessage = getMIDIMessage;
}

function onMIDIFailure() {
  console.log('Could not access your MIDI devices.');
}

function App() {
  Tone.start();
  let white_keys = [];
  let octave = 2;
  for (let i = 0; i < 26; i++) {
    white_keys = [...white_keys, <WhiteKey note={whiteKeyToMidi(25 - i + 3, octave)} tx={(-1 * i * 30 + 450)} />]
  }
  return (
    <div className="App">
      <div className="keyboard">
        <div className="keys" style={{ transform: "translateY(60%)" }}>
          {white_keys}
          <BlackKeys count={3} octave={octave} x={-300} />
          <BlackKeys count={2} octave={octave + 1} x={-180} />
          <BlackKeys count={3} octave={octave + 1} x={-90} />
          <BlackKeys count={2} octave={octave + 2} x={30} />
          <BlackKeys count={3} octave={octave + 2} x={120} />
          <BlackKeys count={2} octave={octave + 3} x={240} />
          <BlackKeys count={3} octave={octave + 3} x={330} />
        </div>

        <div className="panel_out" style={{ transform: "translateY(-50%)" }}>
          <div className="panel">
            <div className="panel_1">
              <div className="knob" style={{ transform: "translateX(0%) translateY(-100%)" }}></div>
              <div className="knob" style={{ transform: "translateX(-100%) translateY(50%)" }}></div>
              <div className="knob" style={{ transform: "translateX(100%) translateY(50%)" }}></div>

              <div className="switch_container" style={{ transform: "translateX(-200%) translateY(220%)" }}>
                <Switch color="#585858" />
              </div>

              <div className="switch_container" style={{ transform: "translateX(100%) translateY(220%)" }}>
                <Switch color="#585858" />
              </div>

              <div style={{ textAlign: "center", fontSize: "14px", color: "white", transform: "translateY(1250%)" }}>
                CONTROLLERS
              </div>
            </div>

            <div className="panel_2">
              <div className="knob" style={{ transform: "translateX(-200%) translateY(-300%)" }}></div>
              <div className="knob" style={{ transform: "translateX(200%) translateY(-300%)" }}></div>
              <div className="knob" style={{ transform: "translateX(-200%) translateY(-50%)" }}></div>
              <div className="knob" style={{ transform: "translateX(0%) translateY(-50%)" }}></div>
              <div className="knob" style={{ transform: "translateX(200%) translateY(-50%)" }}></div>
              <div className="knob" style={{ transform: "translateX(-200%) translateY(200%)" }}></div>
              <div className="knob" style={{ transform: "translateX(0%) translateY(200%)" }}></div>
              <div className="knob" style={{ transform: "translateX(200%) translateY(200%)" }}></div>

              <div className="switch_container" style={{ transform: "translateX(-600%) translateY(170%) rotate(90deg)" }}>
                <Switch color="#BE6A44" />
              </div>

              <div style={{ textAlign: "center", fontSize: "14px", color: "white", transform: "translateY(1250%)" }}>
                OSCILLATOR BANK
              </div>
            </div>

            <div className="switch_container" style={{ transform: "translateX(-2450%) translateY(-100%)" }}>
              <Switch color="#BE6A44" />
            </div>


            <div className="panel_3">
              <div className="knob" style={{ transform: "translateX(-300%) translateY(-300%)" }}></div>
              <div className="knob" style={{ transform: "translateX(-300%) translateY(-50%)" }}></div>
              <div className="knob" style={{ transform: "translateX(-300%) translateY(200%)" }}></div>

              <div className="switch_container" style={{ transform: "translateX(-350%) translateY(-280%) " }}>
                <Switch color="#63A9C9" />
              </div>

              <div className="switch_container" style={{ transform: "translateX(-350%) translateY(-155%)" }}>
                <Switch color="#63A9C9" />
              </div>

              <div className="switch_container" style={{ transform: "translateX(-350%) translateY(-30%)" }}>
                <Switch color="#63A9C9" />
              </div>

              <div className="switch_container" style={{ transform: "translateX(-350%) translateY(95%)" }}>
                <Switch color="#63A9C9" />
              </div>

              <div className="switch_container" style={{ transform: "translateX(-350%) translateY(220%)" }}>
                <Switch color="#63A9C9" />
              </div>

              <div className="knob" style={{ transform: "translateX(50%) translateY(-175%)" }}></div>
              <div className="knob" style={{ transform: "translateX(50%) translateY(75%)" }}></div>

              <div className="knob" style={{ transform: "translateX(200%) translateY(-175%)" }}></div>
              <div className="switch_container" style={{ transform: "translateX(400%) translateY(50%) rotate(90deg)" }}>
                <Switch color="#63A9C9" />
              </div>

              <div style={{ textAlign: "center", fontSize: "14px", color: "white", transform: "translateY(1250%)" }}>
                MIXER
              </div>
            </div>
            <div className="panel_4">
              <div className="knob" style={{ transform: "translateX(-200%) translateY(-300%)" }}></div>
              <div className="knob" style={{ transform: "translateX(0%) translateY(-300%)" }}></div>
              <div className="knob" style={{ transform: "translateX(200%) translateY(-300%)" }}></div>
              <div className="knob" style={{ transform: "translateX(-200%) translateY(-50%)" }}></div>
              <div className="knob" style={{ transform: "translateX(0%) translateY(-50%)" }}></div>
              <div className="knob" style={{ transform: "translateX(200%) translateY(-50%)" }}></div>
              <div className="knob" style={{ transform: "translateX(-200%) translateY(200%)" }}></div>
              <div className="knob" style={{ transform: "translateX(0%) translateY(200%)" }}></div>
              <div className="knob" style={{ transform: "translateX(200%) translateY(200%)" }}></div>

              <div style={{ textAlign: "center", fontSize: "14px", color: "white", transform: "translateY(1250%)" }}>
                MODIFIERS
              </div>
            </div>

            <div className="switch_container" style={{ transform: "translateX(500%) translateY(-220%) " }}>
              <Switch color="#BE6A44" />
            </div>

            <div className="switch_container" style={{ transform: "translateX(500%) translateY(-120%)" }}>
              <Switch color="#BE6A44" />
            </div>

            <div className="switch_container" style={{ transform: "translateX(500%) translateY(-20%)" }}>
              <Switch color="#BE6A44" />
            </div>

            <div className="panel_5">
              <div className="knob" style={{ transform: "translateX(-100%) translateY(-300%)" }}></div>

              <div className="switch_container" style={{ transform: "translateX(-250%) translateY(-30%)" }}>
                <Switch color="#63A9C9" />
              </div>

              <div className="knob" style={{ transform: "translateX(-100%) translateY(200%)" }}></div>


              <div className="switch_container" style={{ transform: "translateX(100%) translateY(-280%)" }}>
                <Switch color="#63A9C9" />
              </div>

              <div style={{ textAlign: "center", fontSize: "14px", color: "white", transform: "translateY(1250%)" }}>
                OUTPUT
              </div>

            </div>

            <div className="panel_6">
              <div className="led-red" style={{ transform: "translateY(1100%)" }}></div>
              <div style={{ textAlign: "center", fontSize: "6px", color: "white", transform: "translateY(1700%)" }}>
                POWER
              </div>

              <div style={{ textAlign: "center", fontSize: "6px", color: "white", transform: "translateY(2150%)" }}>
                ON
              </div>

              <div className="switch_container" style={{ transform: "translateY(225%) rotate(90deg)" }}>
                <Switch color="#585858" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
