interface RewardModalProps {
  open: boolean;
  stars: number;
  sticker: string;
  title: string;
  message: string;
  onClose: () => void;
}

const RewardModal = ({ open, stars, sticker, title, message, onClose }: RewardModalProps) => {
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="reward-card pop-in">
        <div className="reward-sticker">{sticker}</div>
        <h2>{title}</h2>
        <div className="star-row" aria-label={`${stars} sao`}>
          {Array.from({ length: 3 }, (_, i) => <span key={i}>{i < stars ? '⭐' : '☆'}</span>)}
        </div>
        <p>{message}</p>
        <button className="primary-button" onClick={onClose} type="button">Nhận sticker</button>
      </div>
    </div>
  );
};

export default RewardModal;
