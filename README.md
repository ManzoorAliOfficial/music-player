src/
├── data/
│   └── songs.js              ← Songs ka data (title, artist, colors)
├── components/
│   ├── Sidebar.jsx / .css    ← Left nav panel
│   ├── AlbumCover.jsx / .css ← Animated cover art (moon + stars)
│   ├── SongInfo.jsx / .css   ← Title, artist, like & dots
│   ├── ProgressBar.jsx / .css← Seekable progress bar
│   ├── Controls.jsx / .css   ← Play/Pause/Next/Prev/Shuffle/Repeat
│   ├── VolumeControl.jsx/.css← Volume slider
│   ├── BottomBar.jsx / .css  ← Mini player at bottom
│   └── Playlist.jsx / .css   ← Right songs list
├── pages/
│   └── MusicPlayer.jsx / .css← Main page (connects all components)
├── styles/
│   └── globals.css           ← Global CSS variables & reset
├── App.jsx
└── main.jsx