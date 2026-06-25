import { useEffect, useState } from 'react';
import FreePlay from './components/FreePlay';
import HomeScreen from './components/HomeScreen';
import LearningPath from './components/LearningPath';
import ParentDashboard from './components/ParentDashboard';
import { useSound } from './hooks/useSound';
import { loadProgress, loadSkin, saveProgress, saveSkin } from './lib/storage';
import type { AppScreen, ProgressData, SunnySkin } from './types';

const App = () => {
  const [screen, setScreen] = useState<AppScreen>('home');
  const [progress, setProgressState] = useState<ProgressData>(loadProgress);
  const [skin, setSkinState] = useState<SunnySkin>(loadSkin);
  const [restNotice, setRestNotice] = useState(false);
  const sound = useSound();

  const setProgress = (next: ProgressData) => {
    setProgressState(next);
    saveProgress(next);
  };

  const setSkin = (next: SunnySkin) => {
    setSkinState(next);
    saveSkin(next);
  };

  useEffect(() => {
    const start = Date.now();
    const timer = window.setInterval(() => {
      if (Date.now() - start > 15 * 60 * 1000) setRestNotice(true);
    }, 30 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="app-shell">
      <div className="cloud cloud-one" />
      <div className="cloud cloud-two" />
      <header className="app-header">
        <button className="brand-button" onClick={() => setScreen('home')} type="button">
          <span>🌈</span>
          <strong>Sunny Learning</strong>
        </button>
        <nav>
          <button className={screen === 'learning' ? 'active' : ''} onClick={() => setScreen('learning')} type="button">Lộ trình</button>
          <button className={screen === 'freeplay' ? 'active' : ''} onClick={() => setScreen('freeplay')} type="button">Chơi tự do</button>
          <button className={screen === 'parents' ? 'active' : ''} onClick={() => setScreen('parents')} type="button">Phụ huynh</button>
        </nav>
      </header>
      {screen === 'home' && <HomeScreen progress={progress} skin={skin} onSkinChange={setSkin} onNavigate={setScreen} sound={sound} />}
      {screen === 'learning' && <LearningPath progress={progress} onProgressChange={setProgress} sound={sound} onBack={() => setScreen('home')} />}
      {screen === 'freeplay' && <FreePlay sound={sound} onBack={() => setScreen('home')} />}
      {screen === 'parents' && <ParentDashboard progress={progress} onProgressChange={setProgress} onBack={() => setScreen('home')} />}
      {restNotice && (
        <div className="rest-banner" role="status">
          <strong>Đến giờ nghỉ mắt rồi.</strong>
          <span>Sunny nên nghỉ 3–5 phút, uống nước và nhìn xa một chút.</span>
          <button onClick={() => setRestNotice(false)} type="button">Đã hiểu</button>
        </div>
      )}
    </div>
  );
};

export default App;
