// src/components/Controls/Controls.jsx
import styles from './Controls.module.css';

function ShuffleIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <polyline points="16 3 21 3 21 8" />
      <line x1="4" y1="20" x2="21" y2="3" />
      <polyline points="21 16 21 21 16 21" />
      <line x1="15" y1="15" x2="21" y2="21" />
    </svg>
  );
}

function PrevIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="19 20 9 12 19 4 19 20" />
      <rect x="5" y="4" width="3" height="16" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="5 4 15 12 5 20 5 4" />
      <rect x="16" y="4" width="3" height="16" />
    </svg>
  );
}

function RepeatIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

export default function Controls({
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  isShuffle,
  onToggleShuffle,
  isRepeat,
  onToggleRepeat,
}) {
  return (
    <div className={styles.controls}>

      <button
        className={`${styles['ctrl-btn']} ${isShuffle ? styles.active : ''}`}
        onClick={onToggleShuffle}
        title="Shuffle"
      >
        <ShuffleIcon />
      </button>

      <button className={styles['ctrl-btn']} onClick={onPrev} title="Previous">
        <PrevIcon />
      </button>

      <button className={styles['play-btn']} onClick={onPlayPause}>
        {isPlaying ? (
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        )}
      </button>

      <button className={styles['ctrl-btn']} onClick={onNext} title="Next">
        <NextIcon />
      </button>

      <button
        className={`${styles['ctrl-btn']} ${isRepeat ? styles.active : ''}`}
        onClick={onToggleRepeat}
        title="Repeat"
      >
        <RepeatIcon />
      </button>

    </div>
  );
}