import { useMemo, useState } from 'react';
import { learningLevels } from '../data/lessons';
import type { LearningLevel, ProgressData, QuizQuestion, SoundController } from '../types';
import ProgressBar from './ProgressBar';
import RewardModal from './RewardModal';
import TracingCanvas from './TracingCanvas';

interface LearningPathProps {
  progress: ProgressData;
  onProgressChange: (progress: ProgressData) => void;
  sound: SoundController;
  onBack: () => void;
}

type LevelStep = 'intro' | 'practice' | 'finish';

const skillLabel: Record<string, string> = {
  numbers: 'Nhận mặt số',
  counting: 'Đếm số lượng',
  letters: 'Chữ cái',
  phonics: 'Ghép âm',
  reading: 'Tập đọc',
  tracing: 'Tập tô'
};

const getPraise = (isCorrect: boolean) => isCorrect
  ? ['Giỏi quá!', 'Sunny làm tốt lắm!', 'Tuyệt vời!'][Math.floor(Math.random() * 3)]
  : ['Mình thử lại nhé!', 'Gần đúng rồi!', 'Sunny nghe lại rồi chọn nhé!'][Math.floor(Math.random() * 3)];

const LearningPath = ({ progress, onProgressChange, sound, onBack }: LearningPathProps) => {
  const [activeLevel, setActiveLevel] = useState<LearningLevel | null>(null);
  const [step, setStep] = useState<LevelStep>('intro');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [rewardOpen, setRewardOpen] = useState(false);

  const currentQuestion = activeLevel?.questions[questionIndex];
  const progressValue = activeLevel ? (questionIndex / activeLevel.questions.length) * 100 : 0;
  const stars = useMemo(() => {
    if (!activeLevel) return 0;
    if (wrongCount === 0) return 3;
    if (wrongCount <= 1) return 2;
    return 1;
  }, [activeLevel, wrongCount]);

  const openLevel = (level: LearningLevel) => {
    if (level.id > progress.unlockedLevel) return;
    setActiveLevel(level);
    setStep('intro');
    setQuestionIndex(0);
    setCorrectCount(0);
    setWrongCount(0);
    setFeedback('');
    setShowHint(false);
    sound.playTone('tap');
  };

  const closeLevel = () => {
    setActiveLevel(null);
    setStep('intro');
    setFeedback('');
  };

  const finishLevel = () => {
    if (!activeLevel) return;
    const alreadyDone = progress.completedLevels.includes(activeLevel.id);
    const nextCompleted = alreadyDone ? progress.completedLevels : [...progress.completedLevels, activeLevel.id];
    const nextStickers = progress.stickers.includes(activeLevel.rewardSticker)
      ? progress.stickers
      : [...progress.stickers, activeLevel.rewardSticker];

    const nextProgress: ProgressData = {
      ...progress,
      unlockedLevel: Math.max(progress.unlockedLevel, activeLevel.id + 1),
      completedLevels: nextCompleted,
      stars: progress.stars + (alreadyDone ? 0 : stars),
      stickers: nextStickers,
      totalQuestions: progress.totalQuestions + activeLevel.questions.length,
      stats: {
        ...progress.stats,
        [activeLevel.skill]: {
          correct: progress.stats[activeLevel.skill].correct + correctCount,
          wrong: progress.stats[activeLevel.skill].wrong + wrongCount
        }
      },
      lastPlayedAt: new Date().toISOString()
    };
    onProgressChange(nextProgress);
    setStep('finish');
    setRewardOpen(true);
    sound.playTone('complete');
  };

  const answerQuestion = (question: QuizQuestion, choiceId: string) => {
    const isCorrect = choiceId === question.answerId;
    sound.playTone(isCorrect ? 'success' : 'wrong');
    setFeedback(getPraise(isCorrect));
    if (isCorrect) {
      setCorrectCount((count) => count + 1);
      setShowHint(false);
      window.setTimeout(() => {
        if (!activeLevel) return;
        const next = questionIndex + 1;
        if (next >= activeLevel.questions.length) finishLevel();
        else {
          setQuestionIndex(next);
          setFeedback('');
        }
      }, 650);
    } else {
      setWrongCount((count) => count + 1);
      setShowHint(true);
    }
  };

  if (activeLevel) {
    return (
      <main className="screen-stack">
        <div className="topbar">
          <button className="ghost-button" onClick={closeLevel} type="button">← Quay lại level</button>
          <span className="badge">Level {activeLevel.id}</span>
        </div>
        <section className="lesson-card">
          <div className="section-title">
            <div>
              <p className="eyebrow">Giai đoạn {activeLevel.stage} • {skillLabel[activeLevel.skill]}</p>
              <h1>{activeLevel.title}</h1>
              <p>{activeLevel.subtitle}</p>
            </div>
            <span className="big-sticker">{activeLevel.rewardSticker}</span>
          </div>
          {step === 'intro' && (
            <div className="lesson-intro">
              <p className="lesson-text">{activeLevel.lessonText}</p>
              <div className="lesson-items">
                {activeLevel.lessonItems.map((item) => (
                  <button key={item.id} className="choice-card small" onClick={() => sound.speak(item.label)} type="button">
                    <span className="choice-emoji">{item.emoji}</span>
                    <strong>{item.label}</strong>
                  </button>
                ))}
              </div>
              {activeLevel.tracingTarget && <TracingCanvas target={activeLevel.tracingTarget} />}
              <div className="row-actions">
                <button className="secondary-button" onClick={() => sound.speak(activeLevel.lessonText)} type="button">🔊 Nghe bài học</button>
                <button className="primary-button" onClick={() => { setStep('practice'); sound.playTone('tap'); }} type="button">Vào mini-game</button>
              </div>
            </div>
          )}
          {step === 'practice' && currentQuestion && (
            <div className="practice-area">
              <ProgressBar value={progressValue} label={`Câu ${questionIndex + 1}/${activeLevel.questions.length}`} />
              {activeLevel.tracingTarget ? (
                <div>
                  <h2>{currentQuestion.prompt}</h2>
                  <TracingCanvas target={activeLevel.tracingTarget} onComplete={() => answerQuestion(currentQuestion, 'done')} />
                </div>
              ) : (
                <QuestionView
                  question={currentQuestion}
                  feedback={feedback}
                  showHint={showHint}
                  onSpeak={() => sound.speak(currentQuestion.speakText ?? currentQuestion.prompt)}
                  onAnswer={(choiceId) => answerQuestion(currentQuestion, choiceId)}
                />
              )}
            </div>
          )}
          {step === 'finish' && (
            <div className="finish-panel">
              <div className="reward-sticker">{activeLevel.rewardSticker}</div>
              <h2>Level hoàn thành</h2>
              <p>Sunny nhận {stars} sao. Học tiếp level sau hoặc chơi tự do để ôn lại nhé.</p>
              <button className="primary-button" onClick={closeLevel} type="button">Về lộ trình</button>
            </div>
          )}
        </section>
        <RewardModal
          open={rewardOpen}
          stars={stars}
          sticker={activeLevel.rewardSticker}
          title="Sunny giỏi quá!"
          message="Bé đã hoàn thành level và nhận sticker mới."
          onClose={() => setRewardOpen(false)}
        />
      </main>
    );
  }

  return (
    <main className="screen-stack">
      <div className="topbar">
        <button className="ghost-button" onClick={onBack} type="button">← Màn hình chính</button>
        <span className="badge">{progress.stars} ⭐</span>
      </div>
      <section className="panel-card">
        <div className="section-title">
          <div>
            <p className="eyebrow">Học theo lộ trình</p>
            <h1>Level ngắn, mở khóa từng bước</h1>
            <p>Bài học ngắn → mini-game luyện tập → kiểm tra cuối level.</p>
          </div>
        </div>
        <div className="level-grid">
          {learningLevels.map((level) => {
            const locked = level.id > progress.unlockedLevel;
            const completed = progress.completedLevels.includes(level.id);
            return (
              <button
                key={level.id}
                className={`level-card ${locked ? 'locked' : ''} ${completed ? 'done' : ''}`}
                onClick={() => openLevel(level)}
                type="button"
                disabled={locked}
              >
                <span className="level-number">{locked ? '🔒' : completed ? '✅' : level.id}</span>
                <strong>{level.title}</strong>
                <small>GĐ {level.stage} • {skillLabel[level.skill]}</small>
                <span>{level.rewardSticker}</span>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
};

const QuestionView = ({ question, feedback, showHint, onSpeak, onAnswer }: {
  question: QuizQuestion;
  feedback: string;
  showHint: boolean;
  onSpeak: () => void;
  onAnswer: (choiceId: string) => void;
}) => (
  <div className="question-card">
    <div className="question-head">
      <h2>{question.prompt}</h2>
      <button className="listen-button" onClick={onSpeak} type="button">🔊 Nghe</button>
    </div>
    <div className="choice-grid">
      {question.choices.map((choice) => (
        <button key={choice.id} className="choice-card" onClick={() => onAnswer(choice.id)} type="button">
          {choice.emoji && <span className="choice-emoji">{choice.emoji}</span>}
          <strong>{choice.label}</strong>
        </button>
      ))}
    </div>
    {feedback && <p className="feedback-text">{feedback}</p>}
    {showHint && question.hint && <p className="hint-text">Gợi ý: {question.hint}</p>}
  </div>
);

export default LearningPath;
