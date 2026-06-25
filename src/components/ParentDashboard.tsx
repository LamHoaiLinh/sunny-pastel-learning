import { learningLevels } from '../data/lessons';
import { createDefaultProgress } from '../lib/storage';
import type { ProgressData } from '../types';

interface ParentDashboardProps {
  progress: ProgressData;
  onProgressChange: (progress: ProgressData) => void;
  onBack: () => void;
}

const skillNames: Record<string, string> = {
  numbers: 'Nhận mặt số',
  counting: 'Đếm số lượng',
  letters: 'Nhận mặt chữ',
  phonics: 'Ghép âm/vần',
  reading: 'Tập đọc',
  tracing: 'Tập tô'
};

const ParentDashboard = ({ progress, onProgressChange, onBack }: ParentDashboardProps) => {
  const weakSkills = Object.entries(progress.stats)
    .map(([skill, stat]) => ({ skill, ...stat, total: stat.correct + stat.wrong }))
    .filter((item) => item.total > 0)
    .sort((a, b) => (b.wrong / b.total) - (a.wrong / a.total))
    .slice(0, 2);

  const reset = () => {
    const ok = window.confirm('Xóa toàn bộ tiến độ học của Sunny trên máy này?');
    if (!ok) return;
    onProgressChange(createDefaultProgress());
  };

  return (
    <main className="screen-stack">
      <div className="topbar">
        <button className="ghost-button" onClick={onBack} type="button">← Màn hình chính</button>
        <span className="badge">Góc phụ huynh</span>
      </div>
      <section className="panel-card">
        <div className="section-title">
          <div>
            <p className="eyebrow">Theo dõi nhẹ nhàng</p>
            <h1>Sunny đang học đến đâu?</h1>
            <p>Dữ liệu chỉ lưu trên trình duyệt bằng localStorage, không đăng nhập, không gửi lên máy chủ.</p>
          </div>
        </div>
        <div className="stat-grid large">
          <div><strong>{progress.completedLevels.length}/{learningLevels.length}</strong><span>level hoàn thành</span></div>
          <div><strong>{progress.unlockedLevel}</strong><span>level đã mở</span></div>
          <div><strong>{progress.stars}</strong><span>sao thưởng</span></div>
          <div><strong>{progress.stickers.length}</strong><span>sticker</span></div>
        </div>
      </section>
      <section className="panel-card split-card">
        <div>
          <h2>Kỹ năng đã luyện</h2>
          <div className="skill-list">
            {Object.entries(progress.stats).map(([skill, stat]) => {
              const total = stat.correct + stat.wrong;
              const percent = total ? Math.round((stat.correct / total) * 100) : 0;
              return (
                <div key={skill} className="skill-row">
                  <div><strong>{skillNames[skill]}</strong><small>Đúng {stat.correct} • Sai {stat.wrong}</small></div>
                  <span>{percent}%</span>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <h2>Gợi ý cho hôm nay</h2>
          <div className="parent-note">
            <p>Cho bé học 10–15 phút, ưu tiên một kỹ năng nhỏ. Nếu bé sai nhiều, phụ huynh bấm nghe mẫu và cho bé chọn lại, không cần nhắc điểm số.</p>
            {weakSkills.length > 0 ? (
              <p>Nên ôn thêm: {weakSkills.map((item) => skillNames[item.skill]).join(', ')}.</p>
            ) : (
              <p>Sunny chưa có dữ liệu yếu rõ ràng. Hãy cho bé bắt đầu từ level 1.</p>
            )}
          </div>
          <div className="stickers-box">
            {progress.stickers.length ? progress.stickers.map((sticker, i) => <span key={`${sticker}-${i}`}>{sticker}</span>) : <span>Chưa có sticker</span>}
          </div>
          <button className="danger-button" onClick={reset} type="button">Xóa tiến độ học lại từ đầu</button>
        </div>
      </section>
      <section className="panel-card">
        <h2>Level đã mở</h2>
        <div className="parent-levels">
          {learningLevels.map((level) => (
            <div key={level.id} className={progress.completedLevels.includes(level.id) ? 'complete' : ''}>
              <span>{progress.completedLevels.includes(level.id) ? '✅' : level.id <= progress.unlockedLevel ? '🔓' : '🔒'}</span>
              <strong>Level {level.id}</strong>
              <small>{level.title}</small>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default ParentDashboard;
