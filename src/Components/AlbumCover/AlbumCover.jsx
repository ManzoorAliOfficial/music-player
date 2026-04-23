// src/components/AlbumCover/AlbumCover.jsx
import { useEffect, useRef } from "react";
import styles from './AlbumCover.module.css';

export default function AlbumCover({ song }) {
  const starsRef = useRef(null);

  useEffect(() => {
    if (!starsRef.current) return;
    starsRef.current.innerHTML = "";
    for (let i = 0; i < 40; i++) {
      const star = document.createElement("div");
      star.className = styles.star; // ✅ CSS Module
      star.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 85}%;opacity:${0.25 + Math.random() * 0.75}`;
      starsRef.current.appendChild(star);
    }
  }, [song.id]);

  return (
    <div className={styles['album-cover']}>
      <div className={styles['cover-sky']}       style={{ background: song.sky }} />
      <div className={styles['cover-clouds']}    />
      <div className={styles['cover-moon']}      style={{ background: song.moon }} />
      <div className={styles['cover-water']}     />
      <div className={styles['cover-reflection']}/>
      <div className={styles['cover-figure']}    />
      <div className={styles['cover-stars']}     ref={starsRef} />
    </div>
  );
}