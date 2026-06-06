export default class AudioManager {
  constructor() {
    this.ctx = null;
    this.musicTimer = null;
    this.musicStep = 0;
    this.musicSpeed = 1;
    this.initialized = false;
  }

  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API not available');
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  _note(freq, type, dur, vol, delay = 0) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + dur);
  }

  _sweep(f1, f2, type, dur, vol) {
    if (!this.ctx) return;
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(f1, t);
    osc.frequency.exponentialRampToValueAtTime(f2, t + dur);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + dur);
  }

  _noise(dur, vol) {
    if (!this.ctx) return;
    const sr = this.ctx.sampleRate;
    const len = Math.floor(sr * dur);
    if (len <= 0) return;
    const buf = this.ctx.createBuffer(1, len, sr);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
    src.connect(gain);
    gain.connect(this.ctx.destination);
    src.start();
  }

  playLaser() {
    this._sweep(600, 1800, 'square', 0.08, 0.08);
  }

  playExplosion() {
    this._noise(0.12, 0.12);
    this._note(80, 'sine', 0.15, 0.08);
  }

  playDeath() {
    this._sweep(500, 40, 'sawtooth', 0.4, 0.1);
    this._noise(0.3, 0.12);
  }

  playLevelUp() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((f, i) => {
      this._note(f, 'square', 0.15, 0.06, i * 0.1);
    });
  }

  playEnergyWarning() {
    this._note(880, 'square', 0.05, 0.04);
  }

  startMusic(speed = 1) {
    this.stopMusic();
    this.musicSpeed = speed;
    this.musicStep = 0;

    const bassLine = [147, 165, 175, 196, 220, 247, 262, 294];
    const melLine = [
      262, 330, 392, 523, 392, 330, 262, 294,
      349, 440, 523, 659, 523, 440, 349, 294
    ];

    const interval = 125 / speed;

    this.musicTimer = setInterval(() => {
      if (!this.ctx) return;
      this.resume();
      const step = this.musicStep;

      if (step % 4 === 0) {
        const idx = Math.floor(step / 4) % bassLine.length;
        this._note(bassLine[idx], 'triangle', 0.12, 0.06);
      }

      if (step % 2 === 0) {
        const idx = step % melLine.length;
        this._note(melLine[idx], 'square', 0.06, 0.03);
      }

      if (step % 8 === 0) {
        this._noise(0.015, 0.04);
      }

      this.musicStep = (step + 1) % 32;
    }, interval);
  }

  stopMusic() {
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }
}
