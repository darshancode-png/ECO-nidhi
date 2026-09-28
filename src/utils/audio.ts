// Web Audio API Synthesizer for high-performance zero-dependency sound effects
class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private hapticsEnabled: boolean = true;
  private musicEnabled: boolean = false;
  private musicInterval: any = null;
  private musicGainNode: GainNode | null = null;

  constructor() {
    // Read persisted preference
    const savedSound = localStorage.getItem('w2w_sound_enabled');
    if (savedSound !== null) {
      this.soundEnabled = savedSound === 'true';
    }
    const savedHaptics = localStorage.getItem('w2w_haptics_enabled');
    if (savedHaptics !== null) {
      this.hapticsEnabled = savedHaptics === 'true';
    }
    const savedMusic = localStorage.getItem('w2w_music_enabled');
    if (savedMusic !== null) {
      this.musicEnabled = savedMusic === 'true';
    }
  }

  private initCtx(): AudioContext | null {
    if (!this.soundEnabled && !this.musicEnabled) return null;
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    localStorage.setItem('w2w_sound_enabled', String(enabled));
  }

  public isMusicEnabled(): boolean {
    return this.musicEnabled;
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    localStorage.setItem('w2w_music_enabled', String(enabled));
    if (enabled) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
  }

  public isHapticsEnabled(): boolean {
    return this.hapticsEnabled;
  }

  public setHapticsEnabled(enabled: boolean) {
    this.hapticsEnabled = enabled;
    localStorage.setItem('w2w_haptics_enabled', String(enabled));
  }

  // Calm Ambient Lo-Fi Eco Soundtrack (synthesized with warm sine chimes)
  public startMusic() {
    if (this.musicInterval || !this.musicEnabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33]; // C D E G A C D pentatonic
    let step = 0;

    const playNote = () => {
      if (!this.musicEnabled) {
        this.stopMusic();
        return;
      }
      const context = this.initCtx();
      if (!context) return;

      const freq = scale[step % scale.length];
      step = (step + (step % 2 === 0 ? 2 : 1)) % scale.length;

      try {
        const osc = context.createOscillator();
        const gain = context.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, context.currentTime);

        // Very soft, relaxing volume
        gain.gain.setValueAtTime(0.012, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(context.destination);

        osc.start();
        osc.stop(context.currentTime + 1.3);
      } catch {
        // audio might be suspended until interaction
      }
    };

    // Play immediately and loop every 1.5 seconds gently
    playNote();
    this.musicInterval = setInterval(playNote, 1600);
  }

  public stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  public triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'error' = 'light') {
    if (!this.hapticsEnabled || typeof window === 'undefined' || !navigator.vibrate) return;
    try {
      switch (type) {
        case 'light':
          navigator.vibrate(10);
          break;
        case 'medium':
          navigator.vibrate(25);
          break;
        case 'heavy':
          navigator.vibrate(50);
          break;
        case 'success':
          navigator.vibrate([15, 30, 25]);
          break;
        case 'error':
          navigator.vibrate([40, 40, 40]);
          break;
      }
    } catch {
      // Haptics might be blocked by browser policy
    }
  }

  // 1. Subtle UI Button Tap
  public playTap() {
    this.triggerHaptic('light');
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  }

  // 1b. Optical Scanner Beep & Chime
  public playScan() {
    this.triggerHaptic('medium');
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.linearRampToValueAtTime(1320, now + 0.09);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  // 2. Waste Item Collected
  public playCollect() {
    this.triggerHaptic('light');
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(now + 0.12);
  }

  // 3. Correct Sorting Action
  public playCorrect() {
    this.triggerHaptic('success');
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      gain.gain.setValueAtTime(0.1, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.15);
    });
  }

  // 4. Incorrect Sorting Action
  public playWrong() {
    this.triggerHaptic('error');
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(120, now + 0.16);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  // 5. Combo multiplier sound
  public playCombo(multiplier: number = 1) {
    this.triggerHaptic('medium');
    const ctx = this.initCtx();
    if (!ctx) return;

    const baseFreq = 400 + Math.min(multiplier * 90, 800);
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.12);

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.14);
  }

  // 6. Coin Reward Sound (Jingle)
  public playCoinReward() {
    this.triggerHaptic('medium');
    const ctx = this.initCtx();
    if (!ctx) return;

    const freqs = [987.77, 1318.51, 1567.98]; // B5, E6, G6
    const now = ctx.currentTime;

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0.12, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.2);
    });
  }

  // 7. Mission Complete
  public playMissionComplete() {
    this.triggerHaptic('success');
    const ctx = this.initCtx();
    if (!ctx) return;

    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    const now = ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.07);

      gain.gain.setValueAtTime(0.15, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.35);
    });
  }

  // 8. Achievement Unlocked (Grand Arpeggio)
  public playAchievement() {
    this.triggerHaptic('heavy');
    const ctx = this.initCtx();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    const now = ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.06);

      gain.gain.setValueAtTime(0.16, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.45);
    });
  }

  // 9. Level Up (Triumphant Chords)
  public playLevelUp() {
    this.triggerHaptic('heavy');
    const ctx = this.initCtx();
    if (!ctx) return;

    const chords = [
      [392.00, 493.88, 587.33], // G major
      [440.00, 554.37, 659.25], // A major
      [523.25, 659.25, 783.99, 1046.50] // C major chord held
    ];
    const now = ctx.currentTime;

    chords.forEach((chord, step) => {
      const timeOffset = step * 0.16;
      chord.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + timeOffset);

        gain.gain.setValueAtTime(0.1, now + timeOffset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + timeOffset + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + timeOffset);
        osc.stop(now + timeOffset + 0.5);
      });
    });
  }

  // 10. Building Complete Chime
  public playBuildingComplete() {
    this.triggerHaptic('success');
    const ctx = this.initCtx();
    if (!ctx) return;

    const freqs = [329.63, 440, 554.37, 659.25];
    const now = ctx.currentTime;

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.14, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.4);
    });
  }

  // 11. Mystery Chest Open
  public playChestOpen() {
    this.triggerHaptic('medium');
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(1100, now + 0.35);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  }
}

export const sound = new SoundEngine();
