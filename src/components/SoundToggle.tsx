import type { SoundController } from '../types';

interface SoundToggleProps {
  sound: SoundController;
}

const SoundToggle = ({ sound }: SoundToggleProps) => (
  <div className="sound-box">
    <button className="pill-button" onClick={sound.toggleSound} type="button" aria-pressed={sound.enabled}>
      {sound.enabled ? '🔊 Âm thanh: Bật' : '🔇 Âm thanh: Tắt'}
    </button>
    {sound.voiceWarning && <p className="micro-note">{sound.voiceWarning}</p>}
  </div>
);

export default SoundToggle;
