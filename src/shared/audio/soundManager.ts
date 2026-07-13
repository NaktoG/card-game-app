import { Howl } from 'howler';

type SoundName = 'start' | 'draw' | 'win' | 'lose' | 'tie' | 'finish' | 'click';

const frequencies: Record<SoundName, number[]> = {
  start: [261.63, 329.63, 392.0],
  draw: [220, 277.18],
  win: [329.63, 415.3, 523.25],
  lose: [196, 164.81],
  tie: [246.94, 246.94],
  finish: [392, 493.88, 659.25],
  click: [440],
};

function createToneDataUrl(sequence: number[]): string {
  const sampleRate = 44100;
  const duration = 0.16 * sequence.length;
  const samples = Math.floor(sampleRate * duration);
  const buffer = new ArrayBuffer(44 + samples * 2);
  const view = new DataView(buffer);

  function writeString(offset: number, value: string): void {
    for (let index = 0; index < value.length; index += 1) {
      view.setUint8(offset + index, value.charCodeAt(index));
    }
  }

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + samples * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, samples * 2, true);

  for (let index = 0; index < samples; index += 1) {
    const noteIndex = Math.min(Math.floor(index / (sampleRate * 0.16)), sequence.length - 1);
    const frequency = sequence[noteIndex] ?? 440;
    const envelope = Math.max(0, 1 - index / samples);
    const sample = Math.sin((2 * Math.PI * frequency * index) / sampleRate) * envelope * 0.22;
    view.setInt16(44 + index * 2, sample * 0x7fff, true);
  }

  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return `data:audio/wav;base64,${btoa(binary)}`;
}

const sounds = Object.fromEntries(
  Object.entries(frequencies).map(([name, sequence]) => [
    name,
    new Howl({ src: [createToneDataUrl(sequence)], volume: 0.45 }),
  ]),
) as Record<SoundName, Howl>;

export function playSound(name: SoundName, enabled: boolean): void {
  if (!enabled) return;
  sounds[name].play();
}
