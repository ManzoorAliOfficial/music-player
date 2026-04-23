// src/components/Sidebar/Sidebar.jsx
import { useState } from "react";
import styles from './Sidebar.module.css';
import { AudioLinesIcon, Music2 } from "lucide-react";

const NAV = [
  { label: "Home",      icon: "home"   },
  { label: "Explore",   icon: "search" },
  { label: "Albums",    icon: "albums" },
  { label: "Artists",   icon: "user"   },
  { label: "Favorites", icon: "heart"  },
];

const PLAYLISTS = [
  "Chill Vibes 🌿", "Top Hits 🔥", "Workout 💪", "Focus 🧠", "Party Mix 🎉",
];

function NavIcon({ type }) {
  if (type === "home")   return <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>;
  if (type === "search") return <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
  if (type === "albums") return <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>;
  if (type === "user")   return <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
  if (type === "heart")  return <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
  return null;
}

export default function Sidebar() {
  const [active, setActive] = useState("Home");

  return (
    <nav className={styles.sidebar}>

      {/* Logo */}
     <div className={styles['sb-logo']}>
  <span className={styles['sb-logo-icon']}>
    <AudioLinesIcon />
  </span>

  <span className={styles['sb-logo-text']}>
    <span className={styles['sb-logo-mel']}>Music</span>Buddy
  </span>
</div>

      {/* Search */}
      <div className={styles['sb-search']}>
        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input placeholder="Search songs..." />
      </div>

      {/* Nav */}
      <div className={styles['sb-section']}>
        <p className={styles['sb-label']}>Menu</p>
        {NAV.map((n) => (
          <button
            key={n.label}
            className={`${styles['sb-item']} ${active === n.label ? styles.active : ''}`}
            onClick={() => setActive(n.label)}
          >
            <NavIcon type={n.icon} />
            {n.label}
          </button>
        ))}
      </div>

      {/* Playlists */}
      <div className={styles['sb-playlists']}>
        <p className={styles['sb-label']}>Playlists</p>
        {PLAYLISTS.map((pl) => (
          <div key={pl} className={styles['sb-pl-item']}>{pl}</div>
        ))}
      </div>

      {/* New Playlist */}
      <button className={styles['sb-new-pl']}>
        <svg viewBox="0 0 24 24" width="16" height="16">
          <line x1="12" y1="5"  x2="12" y2="19" />
          <line x1="5"  y1="12" x2="19" y2="12" />
        </svg>
        New Playlist
      </button>

    </nav>
  );
}