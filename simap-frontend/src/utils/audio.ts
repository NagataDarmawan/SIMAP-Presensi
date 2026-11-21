// Helper Suara Beep

interface WindowWithWebkitAudio extends Window {
  webkitAudioContext?: typeof AudioContext;
}

function playTone(
  type: OscillatorType,
  frequency: number,
  gainValue: number,
  durationSeconds: number
): void {
  if (typeof window === 'undefined') return;

  try {
    const AudioContextClass =
      window.AudioContext || (window as WindowWithWebkitAudio).webkitAudioContext;
    if (!AudioContextClass) return;

    const audioCtx = new AudioContextClass();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(gainValue, audioCtx.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.onended = () => {
      void audioCtx.close();
    };

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + durationSeconds);
  } catch {
    // Abaikan jika browser memblokir audio sebelum interaksi pengguna
  }
}

export const playSuccessBeep = (): void => {
  playTone('sine', 800, 1.0, 0.15);
};

export const playErrorBeep = (): void => {
  playTone('sawtooth', 300, 1.0, 0.25);
};