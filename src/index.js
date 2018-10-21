import TinyMusic from "tinymusic";
import getNote from "./getNote";

//Can be any key
const key = "C";
//Modes:
// major: [W, W, H, W, W, W, H],
// minor: [W, H, W, W, H, W, W],
// dorian: [W, H, W, W, W, H, W],
// mixolydian: [W, W, H, W, W, H, W]
const mode = "mixolydian";
// create the audio context
const ac = new AudioContext();
// get the current Web Audio timestamp (this is when playback should begin)
const when = ac.currentTime;
// set the tempo
const tempo = 132;
// initialize some vars
let sequence1;
let sequence2;
let sequence3;

const hats = [
  1,
  1,
  2,
  3,
  5,
  0,
  1,
  1,
  2,
  7,
  5,
  0,
  5,
  5,
  2,
  3,
  1,
  4,
  5,
  1,
  2,
  3,
  1,
  0
];

// https://github.com/kevincennis/TinyMusic
// 'w' is a whole note
// 'h' is a half note
// 'q' is a quarter note
// 'e' is an eighth note
// 's' is a sixteenth note
// 'es' is a dotted eighth note (eighth plus sixteenth). This works for any combination of the letters above.
// '0.0125' is a 32nd note, but any numeric value will work here. So '2' would be a half note, '0.5' would be an eighth note, etc.
const leadNotes = hats.map((hat, i) => {
  let note = getNote({ key, mode, octave: 3, hat });
  if (!note) {
    note = "-";
  }
  //quarter notes
  note += " q";
  return note;
});

//Perfect fifth
const harmonyNotes = hats.map((hat, i) => {
  let note = getNote({ key, mode, octave: 3, hat: hat + 7 });
  if (!note) {
    note = "-";
  }
  //eigth notes
  note += " q";
  return note;
});

//major third
const harmony2Notes = hats.map((hat, i) => {
  let note = getNote({ key, mode, octave: 3, hat: hat + 4 });
  if (!note) {
    note = "-";
  }
  //eigth notes
  note += " e";
  return note;
});

// create 3 new sequences (one for lead, one for harmony, one for bass)
sequence1 = new TinyMusic.Sequence(ac, tempo, leadNotes);
sequence2 = new TinyMusic.Sequence(ac, tempo, harmonyNotes);
sequence3 = new TinyMusic.Sequence(ac, tempo, harmony2Notes);

// set staccato
sequence1.staccato = 0.55;
//no staccato = droning
sequence2.staccato = 0;
sequence3.staccato = 0;

// adjust the levels so the bass and harmony aren't too loud
sequence1.gain.gain.value = 0.05;
sequence2.gain.gain.value = 0.05;
sequence3.gain.gain.value = 0.02;

//start the lead part immediately
sequence1.play(when);
// play harmony when lead loops 1 time
sequence2.play(when + (60 / tempo) * leadNotes.length);
// play harmony2 when lead loops 2 time
sequence3.play(when + (60 / tempo) * leadNotes.length * 2);
