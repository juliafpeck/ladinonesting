// SimpleAudioButton.js
(function() {
  // Create CSS styles
  const style = document.createElement('style');
  style.textContent = `
    .simple-audio-button {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #0e65a3;
      border: 1px solid #0e65a3;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      margin: 10px 0;
     overflow: hidden;
  position: static;
    }
    .simple-audio-button svg {
      width: 30px;
      height: 30px;
    }
    .simple-audio-button path,
    .simple-audio-button rect {
      fill: #fff;
    }
  `;
  document.head.appendChild(style);

  // Create the audio player
  window.createAudioButton = function(elementId, audioUrl, startTime, endTime) {
    // Default values
    startTime = parseFloat(startTime || 0);
    endTime = parseFloat(endTime || 0);
    
    // Get container element
    const container = document.getElementById(elementId);
    if (!container) return console.error('Container element not found:', elementId);
    
    // Create button
    const button = document.createElement('button');
    button.className = 'simple-audio-button';
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path id="playIcon-${elementId}" d="M8,5.14V19.14L19,12.14L8,5.14Z"></path>
        <g id="pauseIcon-${elementId}" style="display:none;">
          <rect x="7" y="5" width="3" height="14"></rect>
          <rect x="14" y="5" width="3" height="14"></rect>
        </g>
      </svg>
    `;
    container.appendChild(button);
    
    // Create audio element
    const audio = document.createElement('audio');
    audio.preload = 'metadata';
    
    // Create source
    const source = document.createElement('source');
    source.src = audioUrl;
    
    // Try to determine type from extension
    if (audioUrl.endsWith('.mp3')) {
      source.type = 'audio/mpeg';
    } else if (audioUrl.endsWith('.wav')) {
      source.type = 'audio/wav';
    } else if (audioUrl.endsWith('.ogg')) {
      source.type = 'audio/ogg';
    } else {
      source.type = 'audio/mp4'; // Default for m4a
    }
    
    audio.appendChild(source);
    container.appendChild(audio);
    
    // Get icon elements
    const playIcon = document.getElementById(`playIcon-${elementId}`);
    const pauseIcon = document.getElementById(`pauseIcon-${elementId}`);
    
    // Playback state
    let isPlaying = false;
    
    // Initialize audio after metadata is loaded
    audio.addEventListener('loadedmetadata', () => {
      audio.currentTime = startTime;
    });
    
    // Toggle play/pause
    button.addEventListener('click', () => {
      if (isPlaying) {
        audio.pause();
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
      } else {
        if (audio.currentTime < startTime || (endTime > 0 && audio.currentTime >= endTime)) {
          audio.currentTime = startTime;
        }
        audio.play();
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
      }
      isPlaying = !isPlaying;
    });
    
    // Check for end of clip
    audio.addEventListener('timeupdate', () => {
      if (endTime > 0 && audio.currentTime >= endTime) {
        audio.pause();
        audio.currentTime = startTime;
        isPlaying = false;
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
      }
    });
    
    return {
      play: function() {
        audio.currentTime = startTime;
        audio.play();
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
        isPlaying = true;
      },
      pause: function() {
        audio.pause();
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        isPlaying = false;
      }
    };
  };
})();
