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
  onToggleLike,
}) {
  const volBg = `linear-gradient(to right, var(--accent) ${volume}%, #2a2a50 ${volume}%)`;

  return (
    <div className={styles['bottom-bar']}>

      {/* Mini Cover — real image or gradient */}
      <div
        className={styles['bb-cover']}
        style={{ background: song.image ? 'transparent' : song.thumb }}
      >
        {song.image ? (
          <img src={song.image} alt={song.title} className={styles['bb-cover-img']} />
        ) : (
          <div className={styles['bb-moon']} style={{ background: song.moon }} />
        )}
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
      </div>
    </div>
  );
}