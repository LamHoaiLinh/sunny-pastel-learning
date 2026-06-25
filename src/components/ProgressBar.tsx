interface ProgressBarProps {
  value: number;
  label?: string;
}

const ProgressBar = ({ value, label }: ProgressBarProps) => {
  const safeValue = Math.max(0, Math.min(100, value));
  return (
    <div className="progress-wrap" aria-label={label ?? 'Tiến độ'}>
      {label && <div className="progress-label"><span>{label}</span><span>{Math.round(safeValue)}%</span></div>}
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
};

export default ProgressBar;
