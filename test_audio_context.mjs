import { audioSynth } from './src/utils/audioSynth.js';

let contextCount = 0;
global.window = {
    AudioContext: class {
        constructor() {
            contextCount++;
            this.state = 'running';
            this.sampleRate = 44100;
            this.currentTime = 0;
            this.destination = {};
        }
        createBuffer() {
            return { getChannelData: () => new Float32Array(44100) };
        }
        createBufferSource() {
            return { connect: () => {}, start: () => {}, stop: () => {} };
        }
        createBiquadFilter() {
            return {
                frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
                Q: { setValueAtTime: () => {} },
                connect: () => {}
            };
        }
        createGain() {
            return {
                gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
                connect: () => {}
            };
        }
        resume() {}
    }
};

console.log("Mocking window.AudioContext...");

for (let i = 0; i < 20; i++) {
    audioSynth.playPaperRustle();
}

console.log("Total AudioContext instantiations:", contextCount);
if (contextCount === 1) {
    console.log("PASS: AudioContext hardware limit avoided.");
} else {
    console.error("FAIL: Multiple AudioContext instantiations detected!");
}
