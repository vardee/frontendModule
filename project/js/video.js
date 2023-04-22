const video = document.getElementById('video-background');
const toggleBtn = document.getElementById('toggle-btn');
let isPlaying = false;

toggleBtn.addEventListener('click', function() {
  if (isPlaying) {
    video.pause();
    video.muted = true;
    video.style.display = 'none';
    toggleBtn.innerHTML = 'CONTINUE AMAN';
  } else {
    video.play();
    video.muted = false;
    video.style.display = 'block';
    toggleBtn.innerHTML = 'PAUSE AMAN';
  }
  isPlaying = !isPlaying;
});