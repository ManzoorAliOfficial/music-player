// src/components/BottomBar/BottomBar.jsx
import styles from './BottomBar.module.css';

export default function BottomBar({
  song,
  isPlaying,
  isLiked,
  volume,
  onPlayPause,
  onNext,
  onPrev,
  onVolumeChange,
  onToggleLike, // ✅ Fix: yeh prop missing tha
}) {
  const volBg = `linear-gradient(to right, var(--accent) ${volume}%, #2a2a50 ${volume}%)`;

  return (
    <div className={styles['bottom-bar']}>

      {/* Mini Cover */}
      <div className={styles['bb-cover']} style={{ background: song.thumb }}>
        <div className={styles['bb-moon']} style={{ background: song.moon }} />
      </div>

      {/* Song Info */}
      <div className={styles['bb-info']}>
        <p className={styles['bb-title']}>{song.title}</p>
        <p className={styles['bb-artist']}>{song.artist}</p>
      </div>

      <button
        className={styles['bb-heart']}
        style={{ color: isLiked ? 'var(--accent)' : 'var(--txt3)' }}
        onClick={onToggleLike}
      >
        ♥
      </button>

      {/* Controls */}
      <div className={styles['bb-controls']}>
        <button className={styles['bb-ctrl']}>
          <svg viewBox="0 0 24 24"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></svg>
        </button>
        <button className={styles['bb-ctrl']} onClick={onPrev}>
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="19 20 9 12 19 4 19 20"/><rect x="5" y="4" width="3" height="16"/></svg>
        </button>
        <button className={styles['bb-play']} onClick={onPlayPause}>
          {isPlaying ? (
            <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          )}
        </button>
        <button className={styles['bb-ctrl']} onClick={onNext}>
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 4 15 12 5 20 5 4"/><rect x="16" y="4" width="3" height="16"/></svg>
        </button>
        <button className={styles['bb-ctrl']}>
          <svg viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
        </button>
      </div>

      {/* Volume */}
      <div className={styles['bb-right']}>
        <svg viewBox="0 0 24 24" className={styles['bb-vol-icon']}>
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
        </svg>
        <input
          type="range"
          className={styles['bb-vol-slider']}
          min="0" max="100" step="1"
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          style={{ background: volBg }}
        />
        <button className={styles['bb-list-btn']}>
          <svg viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
        </button>
      </div>
    </div>
  );
}