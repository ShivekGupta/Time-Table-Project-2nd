import { audioSynth } from './src/utils/audioSynth.js';
console.log("Checking audioSynth singleton...");
import('./src/utils/audioSynth.js').then(module => {
    if (audioSynth === module.audioSynth) {
        console.log("PASS: audioSynth is a singleton.");
    } else {
        console.error("FAIL: audioSynth is not a singleton!");
    }
});
