export type AppScreen = 'home' | 'learning' | 'freeplay' | 'parents';
export type SunnySkin = 'princess' | 'bunny' | 'kitten' | 'star';
export type SkillKey = 'numbers' | 'counting' | 'letters' | 'phonics' | 'reading' | 'tracing';

export interface Choice {
  id: string;
  label: string;
  emoji?: string;
  image?: string;
}

export interface QuizQuestion {
  id: string;
  skill: SkillKey;
  prompt: string;
  speakText?: string;
  hint?: string;
  choices: Choice[];
  answerId: string;
}

export interface LearningLevel {
  id: number;
  stage: 1 | 2 | 3 | 4 | 5;
  title: string;
  subtitle: string;
  focus: string;
  skill: SkillKey;
  lessonText: string;
  lessonItems: Choice[];
  questions: QuizQuestion[];
  rewardSticker: string;
  tracingTarget?: string;
}

export interface LearningStat {
  correct: number;
  wrong: number;
}

export interface ProgressData {
  unlockedLevel: number;
  completedLevels: number[];
  stars: number;
  stickers: string[];
  stats: Record<SkillKey, LearningStat>;
  lastPlayedAt?: string;
  totalQuestions: number;
}

export interface SoundController {
  enabled: boolean;
  voiceWarning: string;
  toggleSound: () => void;
  speak: (text: string) => void;
  playTone: (type?: 'tap' | 'success' | 'wrong' | 'complete' | 'soft') => void;
}
