
const BASE = 'https://itunes.apple.com';

export async function getFeaturedSongs(limit = 25) {
  const url = `${BASE}/search?term=top+hits+2024&entity=song&limit=${limit}&country=US`;
  const res = await fetch(url);
  const data = await res.json();
  return formatSongs(data.results || []);
}
export async function searchSongs(query, limit = 25) {
  const url = `${BASE}/search?term=${encodeURIComponent(query)}&entity=song&limit=${limit}&country=US`;
  const res = await fetch(url);
  const data = await res.json();
  return formatSongs(data.results || []);
}

export async function getSongsByGenre(genre, limit = 25) {
  const url = `${BASE}/search?term=${encodeURIComponent(genre)}&entity=song&limit=${limit}&country=US`;
  const res = await fetch(url);
  const data = await res.json();
  return formatSongs(data.results || []);
}

function formatSongs(results) {
  return results
    .filter((t) => t.previewUrl)
    .map((t) => ({
      id: t.trackId,
      title: t.trackName,
      artist: t.artistName,
      album: t.collectionName || '',
      src: t.previewUrl,
      image: t.artworkUrl100?.replace('100x100', '300x300'),
      duration: formatDuration(Math.floor((t.trackTimeMillis || 30000) / 1000)),
      seconds: Math.floor((t.trackTimeMillis || 30000) / 1000),
      genre: t.primaryGenreName || '',
    }));
}

function formatDuration(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}