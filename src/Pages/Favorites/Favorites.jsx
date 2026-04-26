import styles from './Favorites.module.css';

export default function Favorites({ songs, likedSongs, currentIndex, isPlaying, onSelectSong }) {
  const favSongs = songs
    .map((song, i) => ({ ...song, index: i }))
    .filter((_, i) => likedSongs.includes(i));

  return (
    <div className={styles.favorites}>
      <div className={styles.header}>
        <h2 className={styles.title}>❤️ Favorites</h2>
        <p className={styles.sub}>{favSongs.length} liked songs</p>
      </div>

      {favSongs.length === 0 ? (
        <div className={styles.empty}>
          <span>🎵</span>
          <p>No favorites yet — tap the heart button on any song!</p>
        </div>
      ) : (
        <div className={styles.list}>
          {favSongs.map((song, i) => {
            const isActive = song.index === currentIndex;
            return (
              <div
                key={song.id}
                className={`${styles.row} ${isActive ? styles.active : ''}`}
                onClick={() => onSelectSong(song.index)}
              >
                <span className={styles.num}>{isActive && isPlaying ? '▶' : i + 1}</span>
                <div className={styles['img-wrap']}>
                  {song.image
                    ? <img src={song.image} alt={song.title} className={styles.img} />
                    : <div className={styles['img-fallback']}>🎵</div>
                  }
                </div>
                <div className={styles.info}>
                  <p className={styles['song-title']}>{song.title}</p>
                  <p className={styles['song-artist']}>{song.artist}</p>
                </div>
                <span className={styles.album}>{song.album}</span>
                <span className={styles.dur}>{song.duration}</span>
                <span className={styles.heart}>❤️</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}