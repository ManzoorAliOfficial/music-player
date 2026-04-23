// src/components/SongInfo/SongInfo.jsx
import styles from './SongInfo.module.css';

export default function SongInfo({ song, isLiked, onToggleLike }) {
  return (
    <div className={styles['song-info']}>
      <div className={styles['song-text']}>
        <h2 className={styles['song-title']}>{song.title}</h2>
        <p  className={styles['song-artist']}>{song.artist}</p>
      </div>
      <div className={styles['song-actions']}>
        <button
          className={`${styles['heart-btn']} ${isLiked ? styles.liked : ''}`}
          onClick={onToggleLike}
        >
          ♥
        </button>
        <button className={styles['dots-btn']}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="5"  r="1" fill="currentColor" />
            <circle cx="12" cy="12" r="1" fill="currentColor" />
            <circle cx="12" cy="19" r="1" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>
  );
}