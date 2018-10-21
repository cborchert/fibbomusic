import get from "lodash/get";

const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
// Major Scale: R, W, W, H, W, W, W, H
// Natural Minor Scale: R, W, H, W, W, H, W, W
// Harmonic Minor Scale: R, W, H, W, W, H, 1 1/2, H   (notice the step and a half)
// Melodic Minor Scale: going up is: R, W, H, W, W, W, W, H
// going down is: R, W, W, H, W, W, H, W
// Dorian Mode is: R, W, H, W, W, W, H, W
// Mixolydian Mode is: R, W, W, H, W, W, H, W
// Ahava Raba Mode is: R, H, 1 1/2, H, W, H, W, W
// A minor pentatonic blues scale (no sharped 5) is: R, 1 1/2, W, W, 1 1/2, W
const W = 2;
const H = 1;
const modeStepDefs = {
  major: [W, W, H, W, W, W, H],
  minor: [W, H, W, W, H, W, W],
  dorian: [W, H, W, W, W, H, W],
  mixolydian: [W, W, H, W, W, H, W]
};
const keySynonyms = {
  Ab: "G#",
  Bb: "A#",
  Cb: "B",
  Db: "C#",
  Eb: "D#",
  Fb: "E",
  Gb: "F#"
};

export default function getScaleNote({
  key = "C",
  hat = 0,
  mode = "major",
  octave = 3
}) {
  const scaleKey = get(keySynonyms, `${key}`, key);
  const modeSteps = get(modeStepDefs, `${mode}`, modeStepDefs.major);
  const tonicIndex = notes.indexOf(scaleKey);
  //console.log(scaleKey);
  //console.log(modeSteps);
  //console.log(tonicIndex);
  let scaleIndex = 0;
  if (hat > 0) {
    for (let i = 0; i < hat; i++) {
      let stepIndex = i % 7;
      //console.log(stepIndex)
      scaleIndex += modeSteps[stepIndex];
    }
  }
  if (hat < 0) {
    for (let i = 0; i > hat; i--) {
      let stepIndex = modeSteps.length - (Math.abs(i) % 7) - 1;
      if (stepIndex < 0) {
        stepIndex += modeSteps.length;
      }
      scaleIndex -= modeSteps[stepIndex];
    }
  }
  //Adding an octave for each time we wrap around
  const noteIndex = scaleIndex + tonicIndex;
  //console.log(noteIndex);
  if (noteIndex >= 0) {
    octave += parseInt(noteIndex / notes.length);
  } else {
    octave += -1 * Math.ceil(Math.abs(noteIndex / notes.length));
  }
  //console.log(octave)
  //console.log(Math.floor(scaleIndex/notes.length));
  let noteIndexAdjusted = noteIndex;
  if (noteIndex >= 0) {
    noteIndexAdjusted = noteIndex % notes.length;
  } else {
    //console.log("going down");
    //console.log(Math.abs(noteIndex)%notes.length)
    noteIndexAdjusted = notes.length - (Math.abs(noteIndex) % notes.length);
    if (noteIndexAdjusted == notes.length) {
      noteIndexAdjusted = 0;
    }
  }
  //console.log(noteIndexAdjusted);
  let note = notes[noteIndexAdjusted];
  //console.log(note)
  const scaleNote = note + octave;
  //console.log(scaleNote);
  return scaleNote;
}
