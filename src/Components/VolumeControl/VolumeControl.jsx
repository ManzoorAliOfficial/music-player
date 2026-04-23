// src/components/VolumeControl/VolumeControl.jsx
import styles from './VolumeControl.module.css';

export default function VolumeControl({ volume, onChange }) {
  const bg = `linear-gradient(to right, var(--accent) ${volume}%, #2a2a50 ${volume}%)`;

  return (
    <div className={styles['volume-control']}>
      <svg viewBox="0 0 24 24" className={styles['vol-icon']}>
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      </svg>
      <input
        type="range"
        className={styles['vol-slider']}
        min="0"
        max="100"
        step="1"
        value={volume}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ background: bg }}
      />
    </div>
  );
}