let audio = new Audio(); // Single reusable Audio instance

/**
 * Loads a new song and starts playback once ready.
 * Prevents AbortError by ensuring audio is buffered before playing.
 * @param {Object} song - The song object containing a `url` field.
 */
export const loadAndPlay = (song) => {
  if (!song?.url) return;

  // Stop any current playback
  audio.pause();
  audio.oncanplaythrough = null; // Clear old event listener if any

  // Assign new source and force load
  audio.src = song.url;
  audio.load();

  // Play only once buffering is done
  audio.oncanplaythrough = () => {
    audio.play().catch((err) => {
      if (err.name !== 'AbortError') {
        console.warn('Audio play error:', err);
      }
    });
  };
};

/**
 * Toggles play/pause on the currently loaded audio.
 */
export const togglePlay = () => {
  if (!audio.src) return; // No song loaded yet

  audio.paused
    ? audio.play().catch((err) => {
        if (err.name !== 'AbortError') {
          console.warn('Play failed:', err);
        }
      })
    : audio.pause();
};

/**
 * Returns whether audio is currently playing.
 * @returns {boolean}
 */
export const isPlaying = () => {
  return !!audio.src && !audio.paused;
};
