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

export default function Playlist({ songs, currentIndex, isPlaying, onSelect, isLoading }) {
  const totalSeconds = songs.reduce((acc, s) => acc + (s.seconds || 0), 0);
  const totalMin = Math.floor(totalSeconds / 60);
  const totalSec = totalSeconds % 60;

  return (
    <div className={styles['playlist-panel']}>
      {/* Header */}
      <div className={styles['pl-header']}>
        <span className={styles['pl-header-title']}>Playlist</span>
        <span className={styles['pl-count']}>{songs.length} songs</span>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className={styles['pl-loading']}>
          <div className={styles['pl-spinner']} />
          <span>Loading songs...</span>
        </div>
      )}

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
              {/* Thumbnail — real image or gradient */}
              <div
                className={styles['pl-thumb']}
                style={{ background: song.image ? 'transparent' : (song.thumb || '#1c1c38') }}
              >
                {song.image ? (
                  <img src={song.image} alt={song.title} className={styles['pl-thumb-img']} />
                ) : (
                  <div className={styles['pl-thumb-moon']} style={{ background: song.moon }} />
                )}
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
        {songs.length} songs • {totalMin}:{totalSec < 10 ? '0' : ''}{totalSec} min
      </div>
    </div>
  );
}