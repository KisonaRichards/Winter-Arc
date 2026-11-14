/* Sound synthesizer (Web Audio API) */
    // -----------------------------------------------------------------------
    // 2. SOUND SYNTHESIZER (Web Audio API - Zero external URLs)
    // -----------------------------------------------------------------------
    const SoundFX = {
      ctx: null,
      init() {
        if (!this.ctx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) this.ctx = new AudioContext();
        }
      },
      playTone(freq, type = 'sine', duration = 0.15, delay = 0, vol = 0.12) {
        try {
          this.init();
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = type;
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);
          gain.gain.setValueAtTime(vol, this.ctx.currentTime + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + delay + duration);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(this.ctx.currentTime + delay);
          osc.stop(this.ctx.currentTime + delay + duration);
        } catch (e) {}
      },
      coin() {
        this.playTone(987.77, 'sine', 0.12, 0, 0.14);
        this.playTone(1318.51, 'sine', 0.25, 0.08, 0.14);
      },
      levelUp() {
        [523.25, 659.25, 783.99, 1046.50].forEach((f, idx) => {
          this.playTone(f, 'triangle', 0.25, idx * 0.09, 0.16);
        });
      },
      scrollUnfurl() {
        this.playTone(220, 'triangle', 0.35, 0, 0.1);
        this.playTone(330, 'sine', 0.45, 0.12, 0.12);
      },
      error() {
        this.playTone(185, 'sawtooth', 0.18, 0, 0.1);
      },
      pop() {
        this.playTone(440, 'sine', 0.08, 0, 0.08);
      }
    };
