const toggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (toggle && navLinks) {
  toggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

// EmailJS Config — REPLACE WITH YOUR KEYS
const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'YOUR_PUBLIC_KEY',
    SERVICE_ID: 'YOUR_SERVICE_ID',
    TEMPLATE_ID: 'YOUR_TEMPLATE_ID'
};

// Initialize EmailJS if key is provided
if (EMAILJS_CONFIG.PUBLIC_KEY && !EMAILJS_CONFIG.PUBLIC_KEY.includes('YOUR_')) {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
}


// =====================================================
// CONTACT FORM
// =====================================================
async function handleContact(e) {
    e.preventDefault();
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject').value.trim();
    const message = document.getElementById('contactMessage').value.trim();
    const btn = document.getElementById('contactBtn');
    const btnText = document.getElementById('contactBtnText');
    const btnIcon = document.getElementById('contactBtnIcon');
    const successDiv = document.getElementById('contactSuccess');
    const errorDiv = document.getElementById('contactError');
    const errorText = document.getElementById('contactErrorText');

    successDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');

    // Check if EmailJS is configured
    if (EMAILJS_CONFIG.PUBLIC_KEY.includes('YOUR_')) {
        // Demo mode — simulate success
        btn.disabled = true;
        btnText.textContent = 'Sending...';
        btnIcon.classList.add('hidden');
        btn.classList.add('opacity-75');

        setTimeout(() => {
            btn.disabled = false;
            btnText.textContent = 'Sent!';
            btnIcon.classList.remove('hidden');
            btnIcon.setAttribute('data-lucide', 'check');
            btn.classList.remove('opacity-75');
            successDiv.classList.remove('hidden');
            document.getElementById('contactForm').reset();
            lucide.createIcons();

            setTimeout(() => {
                btnText.textContent = 'Send Message';
                btnIcon.setAttribute('data-lucide', 'send');
                successDiv.classList.add('hidden');
                lucide.createIcons();
            }, 4000);
        }, 1500);
        return;
    }

    btn.disabled = true;
    btnText.textContent = 'Sending...';
    btnIcon.classList.add('hidden');
    btn.classList.add('opacity-75');

    try {
        await emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, {
            from_name: name,
            from_email: email,
            subject: subject,
            message: message,
            to_email: 'your@email.com'
        });

        btn.disabled = false;
        btnText.textContent = 'Sent!';
        btnIcon.classList.remove('hidden');
        btnIcon.setAttribute('data-lucide', 'check');
        btn.classList.remove('opacity-75');
        successDiv.classList.remove('hidden');
        document.getElementById('contactForm').reset();
        lucide.createIcons();

        setTimeout(() => {
            btnText.textContent = 'Send Message';
            btnIcon.setAttribute('data-lucide', 'send');
            successDiv.classList.add('hidden');
            lucide.createIcons();
        }, 4000);
    } catch (err) {
        btn.disabled = false;
        btnText.textContent = 'Send Message';
        btnIcon.classList.remove('hidden');
        btn.classList.remove('opacity-75');
        errorText.textContent = err.text || 'Failed to send. Please try again.';
        errorDiv.classList.remove('hidden');
        lucide.createIcons();
    }
}



function togglePlay(videoId) {
    const video = document.getElementById(videoId);

    if (!video) {
        return;
    }

    if (video.paused) {
        video.play().catch((error) => {
            console.error("Video could not play:", error);
        });
    } else {
        video.pause();
    }
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

document.querySelectorAll(".glass-player").forEach((player) => {
  const video = player.querySelector("video");
  const playButton = player.querySelector("[data-action='play']");
  const progress = player.querySelector("[data-action='progress']");
  const volume = player.querySelector("[data-action='volume']");
  const muteButton = player.querySelector("[data-action='mute']");
  const fullscreenButton = player.querySelector("[data-action='fullscreen']");
  const timeLabel = player.querySelector("[data-time]");

  if (!video || !playButton || !progress || !volume || !muteButton || !fullscreenButton || !timeLabel) {
    return;
  }

  const updatePlayButton = () => {
    playButton.textContent = video.paused ? "Play" : "Pause";
    playButton.setAttribute("aria-label", video.paused ? "Play video" : "Pause video");
  };

  const updateProgress = () => {
    progress.value = video.duration ? (video.currentTime / video.duration) * 100 : 0;
    timeLabel.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
  };

  const updateMuteButton = () => {
    muteButton.textContent = video.muted || video.volume === 0 ? "Unmute" : "Mute";
    muteButton.setAttribute("aria-label", video.muted || video.volume === 0 ? "Unmute video" : "Mute video");
  };

  playButton.addEventListener("click", () => {
    if (video.paused) {
      video.play().catch((error) => console.error("Video could not play:", error));
    } else {
      video.pause();
    }
  });

  progress.addEventListener("input", () => {
    if (video.duration) {
      video.currentTime = (Number(progress.value) / 100) * video.duration;
    }
  });

  volume.addEventListener("input", () => {
    video.volume = Number(volume.value);
    video.muted = video.volume === 0;
    updateMuteButton();
  });

  muteButton.addEventListener("click", () => {
    video.muted = !video.muted;
    updateMuteButton();
  });

  fullscreenButton.addEventListener("click", () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (player.requestFullscreen) {
      player.requestFullscreen();
    }
  });

  video.addEventListener("loadedmetadata", updateProgress);
  video.addEventListener("timeupdate", updateProgress);
  video.addEventListener("play", updatePlayButton);
  video.addEventListener("pause", updatePlayButton);
  video.addEventListener("volumechange", updateMuteButton);

  updatePlayButton();
  updateProgress();
  updateMuteButton();
});


const list = document.querySelectorAll(".list");

list.forEach((item) => item.addEventListener("click", (event) => {
  list.forEach((listItem) => listItem.classList.remove("active"));
  event.currentTarget.classList.add("active");
}));


// =====================================================
// INIT
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    createParticles();
});

window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        document.getElementById('mobileMenu').classList.remove('open');
        document.getElementById('menuOverlay').classList.add('hidden');
        document.body.style.overflow = '';
    }
});
