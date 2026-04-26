import styles from './Artists.module.css';

export default function Artists({ songs, onSelectSong }) {
  const artistMap = {};
  songs.forEach((song, i) => {
    if (!artistMap[song.artist]) {
      artistMap[song.artist] = {
        name:   song.artist,
        image:  song.image,
        songs:  [],
        genres: new Set(),
      };
    }
    artistMap[song.artist].songs.push({ ...song, index: i });
    if (song.genre) artistMap[song.artist].genres.add(song.genre);
  });

  const artists = Object.values(artistMap);

  return (
    <div className={styles.artists}>
      <div className={styles.header}>
        <h2 className={styles.title}>Artists</h2>
        <p className={styles.sub}>{artists.length} artists found</p>
      </div>

      {artists.length === 0 ? (
        <div className={styles.empty}>
          <span>🎤</span>
          <p>Search for songs to discover artists</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {artists.map((artist) => (
            <div
              key={artist.name}
              className={styles.card}
              onClick={() => onSelectSong(artist.songs[0].index)}
            >
              <div className={styles['avatar-wrap']}>
                {artist.image
                  ? <img src={artist.image} alt={artist.name} className={styles.avatar} />
                  : <div className={styles['avatar-fallback']}>{artist.name.charAt(0).toUpperCase()}</div>
                }
              </div>
              <p className={styles['artist-name']}>{artist.name}</p>
              <p className={styles['artist-songs']}>{artist.songs.length} songs</p>
              {artist.genres.size > 0 && (
                <p className={styles['artist-genre']}>{[...artist.genres][0]}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}