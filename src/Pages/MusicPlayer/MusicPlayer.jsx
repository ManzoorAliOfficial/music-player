// src/pages/MusicPlayer/MusicPlayer.jsx

import { useEffect, useRef, useState } from 'react';

import AlbumCover    from '../../Components/AlbumCover/AlbumCover';
import BottomBar     from '../../Components/BottomBar/BottomBar';
import Controls      from '../../Components/Controls/Controls';
import Playlist      from '../../Components/Playlist/Playlist';
import ProgressBar   from '../../Components/ProgressBar/ProgressBar';
import Sidebar       from '../../Components/Sidebar/Sidebar';
import SongInfo      from '../../Components/SongInfo/SongInfo';
import VolumeControl from '../../Components/VolumeControl/VolumeControl';

import styles from './MusicPlayer.module.css';

import songs  from '../../data/songs'

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying,    setIsPlaying]    = useState(true);
  const [currentTime,  setCurrentTime]  = useState(0);
  const [duration,     setDuration]     = useState(236);
  const [volume,       setVolume]       = useState(70);
  const [isShuffle,    setIsShuffle]    = useState(false);
  const [isRepeat,     setIsRepeat]     = useState(false);
  const [likedSongs,   setLikedSongs]   = useState([0]);

  const song    = songs[currentIndex];
  const isLiked = likedSongs.includes(currentIndex);

  useEffect(() => {
    clearInterval(timerRef.current);
    if (!isPlaying) return;
    timerRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev + 1 >= song.seconds) {
          if (isRepeat) return 0;
          handleNext();
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [isPlaying, currentIndex, isRepeat]);

  useEffect(() => {
    setCurrentTime(0);
    setDuration(song.seconds);
  }, [currentIndex]);

  const handlePlayPause  = () => setIsPlaying((p) => !p);

  const handleNext = () => {
    setCurrentIndex((prev) =>
      isShuffle
        ? Math.floor(Math.random() * songs.length)
        : (prev + 1) % songs.length
    );
    setIsPlaying(true);
  };

  const handlePrev = () => {
    if (currentTime > 3) { setCurrentTime(0); return; }
    setCurrentIndex((prev) => (prev - 1 + songs.length) % songs.length);
    setIsPlaying(true);
  };

  const handleSeek       = (newTime) => setCurrentTime(Math.floor(newTime));
  const handleSelectSong = (index)   => { setCurrentIndex(index); setCurrentTime(0); setIsPlaying(true); };
  const handleToggleLike = () =>
    setLikedSongs((prev) =>
      prev.includes(currentIndex)
        ? prev.filter((i) => i !== currentIndex)
        : [...prev, currentIndex]
    );

  return (
    <div className={styles['music-player-page']}> {/* ✅ CSS Module */}

      <Sidebar />

      <div className={styles['player-center']}> {/* ✅ CSS Module */}
        <div className={styles['player-body']}> {/* ✅ CSS Module */}

          <AlbumCover song={song} />

          <SongInfo
            song={song}
            isLiked={isLiked}
            onToggleLike={handleToggleLike}
          />

          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
          />

          <Controls
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onNext={handleNext}
            onPrev={handlePrev}
            isShuffle={isShuffle}
            onToggleShuffle={() => setIsShuffle((s) => !s)}
            isRepeat={isRepeat}
            onToggleRepeat={() => setIsRepeat((r) => !r)}
          />

          <VolumeControl volume={volume} onChange={setVolume} />
        </div>

        <BottomBar
          song={song}
          isPlaying={isPlaying}
          isLiked={isLiked}
          volume={volume}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrev={handlePrev}
          onVolumeChange={setVolume}
        />
      </div>

      <Playlist
        songs={songs}
        currentIndex={currentIndex}
        isPlaying={isPlaying}
        onSelect={handleSelectSong}
      />
    </div>
  );
}