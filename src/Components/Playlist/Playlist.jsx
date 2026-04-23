// src/components/Playlist/Playlist.jsx
import styles from './Playlist.module.css';

function PlayingBars() {
  return (
    <div className={styles['bars-wrap']}>
      <div className={styles.bar} style={{ height: '8px' }} />
      <div className={styles.bar} style={{ height: '14px', animationDelay: '0.15s' }} />
      <div className={styles.bar} style={{ height: '7px',  animationDelay: '0.3s'  }} />
    </div>
  );
}

function BarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4"  />
      <line x1="6"  y1="20" x2="6"  y2="14" />
    </svg>
  );
}

export default function Playlist({ songs, currentIndex, isPlaying, onSelect }) {
  const totalSeconds = songs.reduce((acc, s) => {
    const [m, sec] = s.duration.split(':').map(Number);
    return acc + m * 60 + sec;
  }, 0);
  const totalMin = Math.floor(totalSeconds / 60);
  const totalSec = totalSeconds % 60;

  return (
    <div className={styles['playlist-panel']}>

      {/* Header */}
      <div className={styles['pl-header']}>
        <span className={styles['pl-header-title']}>Playlist</span>
        <button className={styles['pl-header-btn']}>
          <svg viewBox="0 0 24 24">
            <line x1="8"    y1="6"  x2="21"   y2="6"  />
            <line x1="8"    y1="12" x2="21"   y2="12" />
            <line x1="8"    y1="18" x2="21"   y2="18" />
            <line x1="3"    y1="6"  x2="3.01" y2="6"  />
            <line x1="3"    y1="12" x2="3.01" y2="12" />
            <line x1="3"    y1="18" x2="3.01" y2="18" />
          </svg>
        </button>
      </div>

      {/* Songs */}
      <div className={styles['pl-songs']}>
        {songs.map((song, i) => {
          const active = i === currentIndex;
          return (
            <div
              key={song.id}
              className={`${styles['pl-song']} ${active ? styles.active : ''}`}
              onClick={() => onSelect(i)}
            >
              {/* Thumbnail */}
              <div className={styles['pl-thumb']} style={{ background: song.thumb }}>
                <div className={styles['pl-thumb-moon']} style={{ background: song.moon }} />
                {active && isPlaying && <PlayingBars />}
              </div>
              

              {/* Info */}
              <div className={styles['pl-info']}>
                <p className={styles['pl-song-title']}>{song.title}</p>
                <p className={styles['pl-song-artist']}>{song.artist}</p>
              </div>

              {/* Duration / Icon */}
              <span className={styles['pl-duration']}>
                {active && isPlaying ? <BarIcon /> : song.duration}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className={styles['pl-footer']}>
        {songs.length} songs, {totalMin} min {totalSec} sec
      </div>

    </div>
  );
}