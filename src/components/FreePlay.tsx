import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { countItems, numberChoices, shortSentences, vietnameseLetters, vocabulary } from '../data/lessons';
import type { SoundController } from '../types';
import TracingCanvas from './TracingCanvas';

type GameKey = 'balloons' | 'memory' | 'counting' | 'bus' | 'garden' | 'tracing';

interface FreePlayProps {
  sound: SoundController;
  onBack: () => void;
}

const gameMeta: Record<GameKey, { title: string; icon: string; desc: string }> = {
  balloons: { title: 'Bắt bong bóng chữ/số', icon: '🎈', desc: 'Nghe yêu cầu rồi bấm đúng bong bóng.' },
  memory: { title: 'Ghép đôi Memory Card', icon: '🃏', desc: 'Ghép số với số lượng hoặc từ với hình.' },
  counting: { title: 'Đếm vật phẩm', icon: '🍎', desc: 'Đếm đồ vật rồi chọn số đúng.' },
  bus: { title: 'Xe bus số học', icon: '🚌', desc: 'Kéo hoặc bấm số còn thiếu vào dãy.' },
  garden: { title: 'Vườn chữ của Sunny', icon: '🌷', desc: 'Bấm chữ cái để ghép thành từ.' },
  tracing: { title: 'Tập tô chữ/số', icon: '✍️', desc: 'Tô theo nét mờ bằng tay hoặc chuột.' }
};

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);
const randomItem = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

const FreePlay = ({ sound, onBack }: FreePlayProps) => {
  const [activeGame, setActiveGame] = useState<GameKey | null>(null);

  return (
    <main className="screen-stack">
      <div className="topbar">
        <button className="ghost-button" onClick={activeGame ? () => setActiveGame(null) : onBack} type="button">← {activeGame ? 'Chọn game khác' : 'Màn hình chính'}</button>
        <span className="badge">Chơi tự do</span>
      </div>
      {!activeGame && (
        <section className="panel-card">
          <div className="section-title">
            <div>
              <p className="eyebrow">Ôn tập không áp lực</p>
              <h1>Sunny thích game nào thì chơi game đó</h1>
              <p>Phụ huynh nên cho bé chơi 10–15 phút rồi nghỉ mắt.</p>
            </div>
          </div>
          <div className="freeplay-grid">
            {(Object.keys(gameMeta) as GameKey[]).map((key) => (
              <button key={key} className="mode-card" onClick={() => { setActiveGame(key); sound.playTone('tap'); }} type="button">
                <span className="mode-icon">{gameMeta[key].icon}</span>
                <strong>{gameMeta[key].title}</strong>
                <small>{gameMeta[key].desc}</small>
              </button>
            ))}
          </div>
        </section>
      )}
      {activeGame === 'balloons' && <BalloonGame sound={sound} />}
      {activeGame === 'memory' && <MemoryGame sound={sound} />}
      {activeGame === 'counting' && <CountingGame sound={sound} />}
      {activeGame === 'bus' && <BusGame sound={sound} />}
      {activeGame === 'garden' && <GardenGame sound={sound} />}
      {activeGame === 'tracing' && <TracingGame sound={sound} />}
    </main>
  );
};

const BalloonGame = ({ sound }: { sound: SoundController }) => {
  const makeRound = () => {
    const pool = shuffle([...numberChoices.slice(0, 10), ...vietnameseLetters.slice(0, 12)]);
    const options = pool.slice(0, 6);
    const target = randomItem(options);
    return { target, options };
  };
  const [round, setRound] = useState(makeRound);
  const [message, setMessage] = useState('Bấm nút nghe rồi chọn bong bóng đúng.');

  const choose = (id: string) => {
    const ok = id === round.target.id;
    sound.playTone(ok ? 'success' : 'wrong');
    setMessage(ok ? 'Giỏi quá! Bong bóng đúng rồi.' : 'Gần đúng rồi, mình thử lại nhé!');
    if (ok) window.setTimeout(() => setRound(makeRound()), 700);
  };

  return (
    <GameFrame title="Bắt bong bóng chữ/số" icon="🎈">
      <div className="question-head centered">
        <h2>Tìm: {round.target.label}</h2>
        <button className="listen-button" onClick={() => sound.speak(`Tìm ${round.target.label}`)} type="button">🔊 Nghe yêu cầu</button>
      </div>
      <div className="balloon-field">
        {round.options.map((choice, index) => (
          <button key={`${choice.id}-${index}`} className="bubble" onClick={() => choose(choice.id)} type="button">
            {choice.label}
          </button>
        ))}
      </div>
      <p className="feedback-text">{message}</p>
    </GameFrame>
  );
};

interface MemoryCard {
  id: string;
  pair: string;
  label: string;
  open: boolean;
  done: boolean;
}

const MemoryGame = ({ sound }: { sound: SoundController }) => {
  const buildCards = (): MemoryCard[] => {
    const pairs = shuffle([2, 3, 4, 5]).map((num) => [
      { id: `n-${num}`, pair: String(num), label: String(num), open: false, done: false },
      { id: `i-${num}`, pair: String(num), label: '🍎'.repeat(num), open: false, done: false }
    ]).flat();
    return shuffle(pairs);
  };
  const [cards, setCards] = useState<MemoryCard[]>(buildCards);
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState('Lật 2 thẻ để ghép số với số lượng.');

  const flip = (card: MemoryCard) => {
    if (card.open || card.done || selected.length >= 2) return;
    const nextSelected = [...selected, card.id];
    setCards((prev) => prev.map((c) => c.id === card.id ? { ...c, open: true } : c));
    setSelected(nextSelected);
    sound.playTone('tap');

    if (nextSelected.length === 2) {
      window.setTimeout(() => {
        setCards((prev) => {
          const opened = prev.filter((c) => nextSelected.includes(c.id));
          const match = opened.length === 2 && opened[0].pair === opened[1].pair;
          setMessage(match ? 'Ghép đúng rồi!' : 'Chưa đúng, Sunny thử cặp khác nhé.');
          sound.playTone(match ? 'success' : 'wrong');
          return prev.map((c) => nextSelected.includes(c.id)
            ? { ...c, open: match, done: match }
            : c);
        });
        setSelected([]);
      }, 700);
    }
  };

  return (
    <GameFrame title="Ghép đôi Memory Card" icon="🃏">
      <div className="memory-grid">
        {cards.map((card) => (
          <button key={card.id} className={`memory-card ${card.open || card.done ? 'open' : ''}`} onClick={() => flip(card)} type="button">
            {card.open || card.done ? card.label : '❔'}
          </button>
        ))}
      </div>
      <div className="row-actions">
        <button className="secondary-button" onClick={() => { setCards(buildCards()); setMessage('Bộ thẻ mới đã sẵn sàng.'); }} type="button">Xáo thẻ</button>
      </div>
      <p className="feedback-text">{message}</p>
    </GameFrame>
  );
};

const CountingGame = ({ sound }: { sound: SoundController }) => {
  const makeRound = () => {
    const item = randomItem(countItems);
    const count = Math.floor(Math.random() * 8) + 1;
    const choices = shuffle([count, Math.max(1, count - 1), Math.min(10, count + 1), Math.min(10, count + 2)]).filter((n, i, arr) => arr.indexOf(n) === i);
    return { item, count, choices };
  };
  const [round, setRound] = useState(makeRound);
  const [message, setMessage] = useState('Đếm từng món rồi chọn số đúng.');

  const choose = (num: number) => {
    const ok = num === round.count;
    sound.playTone(ok ? 'success' : 'wrong');
    setMessage(ok ? 'Sunny đếm đúng rồi!' : 'Mình đếm lại chậm hơn nhé.');
    if (ok) window.setTimeout(() => setRound(makeRound()), 800);
  };

  return (
    <GameFrame title="Đếm vật phẩm" icon="🍎">
      <h2>Có mấy {round.item.name}?</h2>
      <div className="count-board" aria-label={`Có ${round.count} ${round.item.name}`}>
        {Array.from({ length: round.count }, (_, i) => <span key={i}>{round.item.emoji}</span>)}
      </div>
      <div className="choice-grid compact">
        {round.choices.map((num) => <button key={num} className="choice-card" onClick={() => choose(num)} type="button"><strong>{num}</strong></button>)}
      </div>
      <p className="feedback-text">{message}</p>
    </GameFrame>
  );
};

const BusGame = ({ sound }: { sound: SoundController }) => {
  const makeRound = () => {
    const start = Math.floor(Math.random() * 5) + 1;
    const sequence = Array.from({ length: 5 }, (_, i) => start + i);
    const missingIndex = Math.floor(Math.random() * sequence.length);
    const answer = sequence[missingIndex];
    const choices = shuffle([answer, answer + 1, Math.max(1, answer - 1)]).filter((n, i, arr) => arr.indexOf(n) === i);
    return { sequence, missingIndex, answer, choices };
  };
  const [round, setRound] = useState(makeRound);
  const [filled, setFilled] = useState<number | null>(null);
  const [message, setMessage] = useState('Kéo số vào ô trống hoặc bấm số để điền.');

  const submit = (num: number) => {
    setFilled(num);
    const ok = num === round.answer;
    sound.playTone(ok ? 'success' : 'wrong');
    setMessage(ok ? 'Xe bus chạy đúng số rồi!' : 'Số này chưa đúng, Sunny thử lại nhé.');
    if (ok) window.setTimeout(() => { setRound(makeRound()); setFilled(null); }, 850);
  };

  return (
    <GameFrame title="Xe bus số học" icon="🚌">
      <div className="bus-line">
        {round.sequence.map((num, index) => (
          <div key={`${num}-${index}`} className={`bus-seat ${index === round.missingIndex ? 'missing' : ''}`}>
            {index === round.missingIndex ? (filled ?? '?') : num}
          </div>
        ))}
      </div>
      <div className="choice-grid compact">
        {round.choices.map((num) => (
          <button
            key={num}
            draggable
            className="choice-card"
            onDragStart={(event) => event.dataTransfer.setData('text/plain', String(num))}
            onClick={() => submit(num)}
            type="button"
          >
            <strong>{num}</strong>
          </button>
        ))}
      </div>
      <div
        className="drop-zone"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => submit(Number(event.dataTransfer.getData('text/plain')))}
      >
        Thả số vào đây
      </div>
      <p className="feedback-text">{message}</p>
    </GameFrame>
  );
};

const GardenGame = ({ sound }: { sound: SoundController }) => {
  const words = ['ba', 'mẹ', 'bé', 'cá', 'gà', 'xe', 'hoa'];
  const [word, setWord] = useState(randomItem(words));
  const letters = useMemo(() => shuffle([...word, ...shuffle(['a', 'b', 'c', 'e', 'm', 'x', 'h']).slice(0, 3)]), [word]);
  const [picked, setPicked] = useState('');
  const [message, setMessage] = useState('Bấm từng chữ để ghép đúng từ trong vườn.');

  const pick = (letter: string) => {
    const next = picked + letter;
    setPicked(next);
    sound.playTone('tap');
    if (next.length >= word.length) {
      const ok = next === word;
      sound.playTone(ok ? 'success' : 'wrong');
      setMessage(ok ? `Đúng rồi, từ ${word}!` : 'Chưa đúng thứ tự, Sunny làm lại nhé.');
      window.setTimeout(() => {
        if (ok) setWord(randomItem(words));
        setPicked('');
      }, 900);
    }
  };

  return (
    <GameFrame title="Vườn chữ của Sunny" icon="🌷">
      <div className="question-head centered">
        <h2>Ghép từ: {word}</h2>
        <button className="listen-button" onClick={() => sound.speak(word)} type="button">🔊 Nghe từ</button>
      </div>
      <div className="word-slots">
        {Array.from({ length: word.length }, (_, i) => <span key={i}>{picked[i] ?? '_'}</span>)}
      </div>
      <div className="letter-bank">
        {letters.map((letter, index) => <button key={`${letter}-${index}`} className="bubble small-bubble" onClick={() => pick(letter)} type="button">{letter}</button>)}
      </div>
      <div className="row-actions">
        <button className="secondary-button" onClick={() => { setPicked(''); setMessage('Sunny làm lại từ đầu nhé.'); }} type="button">Làm lại</button>
      </div>
      <p className="feedback-text">{message}</p>
    </GameFrame>
  );
};

const TracingGame = ({ sound }: { sound: SoundController }) => {
  const targets = ['1', '2', '3', '5', 'a', 'b', 'm', 'e'];
  const [target, setTarget] = useState('a');
  return (
    <GameFrame title="Tập tô chữ/số" icon="✍️">
      <div className="target-picker">
        {targets.map((item) => <button key={item} className={`pill-button ${target === item ? 'active' : ''}`} onClick={() => setTarget(item)} type="button">{item}</button>)}
      </div>
      <TracingCanvas target={target} onComplete={() => { sound.playTone('complete'); sound.speak('Sunny tô tốt lắm'); }} />
    </GameFrame>
  );
};

const GameFrame = ({ title, icon, children }: { title: string; icon: string; children: ReactNode }) => (
  <section className="game-card">
    <div className="section-title">
      <div>
        <p className="eyebrow">Mini-game</p>
        <h1>{icon} {title}</h1>
      </div>
    </div>
    {children}
  </section>
);

export default FreePlay;
