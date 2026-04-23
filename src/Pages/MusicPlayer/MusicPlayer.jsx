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
import songs  from '../../data/songs';

export default function MusicPlayer() {
  const audioRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying,    setIsPlaying]    = useState(false); // ✅ Fix: false on start
  const [currentTime,  setCurrentTime]  = useState(0);
  const [duration,     setDuration]     = useState(0);
  const [volume,       setVolume]       = useState(70);
  const [isShuffle,    setIsShuffle]    = useState(false);
  const [isRepeat,     setIsRepeat]     = useState(false);
  const [likedSongs,   setLikedSongs]   = useState([0]);

  const song    = songs[currentIndex];
  const isLiked = likedSongs.includes(currentIndex);

  // ✅ Fix: Song change hone par naya src load karo
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = song.src;
    audio.load();
    if (isPlaying) {
      audio.play().catch(() => {});
    }
  }, [currentIndex]);

  // ✅ Fix: Play/Pause real audio par
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // ✅ Fix: Volume real audio par apply karo
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume / 100;
  }, [volume]);

  // ✅ Fix: Real audio events se time/duration update karo
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate    = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded          = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        handleNext();
      }
    };

    audio.addEventListener('timeupdate',      handleTimeUpdate);
    audio.addEventListener('loadedmetadata',  handleLoadedMetadata);
    audio.addEventListener('ended',           handleEnded);

    return () => {
      audio.removeEventListener('timeupdate',      handleTimeUpdate);
      audio.removeEventListener('loadedmetadata',  handleLoadedMetadata);
      audio.removeEventListener('ended',           handleEnded);
    };
  }, [isRepeat, isShuffle, currentIndex]);

  const handlePlayPause = () => setIsPlaying((p) => !p);

  const handleNext = () => {
    setCurrentIndex((prev) =>
      isShuffle
        ? Math.floor(Math.random() * songs.length)
        : (prev + 1) % songs.length
    );
    setIsPlaying(true);
  };

  const handlePrev = () => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    setCurrentIndex((prev) => (prev - 1 + songs.length) % songs.length);
    setIsPlaying(true);
  };

  // ✅ Fix: Seek real audio par
  const handleSeek = (newTime) => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSelectSong = (index) => {
    setCurrentIndex(index);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleToggleLike = () =>
    setLikedSongs((prev) =>
      prev.includes(currentIndex)
        ? prev.filter((i) => i !== currentIndex)
        : [...prev, currentIndex]
    );

  return (
    <div className={styles['music-player-page']}>

      <audio ref={audioRef} />

      <Sidebar />

      <div className={styles['player-center']}>
        <div className={styles['player-body']}>

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
          onToggleLike={handleToggleLike}
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