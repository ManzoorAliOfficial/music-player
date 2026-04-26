import styles from './Albums.module.css';

export default function Albums({ songs, onSelectSong }) {
  const albumMap = {};
  songs.forEach((song, i) => {
    const key = song.album || song.title;
    if (!albumMap[key]) {
      albumMap[key] = {
        name:   song.album || 'Unknown Album',
        artist: song.artist,
        image:  song.image,
        songs:  [],
      };
    }
    albumMap[key].songs.push({ ...song, index: i });
  });

  const albums = Object.values(albumMap);

  return (
    <div className={styles.albums}>
      <div className={styles.header}>
        <h2 className={styles.title}>Albums</h2>
        <p className={styles.sub}>{albums.length} albums found</p>
      </div>

      {albums.length === 0 ? (
        <div className={styles.empty}>
          <span>💿</span>
          <p>Search for songs to see albums here</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {albums.map((album) => (
            <div key={album.name} className={styles.card}>
              <div className={styles['img-wrap']}>
                {album.image
                  ? <img src={album.image} alt={album.name} className={styles.img} />
                  : <div className={styles['img-fallback']}>💿</div>
                }
                <button
                  className={styles['play-btn']}
                  onClick={() => onSelectSong(album.songs[0].index)}
                >
                  ▶
                </button>
              </div>
              <p className={styles['album-name']}>{album.name}</p>
              <p className={styles['album-artist']}>{album.artist}</p>
              <p className={styles['album-count']}>{album.songs.length} tracks</p>

              <div className={styles['song-list']}>
                {album.songs.slice(0, 3).map((s, i) => (
                  <div key={s.id} className={styles['song-row']} onClick={() => onSelectSong(s.index)}>
                    <span className={styles['song-num']}>{i + 1}</span>
                    <span className={styles['song-name']}>{s.title}</span>
                    <span className={styles['song-dur']}>{s.duration}</span>
                  </div>
                ))}
                {album.songs.length > 3 && (
                  <p className={styles['more']}>+{album.songs.length - 3} more tracks</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}