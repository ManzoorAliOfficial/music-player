import { useState } from 'react';
import { AudioLinesIcon } from 'lucide-react';
import styles from './Sidebar.module.css';

function NavIcon({ type }) {
  const p = { viewBox:'0 0 24 24', width:17, height:17, fill:'none', stroke:'currentColor', strokeWidth:2, strokeLinecap:'round', strokeLinejoin:'round' };
  if (type === 'home')     return <svg {...p}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
  if (type === 'explore')  return <svg {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
  if (type === 'albums')   return <svg {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="12" r="3"/></svg>;
  if (type === 'artists')  return <svg {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
  if (type === 'heart')    return <svg {...p}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
  if (type === 'list')     return <svg {...p}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
  return null;
}

const NAV = [
  { label: 'Home',      icon: 'home'    },
  { label: 'Explore',   icon: 'explore' },
  { label: 'Albums',    icon: 'albums'  },
  { label: 'Artists',   icon: 'artists' },
  { label: 'Favorites', icon: 'heart'   },
  { label: 'Playlists', icon: 'list'    },
];

const DEFAULT_PLAYLISTS = ['Chill Vibes 🌿', 'Top Hits 🔥', 'Workout 💪', 'Focus 🧠', 'Party Mix 🎉'];

export default function Sidebar({ activePage, onNavChange }) {
  const [newPl,     setNewPl]     = useState('');
  const [showInput, setShowInput] = useState(false);
  const [playlists, setPlaylists] = useState(DEFAULT_PLAYLISTS);

  const addPlaylist = () => {
    if (!newPl.trim()) return;
    setPlaylists(p => [...p, newPl.trim()]);
    setNewPl(''); setShowInput(false);
  };

  return (
    <nav className={styles.sidebar}>

      {/* Logo */}
      <div className={styles['sb-logo']}>
        <span className={styles['sb-logo-icon']}><AudioLinesIcon /></span>
        <span className={styles['sb-logo-text']}>
          <span className={styles['sb-logo-mel']}>Music</span>Buddy
        </span>
      </div>

      {/* Main Navigation */}
      <div className={styles['sb-section']}>
        <p className={styles['sb-label']}>Menu</p>
        {NAV.map(n => (
          <button
            key={n.label}
            className={`${styles['sb-item']} ${activePage === n.label ? styles.active : ''}`}
            onClick={() => onNavChange(n.label)}
          >
            <NavIcon type={n.icon} />
            {n.label}
          </button>
        ))}
      </div>

      {/* Playlists */}
      <div className={styles['sb-playlists']}>
        <p className={styles['sb-label']}>Playlists</p>
        {playlists.map((pl, i) => (
          <div
            key={i}
            className={`${styles['sb-pl-item']} ${activePage === 'Playlists' ? styles['pl-active'] : ''}`}
            onClick={() => onNavChange('Playlists')}
          >
            {pl}
          </div>
        ))}
      </div>

      {/* New Playlist */}
      {showInput ? (
        <div className={styles['sb-new-input']}>
          <input
            placeholder="Playlist name..."
            value={newPl}
            onChange={e => setNewPl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addPlaylist()}
            autoFocus
          />
          <button onClick={addPlaylist}>✓</button>
          <button onClick={() => setShowInput(false)}>✕</button>
        </div>
      ) : (
        <button className={styles['sb-new-pl']} onClick={() => setShowInput(true)}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Playlist
        </button>
      )}
    </nav>
  );
}