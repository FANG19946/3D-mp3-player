import { applyScreenTexture } from "./applyScreenTexture";

let audio = new Audio(); // Single reusable Audio instance

// Track user interaction
let interactionDone = false;
let pendingClickListener = false; // Prevent stacking listeners

/**
 * Loads a new song and starts playback once ready.
 * Prevents AbortError by ensuring audio is buffered before playing.
 * @param {Object} song - The song object containing a `url` field.
 */
export const loadAndPlay = (song, screenMesh) => {
  if (!song?.url) return;

  // Stop any current playback
  audio.pause();
  audio.oncanplaythrough = null;

  const tryLoadAndPlay = () => {
    // Assign new source and force load
    audio.src = song.url;
    audio.load();

    // Play once buffered
    audio.oncanplaythrough = () => {
      audio.play().catch((err) => {
        if (err.name !== "AbortError") {
          console.warn("Audio play error:", err);
        }
      });

      // Apply album art as texture (after buffering complete)
      if (screenMesh) {
        applyScreenTexture(screenMesh, song.albumArt);
      } else {
        console.warn("⚠️ No screen mesh to apply album art.");
      }
    };
  };

  // If already interacted, just play
  if (interactionDone) {
    tryLoadAndPlay();
  } else if (!pendingClickListener) {
    pendingClickListener = true;
    const waitForClick = () => {
      interactionDone = true;
      pendingClickListener = false;
      window.removeEventListener("click", waitForClick);
      tryLoadAndPlay();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("click", waitForClick, { once: true });
    }
  } else {
    console.log("⚠️ Waiting for user interaction to start playback.");
  }
};

/**
 * Toggles play/pause on the currently loaded audio.
 */
export const togglePlay = () => {
  if (!audio.src) return; // No song loaded yet

  audio.paused
    ? audio.play().catch((err) => {
        if (err.name !== "AbortError") {
          console.warn("Play failed:", err);
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
