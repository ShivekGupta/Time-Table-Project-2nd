/**
 * Web Audio API Synthesizer for Immersive Pirate Sound Effects
 * Provides zero-dependency, dynamically generated audio effects.
 */

class AudioSynthService {
  constructor() {
    this.audioCtx = null;
    this.ambientSource = null;
    this.ambientLfo = null;
    this.ambientGain = null;
    this.isPlayingAmbience = false;
    
    this.isLofiPlaying = false;
    this.lofiInterval = null;
  }

  initContext() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  /**
   * Generates continuous ocean waves using filtered white noise and LFO volume/filter modulation.
   */
  startOceanAmbience() {
    if (this.isPlayingAmbience) return;
    
    try {
      this.initContext();
      this.isPlayingAmbience = true;

      // 1. Generate White Noise Buffer (2 seconds loop)
      const bufferSize = this.audioCtx.sampleRate * 2;
      const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      this.ambientSource = this.audioCtx.createBufferSource();
      this.ambientSource.buffer = noiseBuffer;
      this.ambientSource.loop = true;

      // 2. Lowpass Filter (muffled water feeling)
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, this.audioCtx.currentTime);
      filter.Q.setValueAtTime(1.0, this.audioCtx.currentTime);

      // 3. Gain Node (volume)
      this.ambientGain = this.audioCtx.createGain();
      this.ambientGain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);

      // Connect source -> filter -> gain -> destination
      this.ambientSource.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.audioCtx.destination);

      this.ambientSource.start(0);

      // 4. LFO (Low Frequency Oscillator) to modulate waves at ~0.15Hz (approx. 6-7 second wave cycle)
      this.ambientLfo = this.audioCtx.createOscillator();
      this.ambientLfo.type = 'sine';
      this.ambientLfo.frequency.setValueAtTime(0.15, this.audioCtx.currentTime);

      // LFO for filter frequency modulation (sweeps between 200Hz and 600Hz)
      const lfoFilterGain = this.audioCtx.createGain();
      lfoFilterGain.gain.setValueAtTime(250, this.audioCtx.currentTime);
      this.ambientLfo.connect(lfoFilterGain);
      lfoFilterGain.connect(filter.frequency);

      // LFO for volume modulation (sweeps volume between 0.01 and 0.08)
      const lfoVolumeGain = this.audioCtx.createGain();
      lfoVolumeGain.gain.setValueAtTime(0.035, this.audioCtx.currentTime);
      this.ambientLfo.connect(lfoVolumeGain);
      
      // Offset gain value using an internal offset nodes logic, or simple modulation:
      // Since a sine goes from -1 to 1, we modulate it onto the gain
      lfoVolumeGain.connect(this.ambientGain.gain);

      this.ambientLfo.start(0);
    } catch (e) {
      console.error("Failed to start ocean ambience:", e);
      this.isPlayingAmbience = false;
    }
  }

  stopOceanAmbience() {
    if (!this.isPlayingAmbience) return;
    
    try {
      if (this.ambientSource) {
        this.ambientSource.stop();
        this.ambientSource.disconnect();
        this.ambientSource = null;
      }
      if (this.ambientLfo) {
        this.ambientLfo.stop();
        this.ambientLfo.disconnect();
        this.ambientLfo = null;
      }
      if (this.ambientGain) {
        this.ambientGain.disconnect();
        this.ambientGain = null;
      }
      this.isPlayingAmbience = false;
    } catch (e) {
      console.error("Failed to stop ocean ambience:", e);
    }
  }

  startLofiBeats() {
    if (this.isLofiPlaying) return;
    this.initContext();
    this.isLofiPlaying = true;
    let nextNoteTime = this.audioCtx.currentTime + 0.1;
    const tempo = 80;
    const lookahead = 25.0; // ms
    const scheduleAheadTime = 0.1; // s
    let current16thNote = 0;

    const playKick = (time) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.frequency.setValueAtTime(150, time);
      osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
      gain.gain.setValueAtTime(0.6, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(time);
      osc.stop(time + 0.5);
    };

    const playHat = (time) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      // Pseudo noise via high frequency square wave
      osc.type = 'square';
      osc.frequency.setValueAtTime(10000, time);
      gain.gain.setValueAtTime(0.1, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
      
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 7000;
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(time);
      osc.stop(time + 0.1);
    };

    const playChord = (time) => {
      const freqs = [261.63, 329.63, 392.00]; // C Major
      freqs.forEach(f => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = f;
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.05, time + 0.2);
        gain.gain.linearRampToValueAtTime(0, time + 1.5);
        
        const filter = this.audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(time);
        osc.stop(time + 1.5);
      });
    };

    const scheduler = () => {
      while (nextNoteTime < this.audioCtx.currentTime + scheduleAheadTime) {
        if (current16thNote % 8 === 0) playKick(nextNoteTime);
        if (current16thNote % 8 === 4) playKick(nextNoteTime);
        if (current16thNote % 4 === 2) playHat(nextNoteTime);
        if (current16thNote % 16 === 0) playChord(nextNoteTime);
        
        const secondsPerBeat = 60.0 / tempo;
        nextNoteTime += 0.25 * secondsPerBeat;
        current16thNote++;
        if (current16thNote === 16) {
          current16thNote = 0;
        }
      }
      if (this.isLofiPlaying) {
        this.lofiInterval = setTimeout(scheduler, lookahead);
      }
    };
    
    scheduler();
  }

  stopLofiBeats() {
    this.isLofiPlaying = false;
    if (this.lofiInterval) {
      clearTimeout(this.lofiInterval);
    }
  }

  playHoverSound() {
    try {
      this.initContext();
      const osc = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.audioCtx.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.1);

      osc.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);

      osc.start(this.audioCtx.currentTime);
      osc.stop(this.audioCtx.currentTime + 0.1);
    } catch (e) {
      console.error("Failed to play hover sound:", e);
    }
  }

  playClickSound() {
    try {
      this.initContext();
      
      const freqs = [440, 554.37, 659.25]; // Bell-like chord
      
      freqs.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

        // Slightly varying decay for each harmonic
        const decayTime = 1.5 + (idx * 0.2);
        gainNode.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + decayTime);

        osc.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);

        osc.start(this.audioCtx.currentTime);
        osc.stop(this.audioCtx.currentTime + decayTime);
      });
    } catch (e) {
      console.error("Failed to play click sound:", e);
    }
  }

  playCoinSound() {
    try {
      this.initContext();
      
      const osc = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();

      // High pitched metallic ting
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(2000, this.audioCtx.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.3);

      osc.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);

      osc.start(this.audioCtx.currentTime);
      osc.stop(this.audioCtx.currentTime + 0.3);
    } catch (e) {
      console.error("Failed to play coin sound:", e);
    }
  }

  /**
   * Generates a short, crackly paper rustling sound to simulate parchment map unfolding.
   */
  playPaperRustle() {
    try {
      this.initContext();
      const ctx = this.audioCtx;
      const bufferSize = ctx.sampleRate * 0.35; // 0.35 seconds
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate brown-like noise with added high-frequency bursts (crackle)
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + (0.05 * white)) / 1.05;
        data[i] = lastOut * 3.0;

        // Crackle bursts simulating physical paper stiffness
        if (Math.random() < 0.008) {
          data[i] += (Math.random() * 2 - 1) * 0.65;
        }
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(900, ctx.currentTime);
      filter.Q.setValueAtTime(2.0, ctx.currentTime);
      
      // Sweep the bandpass filter frequency down to simulate unfolding depth
      filter.frequency.exponentialRampToValueAtTime(380, ctx.currentTime + 0.35);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      source.start(0);
      source.stop(ctx.currentTime + 0.35);

      // No context close needed since we reuse the shared context
    } catch (e) {
      console.error("Failed to play paper rustle:", e);
    }
  }
  playPirateGrowl() {
    try {
      this.initContext();
      const osc = this.audioCtx.createOscillator();
      const mod = this.audioCtx.createOscillator();
      const modGain = this.audioCtx.createGain();
      const gainNode = this.audioCtx.createGain();

      // Gravelly low pitch
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, this.audioCtx.currentTime + 0.6);

      // Modulator for the 'growl' rumbly effect
      mod.type = 'square';
      mod.frequency.setValueAtTime(20, this.audioCtx.currentTime);
      modGain.gain.setValueAtTime(50, this.audioCtx.currentTime);

      mod.connect(modGain);
      modGain.connect(osc.frequency);

      gainNode.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.6);

      osc.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);

      mod.start(this.audioCtx.currentTime);
      osc.start(this.audioCtx.currentTime);
      mod.stop(this.audioCtx.currentTime + 0.6);
      osc.stop(this.audioCtx.currentTime + 0.6);
    } catch (e) {
      console.error("Failed to play pirate growl:", e);
    }
  }

  playSplash() {
    try {
      this.initContext();
      const ctx = this.audioCtx;
      const bufferSize = ctx.sampleRate * 1.0; 
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 1.0);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      source.start(0);
      source.stop(ctx.currentTime + 1.0);
    } catch (e) {
      console.error("Failed to play splash:", e);
    }
  }
}

export const audioSynth = new AudioSynthService();
