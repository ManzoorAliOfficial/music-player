// src/components/SearchBar/SearchBar.jsx
import { useState } from "react";
import styles from "./SearchBar.module.css";

export default function SearchBar({ onSearch, onGenre, isLoading }) {
  const [query, setQuery] = useState("");

  const GENRES = [
    "pop",
    "rock",
    "jazz",
    "electronic",
    "classical",
    "hiphop",
    "lounge",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <div className={styles["search-wrap"]}>
      <form onSubmit={handleSubmit} className={styles["search-form"]}>
        <svg viewBox="0 0 24 24" className={styles["search-icon"]}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          className={styles["search-input"]}
          placeholder="Search songs, artists..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {isLoading && <div className={styles.spinner} />}
        <button type="submit" className={styles["search-btn"]}>
          Search
        </button>
      </form>

      {/* Genre Buttons */}
      <div className={styles["genre-row"]}>
        <button className={styles["genre-btn"]} onClick={() => onSearch("")}>
          🔥 Popular
        </button>
        {GENRES.map((g) => (
          <button
            key={g}
            className={styles["genre-btn"]}
            onClick={() => onGenre(g)}
          >
            {g.charAt(0).toUpperCase() + g.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
