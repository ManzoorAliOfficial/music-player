import { useState } from 'react';
import styles from './Explore.module.css';

const GENRES = [
  { name: 'Pop',        emoji: '🎤', color: '#e040fb' },
  { name: 'Rock',       emoji: '🎸', color: '#f44336' },
  { name: 'Jazz',       emoji: '🎷', color: '#ff9800' },
  { name: 'Electronic', emoji: '🎛️', color: '#00bcd4' },
  { name: 'Classical',  emoji: '🎻', color: '#8bc34a' },
  { name: 'Hip-Hop',    emoji: '🎧', color: '#9c27b0' },
  { name: 'R&B',        emoji: '🎵', color: '#ff5722' },
  { name: 'Lounge',     emoji: '🌙', color: '#3f51b5' },
  { name: 'Bollywood',  emoji: '🎬', color: '#e91e63' },
  { name: 'Punjabi',    emoji: '🥁', color: '#ff6f00' },
  { name: 'Acoustic',   emoji: '🪕', color: '#795548' },
  { name: 'Lo-Fi',      emoji: '☕', color: '#607d8b' },
];

export default function Explore({ onSelectSong, onGenre, songs, isLoading }) {
  const [activeGenre, setActiveGenre] = useState(null);

  const handleGenre = (genre) => {
    setActiveGenre(genre.name);
    onGenre(genre.name);
  };

  return (
    <div className={styles.explore}>
      <div className={styles.header}>
        <h2 className={styles.title}>Explore Music</h2>
        <p className={styles.sub}>Select a genre to discover new songs</p>
      </div>

      <div className={styles['genre-grid']}>
        {GENRES.map((g) => (
          <div
            key={g.name}
            className={`${styles['genre-card']} ${activeGenre === g.name ? styles.active : ''}`}
            style={{ '--gcolor': g.color }}
            onClick={() => handleGenre(g)}
          >
            <span className={styles['genre-emoji']}>{g.emoji}</span>
            <span className={styles['genre-name']}>{g.name}</span>
          </div>
        ))}
      </div>

      {isLoading && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>Loading songs...</span>
        </div>
      )}

      {!isLoading && songs.length > 0 && activeGenre && (
        <>
          <h3 className={styles['section-title']}>{activeGenre} Songs</h3>
          <div className={styles['song-grid']}>
            {songs.slice(0, 12).map((song, i) => (
              <div key={song.id} className={styles['song-card']} onClick={() => onSelectSong(i)}>
                <div className={styles['song-img-wrap']}>
                  {song.image
                    ? <img src={song.image} alt={song.title} className={styles['song-img']} />
                    : <div className={styles['song-img-fallback']}>🎵</div>
                  }
                  <div className={styles['play-overlay']}>▶</div>
                </div>
                <p className={styles['song-title']}>{song.title}</p>
                <p className={styles['song-artist']}>{song.artist}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}