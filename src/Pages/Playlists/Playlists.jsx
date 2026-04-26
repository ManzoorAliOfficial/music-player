import { useState } from 'react';
import styles from './Playlists.module.css';

const DEFAULT_PLAYLISTS = [
  { id: 1, name: 'Chill Vibes 🌿',  songs: [] },
  { id: 2, name: 'Top Hits 🔥',     songs: [] },
  { id: 3, name: 'Workout 💪',      songs: [] },
  { id: 4, name: 'Focus 🧠',        songs: [] },
  { id: 5, name: 'Party Mix 🎉',    songs: [] },
];

export default function Playlists({ songs, onSelectSong }) {
  const [playlists,      setPlaylists]   = useState(DEFAULT_PLAYLISTS);
  const [newName,        setNewName]     = useState('');
  const [showInput,      setShowInput]   = useState(false);
  const [activePl,       setActivePl]    = useState(null);

  const createPlaylist = () => {
    if (!newName.trim()) return;
    const newPl = { id: Date.now(), name: newName.trim(), songs: [] };
    setPlaylists(prev => [...prev, newPl]);
    setNewName('');
    setShowInput(false);
    setActivePl(newPl);
  };

  const deletePlaylist = (id) => {
    setPlaylists(prev => prev.filter(p => p.id !== id));
    if (activePl?.id === id) setActivePl(null);
  };

  const toggleSong = (plId, songIndex) => {
    setPlaylists(prev => prev.map(pl => {
      if (pl.id !== plId) return pl;
      const has = pl.songs.includes(songIndex);
      return { ...pl, songs: has ? pl.songs.filter(s => s !== songIndex) : [...pl.songs, songIndex] };
    }));
  };

  const active = playlists.find(p => p.id === activePl?.id);

  return (
    <div className={styles.playlists}>

      {/* ── LEFT: Playlist List ── */}
      <div className={styles.sidebar}>
        <div className={styles['sidebar-header']}>
          <h2 className={styles.title}>Playlists</h2>
          <button className={styles['add-btn']} onClick={() => setShowInput(true)} title="New Playlist">+</button>
        </div>

        {showInput && (
          <div className={styles['new-input']}>
            <input
              placeholder="Enter playlist name..."
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && createPlaylist()}
              autoFocus
            />
            <button onClick={createPlaylist}>✓</button>
            <button onClick={() => { setShowInput(false); setNewName(''); }}>✕</button>
          </div>
        )}

        <div className={styles['pl-list']}>
          {playlists.map(pl => (
            <div
              key={pl.id}
              className={`${styles['pl-item']} ${active?.id === pl.id ? styles.active : ''}`}
              onClick={() => setActivePl(pl)}
            >
              <div className={styles['pl-icon']}>🎵</div>
              <div className={styles['pl-meta']}>
                <p className={styles['pl-name']}>{pl.name}</p>
                <p className={styles['pl-count']}>{pl.songs.length} songs</p>
              </div>
              <button
                className={styles['del-btn']}
                onClick={e => { e.stopPropagation(); deletePlaylist(pl.id); }}
                title="Delete playlist"
              >✕</button>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT: Playlist Detail ── */}
      <div className={styles.detail}>
        {!active ? (
          <div className={styles.empty}>
            <span>🎶</span>
            <p>Select a playlist to view and manage songs</p>
          </div>
        ) : (
          <>
            <h3 className={styles['detail-title']}>{active.name}</h3>
            <p className={styles['detail-sub']}>{active.songs.length} songs</p>

            {/* Songs in playlist */}
            {active.songs.length === 0 ? (
              <div className={styles['empty-pl']}>
                <p>This playlist is empty — add songs from the list below!</p>
              </div>
            ) : (
              <div className={styles['added-songs']}>
                {active.songs.map(idx => {
                  const s = songs[idx];
                  if (!s) return null;
                  return (
                    <div key={idx} className={styles['added-row']}>
                      <div className={styles['added-img']}>
                        {s.image ? <img src={s.image} alt={s.title} /> : <span>🎵</span>}
                      </div>
                      <div className={styles['added-info']}>
                        <p className={styles['added-title']}>{s.title}</p>
                        <p className={styles['added-artist']}>{s.artist}</p>
                      </div>
                      <button
                        className={styles['play-song-btn']}
                        onClick={() => onSelectSong(idx)}
                        title="Play"
                      >▶</button>
                      <button
                        className={styles['remove-btn']}
                        onClick={() => toggleSong(active.id, idx)}
                        title="Remove"
                      >✕</button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* All songs to add */}
            <h4 className={styles['all-title']}>Add Songs to Playlist</h4>
            <div className={styles['all-songs']}>
              {songs.map((s, i) => (
                <div key={s.id} className={styles['all-row']}>
                  <div className={styles['all-img']}>
                    {s.image ? <img src={s.image} alt={s.title} /> : <span>🎵</span>}
                  </div>
                  <div className={styles['all-info']}>
                    <p className={styles['all-song-title']}>{s.title}</p>
                    <p className={styles['all-song-artist']}>{s.artist}</p>
                  </div>
                  <button
                    className={`${styles['add-song-btn']} ${active.songs.includes(i) ? styles.added : ''}`}
                    onClick={() => toggleSong(active.id, i)}
                    title={active.songs.includes(i) ? 'Remove from playlist' : 'Add to playlist'}
                  >
                    {active.songs.includes(i) ? '✓' : '+'}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}