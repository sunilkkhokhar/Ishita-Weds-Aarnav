/**
 * Procedural Web Audio API sound generator for Indian Wedding Celebration.
 * Creates an authentic Tanpura harmonic drone, gentle bansuri/flute resonance,
 * and delicate brass temple bell chime with zero external audio assets.
 */

class WeddingAudioManager {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private droneOscillators: OscillatorNode[] = [];
  private droneGains: GainNode[] = [];
  private lfo: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private bellIntervalId: number | null = null;
  private volume: number = 0.45;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public play() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.stop(); // Clear any existing

    const now = this.ctx.currentTime;
    this.droneOscillators = [];
    this.droneGains = [];

    // Tanpura drone tuning in C# / D (Sa = 138.59 Hz, Pa = 207.65 Hz, Sa high = 277.18 Hz)
    const pitches = [138.59, 207.65, 277.18, 415.30, 554.37];
    const gains = [0.18, 0.12, 0.09, 0.04, 0.02];

    // LFO for slow meditative tanpura string shimmer
    this.lfo = this.ctx.createOscillator();
    this.lfo.frequency.setValueAtTime(0.2, now); // 5 second cycle
    this.lfoGain = this.ctx.createGain();
    this.lfoGain.gain.setValueAtTime(0.04, now);
    this.lfo.connect(this.lfoGain);
    this.lfo.start(now);

    pitches.forEach((freq, i) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Alternate triangle and sine for warm woody tanpura tone
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq + (i * 0.3), now); // slight organic detune

      // Gentle attack
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(gains[i], now + 2.5);

      if (this.lfoGain) {
        this.lfoGain.connect(gain.gain);
      }

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);

      this.droneOscillators.push(osc);
      this.droneGains.push(gain);
    });

    // Gentle occasional temple chime bell
    this.playBellChime();
    this.bellIntervalId = window.setInterval(() => {
      if (this.isPlaying) {
        this.playBellChime();
      }
    }, 12000);

    this.isPlaying = true;
  }

  public playBellChime() {
    if (!this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      // Harmonic series of Indian brass temple bell
      const bellFreqs = [1046.5, 2093.0, 3135.9, 4186.0];
      const bellGains = [0.15, 0.08, 0.04, 0.02];

      bellFreqs.forEach((freq, i) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq + (Math.random() * 4 - 2), now);

        gain.gain.setValueAtTime(bellGains[i], now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + (3.5 - i * 0.5));

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 4);
      });
    } catch {
      // AudioContext could be pending user interaction
    }
  }

  public stop() {
    if (this.bellIntervalId) {
      clearInterval(this.bellIntervalId);
      this.bellIntervalId = null;
    }
    if (this.ctx) {
      const now = this.ctx.currentTime;
      this.droneGains.forEach((g) => {
        try {
          g.gain.cancelScheduledValues(now);
          g.gain.setValueAtTime(g.gain.value, now);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
        } catch {
          // ignore ramp err
        }
      });

      setTimeout(() => {
        this.droneOscillators.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {
            // ignore
          }
        });
        this.droneOscillators = [];
        this.droneGains = [];
        if (this.lfo) {
          try {
            this.lfo.stop();
            this.lfo.disconnect();
          } catch {
            // ignore
          }
          this.lfo = null;
        }
      }, 900);
    }
    this.isPlaying = false;
  }
}

export const weddingAudio = new WeddingAudioManager();
