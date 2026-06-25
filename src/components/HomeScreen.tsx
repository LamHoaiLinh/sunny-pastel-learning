import { assetSheets, learningLevels } from '../data/lessons';
import type { AppScreen, ProgressData, SoundController, SunnySkin } from '../types';
import SoundToggle from './SoundToggle';

const skinMap: Record<SunnySkin, { label: string; emoji: string; line: string }> = {
  princess: { label: 'Công chúa', emoji: '👑', line: 'Sunny công chúa học thật vui.' },
  bunny: { label: 'Thỏ hồng', emoji: '🐰', line: 'Sunny thỏ hồng nhảy vào bài học.' },
  kitten: { label: 'Mèo con', emoji: '🐱', line: 'Sunny mèo con nghe âm thật giỏi.' },
  star: { label: 'Ngôi sao nhỏ', emoji: '⭐', line: 'Sunny ngôi sao tỏa sáng mỗi ngày.' }
};

interface HomeScreenProps {
  progress: ProgressData;
  skin: SunnySkin;
  onSkinChange: (skin: SunnySkin) => void;
  onNavigate: (screen: AppScreen) => void;
  sound: SoundController;
}

const HomeScreen = ({ progress, skin, onSkinChange, onNavigate, sound }: HomeScreenProps) => {
  const completed = progress.completedLevels.length;
  const total = learningLevels.length;
  const percent = Math.round((completed / total) * 100);

  return (
    <main className="home-grid">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">Sunny Pastel Learning</p>
          <h1>Bé Sunny học số, học chữ và tập đọc tiếng Việt</h1>
          <p className="hero-text">Mỗi level ngắn 2–5 phút: nghe mẫu, chọn đúng, đếm đồ vật, ghép âm, đọc câu ngắn và tập tô chữ/số.</p>
          <div className="hero-actions">
            <button className="primary-button big" onClick={() => onNavigate('learning')} type="button">Bắt đầu học</button>
            <button className="secondary-button big" onClick={() => onNavigate('freeplay')} type="button">Chơi tự do</button>
          </div>
          <SoundToggle sound={sound} />
        </div>
        <div className="sunny-showcase">
          <div className="skin-badge">{skinMap[skin].emoji}</div>
          <img src="/assets/sunny-characters.png" alt="Nhân vật Sunny" className="sunny-image" />
          <p>{skinMap[skin].line}</p>
        </div>
      </section>
      <section className="panel-card">
        <div className="section-title">
          <div>
            <p className="eyebrow">Lộ trình</p>
            <h2>Tiến độ hôm nay</h2>
          </div>
          <span className="badge">{progress.stars} ⭐</span>
        </div>
        <div className="progress-label"><span>Level đã hoàn thành</span><span>{percent}%</span></div>
        <div className="progress-track"><div className="progress-fill" style={{ width: `${percent}%` }} /></div>
        <div className="stat-grid">
          <div><strong>{completed}/{total}</strong><span>level</span></div>
          <div><strong>{progress.stickers.length}</strong><span>sticker</span></div>
          <div><strong>{progress.totalQuestions}</strong><span>câu đã làm</span></div>
        </div>
        <button className="ghost-button wide" onClick={() => onNavigate('parents')} type="button">Mở góc phụ huynh</button>
      </section>
      <section className="panel-card">
        <div className="section-title">
          <div>
            <p className="eyebrow">Skin nhân vật</p>
            <h2>Chọn bạn học với Sunny</h2>
          </div>
        </div>
        <div className="skin-grid">
          {(Object.keys(skinMap) as SunnySkin[]).map((key) => (
            <button key={key} className={`skin-button ${skin === key ? 'active' : ''}`} onClick={() => onSkinChange(key)} type="button">
              <span>{skinMap[key].emoji}</span>
              {skinMap[key].label}
            </button>
          ))}
        </div>
      </section>
      <section className="panel-card wide-card">
        <div className="section-title">
          <div>
            <p className="eyebrow">Kho hình dễ thay</p>
            <h2>Asset Pastel Dream đang dùng</h2>
          </div>
        </div>
        <div className="asset-strip">
          {assetSheets.slice(1).map((sheet) => (
            <figure key={sheet.id}>
              <img src={sheet.src} alt={sheet.title} />
              <figcaption>{sheet.title}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </main>
  );
};

export default HomeScreen;
