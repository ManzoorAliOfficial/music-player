import { useEffect, useRef, useState } from 'react';

import AlbumCover    from '../../Components/AlbumCover/AlbumCover';
import BottomBar     from '../../Components/BottomBar/BottomBar';
import Controls      from '../../Components/Controls/Controls';
import Playlist      from '../../Components/Playlist/Playlist';
import ProgressBar   from '../../Components/ProgressBar/ProgressBar';
import SearchBar     from '../../Components/SearchBar/SearchBar';
import Sidebar       from '../../Components/Sidebar/Sidebar';
import SongInfo      from '../../Components/SongInfo/SongInfo';
import VolumeControl from '../../Components/VolumeControl/VolumeControl';

import Explore   from '../Explore/Explore';
import Albums    from '../Albums/Albums';
import Artists   from '../Artists/Artists';
import Favorites from '../Favorites/Favorites';
import Playlists from '../Playlists/Playlists';

import styles   from './MusicPlayer.module.css';
import mbStyles from './MobilePlayer.module.css';

import { getFeaturedSongs, searchSongs, getSongsByGenre } from '../../services/jamendo';
import localSongs from '../../data/songs';

export default function MusicPlayer() {
  const audioRef = useRef(null);

  const [activePage,   setActivePage]   = useState('Home');
  const [songs,        setSongs]        = useState(localSongs);
  const [isLoading,    setIsLoading]    = useState(true);
  const [apiError,     setApiError]     = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying,    setIsPlaying]    = useState(false);
  const [currentTime,  setCurrentTime]  = useState(0);
  const [duration,     setDuration]     = useState(0);
  const [volume,       setVolume]       = useState(70);
  const [isShuffle,    setIsShuffle]    = useState(false);
  const [isRepeat,     setIsRepeat]     = useState(false);
  const [likedSongs,   setLikedSongs]   = useState([]);

  const song    = songs[currentIndex] || songs[0];
  const isLiked = likedSongs.includes(currentIndex);

  useEffect(() => { loadFeatured(); }, []);

  const loadFeatured = async () => {
    setIsLoading(true); setApiError(false);
    try {
      const data = await getFeaturedSongs(30);
      if (data?.length > 0) { setSongs(data); setCurrentIndex(0); }
    } catch { setApiError(true); setSongs(localSongs); }
    finally  { setIsLoading(false); }
  };

  const handleSearch = async (query) => {
    if (!query) { loadFeatured(); return; }
    setIsLoading(true);
    try {
      const data = await searchSongs(query, 30);
      if (data?.length > 0) { setSongs(data); setCurrentIndex(0); setIsPlaying(false); }
    } catch { setApiError(true); }
    finally  { setIsLoading(false); }
  };

  const handleGenre = async (genre) => {
    setIsLoading(true);
    try {
      const data = await getSongsByGenre(genre, 30);
      if (data?.length > 0) { setSongs(data); setCurrentIndex(0); setIsPlaying(false); }
    } catch { setApiError(true); }
    finally  { setIsLoading(false); }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !song?.src) return;
    audio.src = song.src; audio.load();
    if (isPlaying) audio.play().catch(() => {});
  }, [currentIndex, songs]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.play().catch(() => {});
    else audio.pause();
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime  = () => setCurrentTime(audio.currentTime);
    const onMeta  = () => setDuration(audio.duration);
    const onEnded = () => isRepeat
      ? (audio.currentTime = 0, audio.play().catch(() => {}))
      : handleNext();
    audio.addEventListener('timeupdate',     onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended',          onEnded);
    return () => {
      audio.removeEventListener('timeupdate',     onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended',          onEnded);
    };
  }, [isRepeat, isShuffle, currentIndex]);

  const handlePlayPause = () => setIsPlaying(p => !p);

  const handleNext = () => {
    setCurrentIndex(p => isShuffle ? Math.floor(Math.random() * songs.length) : (p + 1) % songs.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) { audio.currentTime = 0; setCurrentTime(0); return; }
    setCurrentIndex(p => (p - 1 + songs.length) % songs.length);
    setIsPlaying(true);
  };

  const handleSeek = (t) => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = t;
    setCurrentTime(t);
  };

  const handleSelectSong = (index) => {
    setCurrentIndex(index); setCurrentTime(0); setIsPlaying(true);
    setActivePage('Home');
  };

  const handleToggleLike = () =>
    setLikedSongs(prev =>
      prev.includes(currentIndex)
        ? prev.filter(i => i !== currentIndex)
        : [...prev, currentIndex]
    );

  if (!song) return null;

  // Shared props for both mobile and desktop
  const sharedProps = {
    song, songs, isPlaying, isLiked,
    currentTime, duration, volume,
    isShuffle, isRepeat, activePage,
    onPlayPause: handlePlayPause,
    onNext: handleNext,
    onPrev: handlePrev,
    onSeek: handleSeek,
    onVolumeChange: setVolume,
    onToggleLike: handleToggleLike,
    onToggleShuffle: () => setIsShuffle(s => !s),
    onToggleRepeat:  () => setIsRepeat(r => !r),
    onSelectSong: handleSelectSong,
    onNavChange: setActivePage,
    isLoading, likedSongs,
    onSearch: handleSearch,
    onGenre:  handleGenre,
  };

  // Desktop center content
  const renderDesktopCenter = () => {
    switch (activePage) {
      case 'Explore':   return <Explore   songs={songs} onSelectSong={handleSelectSong} isLoading={isLoading} onGenre={handleGenre} />;
      case 'Albums':    return <Albums    songs={songs} onSelectSong={handleSelectSong} />;
      case 'Artists':   return <Artists   songs={songs} onSelectSong={handleSelectSong} />;
      case 'Favorites': return <Favorites songs={songs} likedSongs={likedSongs} currentIndex={currentIndex} isPlaying={isPlaying} onSelectSong={handleSelectSong} />;
      case 'Playlists': return <Playlists songs={songs} onSelectSong={handleSelectSong} />;
      default:
        return (
          <>
            <SearchBar onSearch={handleSearch} onGenre={handleGenre} isLoading={isLoading} />
            <div className={styles['player-body']}>
              <AlbumCover song={song} />
              <SongInfo song={song} isLiked={isLiked} onToggleLike={handleToggleLike} />
              <ProgressBar currentTime={currentTime} duration={duration || song.seconds} onSeek={handleSeek} />
              <Controls
                isPlaying={isPlaying} onPlayPause={handlePlayPause}
                onNext={handleNext}   onPrev={handlePrev}
                isShuffle={isShuffle} onToggleShuffle={() => setIsShuffle(s => !s)}
                isRepeat={isRepeat}   onToggleRepeat={() => setIsRepeat(r => !r)}
              />
              <VolumeControl volume={volume} onChange={setVolume} />
            </div>
          </>
        );
    }
  };

  return (
    <>
      <audio ref={audioRef} />

      {/* ══════════════════════════════
           DESKTOP LAYOUT (>768px)
          ══════════════════════════════ */}
      <div className={styles['music-player-page']}>

        {/* Sidebar */}
        <Sidebar activePage={activePage} onNavChange={setActivePage} />

        {/* Center */}
        <div className={styles['player-center']}>
          {renderDesktopCenter()}
          <BottomBar
            song={song} isPlaying={isPlaying} isLiked={isLiked}
            volume={volume} onPlayPause={handlePlayPause}
            onNext={handleNext} onPrev={handlePrev}
            onVolumeChange={setVolume} onToggleLike={handleToggleLike}
          />
        </div>

        {/* Playlist — only on Home */}
        {activePage === 'Home' && (
          <Playlist
            songs={songs} currentIndex={currentIndex}
            isPlaying={isPlaying} onSelect={handleSelectSong}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* ══════════════════════════════
           MOBILE LAYOUT (≤768px)
          ══════════════════════════════ */}
      <div className={mbStyles['mobile-overlay']}>
        <MobilePlayer {...sharedProps} />
      </div>
    </>
  );
}

/* ══════════════════════════════════════
   MOBILE PLAYER COMPONENT
══════════════════════════════════════ */
function MobilePlayer({
  song, songs, isPlaying, isLiked,
  currentTime, duration, volume,
  isShuffle, isRepeat, activePage,
  onPlayPause, onNext, onPrev,
  onSeek, onVolumeChange, onToggleLike,
  onToggleShuffle, onToggleRepeat,
  onSelectSong, onNavChange,
  isLoading, likedSongs,
  onSearch, onGenre,
}) {
  const s = mbStyles;

  const fmtTime = (sec) => {
    if (!sec || isNaN(sec)) return '0:00';
    const m  = Math.floor(sec / 60);
    const ss = Math.floor(sec % 60);
    return `${m}:${ss < 10 ? '0' : ''}${ss}`;
  };

  const progressPct = duration ? (currentTime / duration) * 100 : 0;
  const volBg = `linear-gradient(to right, var(--accent) ${volume}%, rgba(255,255,255,0.1) ${volume}%)`;
  const showPlayer = activePage === 'Home';

  return (
    <div className={s['mobile-wrap']}>

      {/* TOP BAR */}
      <div className={s['mob-topbar']}>
        <button className={s['mob-icon-btn']}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <span className={s['mob-topbar-title']}>
          {activePage === 'Home' ? 'Now Playing' : activePage}
        </span>
        <button className={s['mob-icon-btn']}>
          <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
        </button>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className={s['mob-content']}>
        {showPlayer ? (
          <>
            {/* Album Art */}
            <div className={s['mob-cover-wrap']}>
              {song.image
                ? <img src={song.image} alt={song.title} className={s['mob-cover-img']} />
                : <MobileCoverArt song={song} />
              }
            </div>

            {/* Song Info */}
            <div className={s['mob-song-row']}>
              <div className={s['mob-song-info']}>
                <h2 className={s['mob-title']}>{song.title}</h2>
                <p className={s['mob-artist']}>{song.artist}</p>
              </div>
              <button
                className={`${s['mob-heart']} ${isLiked ? s['mob-heart-active'] : ''}`}
                onClick={onToggleLike}
              >
                <svg viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>

            {/* Progress */}
            <div className={s['mob-progress-wrap']}>
              <div className={s['mob-progress-track']}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  onSeek(((e.clientX - rect.left) / rect.width) * duration);
                }}
              >
                <div className={s['mob-progress-fill']} style={{ width: `${progressPct}%` }}>
                  <div className={s['mob-progress-dot']} />
                </div>
              </div>
              <div className={s['mob-times']}>
                <span>{fmtTime(currentTime)}</span>
                <span>{fmtTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className={s['mob-controls']}>
              <button className={`${s['mob-ctrl']} ${isShuffle ? s['mob-ctrl-active'] : ''}`} onClick={onToggleShuffle}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>
              </button>
              <button className={s['mob-prev']} onClick={onPrev}>
                <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="19 20 9 12 19 4 19 20"/><rect x="5" y="4" width="3" height="16"/></svg>
              </button>
              <button className={s['mob-play']} onClick={onPlayPause}>
                {isPlaying
                  ? <svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                  : <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                }
              </button>
              <button className={s['mob-next']} onClick={onNext}>
                <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 4 15 12 5 20 5 4"/><rect x="16" y="4" width="3" height="16"/></svg>
              </button>
              <button className={`${s['mob-ctrl']} ${isRepeat ? s['mob-ctrl-active'] : ''}`} onClick={onToggleRepeat}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
              </button>
            </div>

            {/* Volume */}
            <div className={s['mob-volume']}>
              <svg viewBox="0 0 24 24" className={s['mob-vol-icon']} fill="none" stroke="currentColor"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/></svg>
              <input type="range" min="0" max="100" value={volume}
                className={s['mob-vol-slider']}
                style={{ background: volBg }}
                onChange={(e) => onVolumeChange(Number(e.target.value))}
              />
              <svg viewBox="0 0 24 24" className={s['mob-vol-icon']} fill="none" stroke="currentColor"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
            </div>

            {/* UP NEXT */}
            <div className={s['mob-upnext']}>
              <div className={s['mob-upnext-header']}>
                <span className={s['mob-upnext-label']}>UP NEXT</span>
                <span className={s['mob-upnext-count']}>{songs.length} songs</span>
              </div>
              {songs.slice(0, 8).map((s2, i) => (
                <div key={s2.id}
                  className={`${s['mob-queue-item']} ${i === songs.indexOf(song) ? s['mob-queue-active'] : ''}`}
                  onClick={() => onSelectSong(i)}
                >
                  <div className={s['mob-queue-thumb']}>
                    {s2.image ? <img src={s2.image} alt={s2.title} /> : <span>🎵</span>}
                  </div>
                  <div className={s['mob-queue-info']}>
                    <p className={s['mob-queue-title']}>{s2.title}</p>
                    <p className={s['mob-queue-artist']}>{s2.artist}</p>
                  </div>
                  <span className={s['mob-queue-dur']}>{s2.duration}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14" style={{color:'var(--txt3)',flexShrink:0}}>
                    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                  </svg>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Other Pages */
          <div className={s['mob-page-content']}>
            {activePage === 'Explore' && (
              <div style={{paddingBottom:80}}>
                <h2 style={{fontSize:'1.3rem',fontWeight:800,marginBottom:8}}>Explore</h2>
                <p style={{color:'var(--txt3)',fontSize:'.85rem',marginBottom:20}}>Select a genre to discover songs</p>
                {[
                  {name:'Pop',emoji:'🎤',color:'#e040fb'},{name:'Rock',emoji:'🎸',color:'#f44336'},
                  {name:'Jazz',emoji:'🎷',color:'#ff9800'},{name:'Electronic',emoji:'🎛️',color:'#00bcd4'},
                  {name:'Bollywood',emoji:'🎬',color:'#e91e63'},{name:'Hip-Hop',emoji:'🎧',color:'#9c27b0'},
                  {name:'Lo-Fi',emoji:'☕',color:'#607d8b'},{name:'Punjabi',emoji:'🥁',color:'#ff6f00'},
                  {name:'R&B',emoji:'🎵',color:'#ff5722'},{name:'Classical',emoji:'🎻',color:'#8bc34a'},
                  {name:'Acoustic',emoji:'🪕',color:'#795548'},{name:'Lounge',emoji:'🌙',color:'#3f51b5'},
                ].map(g => (
                  <div key={g.name} onClick={() => { onGenre(g.name); onNavChange('Home'); }}
                    style={{display:'flex',alignItems:'center',gap:14,padding:'14px 16px',marginBottom:8,background:`rgba(255,255,255,0.04)`,borderRadius:14,cursor:'pointer',border:`1px solid rgba(255,255,255,0.06)`}}
                  >
                    <span style={{fontSize:'1.5rem'}}>{g.emoji}</span>
                    <span style={{fontWeight:700,fontSize:'.95rem'}}>{g.name}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" style={{marginLeft:'auto',color:'var(--txt3)'}}><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                ))}
              </div>
            )}
            {activePage === 'Library' && (
              <div style={{paddingBottom:80}}>
                <h2 style={{fontSize:'1.3rem',fontWeight:800,marginBottom:20}}>Library</h2>
                {[{label:'Albums',icon:'💿'},{label:'Artists',icon:'🎤'},{label:'Favorites',icon:'❤️'},{label:'Playlists',icon:'🎵'}].map(item => (
                  <div key={item.label} style={{display:'flex',alignItems:'center',gap:14,padding:'16px',marginBottom:8,background:'rgba(255,255,255,.04)',borderRadius:14,cursor:'pointer',border:'1px solid rgba(255,255,255,.06)'}}>
                    <span style={{fontSize:'1.4rem'}}>{item.icon}</span>
                    <span style={{fontWeight:600}}>{item.label}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" style={{marginLeft:'auto',color:'var(--txt3)'}}><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                ))}
              </div>
            )}
            {activePage === 'Search' && (
              <div style={{paddingBottom:80}}>
                <h2 style={{fontSize:'1.3rem',fontWeight:800,marginBottom:16}}>Search</h2>
                <div style={{display:'flex',alignItems:'center',gap:10,background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.1)',borderRadius:12,padding:'12px 16px',marginBottom:20}}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--txt3)" strokeWidth="2" width="18" height="18"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input placeholder="Search songs, artists..."
                    style={{background:'none',border:'none',outline:'none',color:'var(--txt)',fontSize:'.95rem',flex:1}}
                    onKeyDown={(e) => { if(e.key==='Enter'){ onSearch(e.target.value); onNavChange('Home'); } }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <div className={s['mob-bottom-nav']}>
        {[
          {label:'Home',   icon:'home',    page:'Home'   },
          {label:'Explore',icon:'explore', page:'Explore'},
          {label:'Library',icon:'library', page:'Library'},
          {label:'Search', icon:'search',  page:'Search' },
        ].map(n => (
          <button key={n.label}
            className={`${s['mob-nav-btn']} ${activePage === n.page ? s['mob-nav-active'] : ''}`}
            onClick={() => onNavChange(n.page)}
          >
            <MobNavIcon type={n.icon} />
            <span>{n.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function MobNavIcon({ type }) {
  const p = {viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round',width:22,height:22};
  if (type==='home')    return <svg {...p}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
  if (type==='explore') return <svg {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
  if (type==='library') return <svg {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>;
  if (type==='search')  return <svg {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
  return null;
}

function MobileCoverArt({ song }) {
  return (
    <div style={{width:'100%',height:'100%',borderRadius:20,background:song.sky||'linear-gradient(135deg,#1c1438,#2d1b69)',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:'20%',left:'50%',transform:'translateX(-50%)',width:120,height:120,borderRadius:'50%',background:song.moon||'radial-gradient(circle,#f0b0d0,#a04080)'}} />
      <div style={{position:'absolute',bottom:'28%',left:'50%',transform:'translateX(-50%)',width:16,height:36,background:'#0d0a20',clipPath:'polygon(30% 0%,70% 0%,80% 40%,100% 40%,100% 100%,0% 100%,0% 40%,20% 40%)'}} />
    </div>
  );
}