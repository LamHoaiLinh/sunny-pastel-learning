import { useEffect, useRef, useState } from 'react';
import { loadSoundEnabled, saveSoundEnabled } from '../lib/storage';
import type { SoundController } from '../types';

const toneMap = {
  tap: [620, 0.06],
  success: [820, 0.12],
  wrong: [240, 0.1],
  complete: [980, 0.18],
  soft: [420, 0.08]
} as const;

export const useSound = (): SoundController => {
  const [enabled, setEnabled] = useState(loadSoundEnabled);
  const [voiceWarning, setVoiceWarning] = useState('');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientTimerRef = useRef<number | null>(null);

  const getAudioContext = () => {
    const AudioClass = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioClass) return null;
    if (!audioCtxRef.current) audioCtxRef.current = new AudioClass();
    return audioCtxRef.current;
  };

  const playTone: SoundController['playTone'] = (type = 'tap') => {
    if (!enabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const [frequency, duration] = toneMap[type];
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + duration + 0.02);
  };

  const speak = (text: string) => {
    if (!enabled || !text.trim()) return;
    if (!('speechSynthesis' in window)) {
      setVoiceWarning('Trình duyệt này chưa hỗ trợ đọc tiếng Việt. App vẫn chơi được bình thường.');
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'vi-VN';
    utter.rate = 0.82;
    utter.pitch = 1.08;
    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith('vi'));
    if (viVoice) {
      utter.voice = viVoice;
      setVoiceWarning('');
    } else {
      setVoiceWarning('Máy chưa có giọng vi-VN. Có thể cài thêm giọng tiếng Việt để nghe tự nhiên hơn.');
    }
    window.speechSynthesis.speak(utter);
  };

  const toggleSound = () => {
    setEnabled((current) => {
      const next = !current;
      saveSoundEnabled(next);
      return next;
    });
  };

  useEffect(() => {
    if (enabled) {
      // Nhạc nền rất nhẹ: chỉ phát nốt ngắn thưa, tránh gây khó chịu và không tự phát khi chưa bật.
      ambientTimerRef.current = window.setInterval(() => playTone('soft'), 7000);
    }
    return () => {
      if (ambientTimerRef.current) window.clearInterval(ambientTimerRef.current);
    };
  }, [enabled]);

  return { enabled, voiceWarning, toggleSound, speak, playTone };
};
