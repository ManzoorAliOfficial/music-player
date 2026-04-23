// src/components/ProgressBar/ProgressBar.jsx
import styles from './ProgressBar.module.css';

function formatTime(sec) {
  if (!sec || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export default function ProgressBar({ currentTime, duration, onSeek }) {
  const pct = duration ? Math.min((currentTime / duration) * 100, 100) : 0;

  const handleClick = (e) => {
    const bar = e.currentTarget;
    const clickX = e.clientX - bar.getBoundingClientRect().left;
    const newTime = (clickX / bar.offsetWidth) * duration;
    onSeek(newTime);
  };

  return (
    <div className={styles['progress-section']}>
      <div className={styles['progress-track']} onClick={handleClick}>
        <div className={styles['progress-fill']} style={{ width: `${pct}%` }}>
          <div className={styles['progress-dot']} />
        </div>
      </div>
      <div className={styles['progress-times']}>
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}