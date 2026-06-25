import type { ProgressData, SkillKey, SunnySkin } from '../types';

const PROGRESS_KEY = 'sunny_learning_progress_v1';
const SKIN_KEY = 'sunny_learning_skin_v1';
const SOUND_KEY = 'sunny_learning_sound_v1';

const skillKeys: SkillKey[] = ['numbers', 'counting', 'letters', 'phonics', 'reading', 'tracing'];

export const createDefaultProgress = (): ProgressData => ({
  unlockedLevel: 1,
  completedLevels: [],
  stars: 0,
  stickers: [],
  stats: skillKeys.reduce((acc, key) => {
    acc[key] = { correct: 0, wrong: 0 };
    return acc;
  }, {} as ProgressData['stats']),
  totalQuestions: 0
});

export const loadProgress = (): ProgressData => {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return createDefaultProgress();
    const parsed = JSON.parse(raw) as ProgressData;
    return {
      ...createDefaultProgress(),
      ...parsed,
      stats: { ...createDefaultProgress().stats, ...parsed.stats }
    };
  } catch {
    return createDefaultProgress();
  }
};

export const saveProgress = (progress: ProgressData) => {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify({
    ...progress,
    lastPlayedAt: new Date().toISOString()
  }));
};

export const resetProgress = () => {
  localStorage.removeItem(PROGRESS_KEY);
};

export const loadSkin = (): SunnySkin => {
  const raw = localStorage.getItem(SKIN_KEY) as SunnySkin | null;
  return raw ?? 'princess';
};

export const saveSkin = (skin: SunnySkin) => localStorage.setItem(SKIN_KEY, skin);

export const loadSoundEnabled = () => localStorage.getItem(SOUND_KEY) === 'true';
export const saveSoundEnabled = (enabled: boolean) => localStorage.setItem(SOUND_KEY, String(enabled));
