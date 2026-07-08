const player = document.querySelector("[data-video-player]");
const video = document.getElementById("lessonVideo");

if (player && video) {
    const centerPlay = player.querySelector(".center-play");
    const playToggle = player.querySelector(".play-toggle");
    const soundToggle = player.querySelector(".sound-toggle");
    const fullscreenToggle = player.querySelector(".fullscreen-toggle");
    const progress = player.querySelector("[data-progress]");
    const progressFill = player.querySelector(".video-progress-fill");
    const progressThumb = player.querySelector(".video-progress-thumb");
    const currentTimeText = player.querySelector(".current-time");
    const durationTimeText = player.querySelector(".duration-time");

    video.muted = false;
    video.volume = 1;

    video.addEventListener("contextmenu", (event) => event.preventDefault());
    player.addEventListener("contextmenu", (event) => event.preventDefault());
    video.addEventListener("dragstart", (event) => event.preventDefault());

    function formatTime(seconds) {
        if (!Number.isFinite(seconds)) return "00:00";

        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);

        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }

    function updateTime() {
        const percent = video.duration ? (video.currentTime / video.duration) * 100 : 0;

        progressFill.style.width = `${percent}%`;
        progressThumb.style.right = `${percent}%`;

        currentTimeText.textContent = formatTime(video.currentTime);
        durationTimeText.textContent = formatTime(video.duration);
    }

    function setIcon(button, iconClass) {
        button.innerHTML = `<i class="${iconClass}"></i>`;
    }

    function togglePlay() {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }

    function updatePlayState() {
        const isPlaying = !video.paused;

        player.classList.toggle("playing", isPlaying);
        setIcon(playToggle, isPlaying ? "ri-pause-fill" : "ri-play-fill");
    }

    function toggleSound() {
        video.muted = !video.muted;
        setIcon(soundToggle, video.muted ? "ri-volume-mute-line" : "ri-volume-up-line");
    }

    function seekByPointer(event) {
        const rect = progress.getBoundingClientRect();
        const clientX = event.clientX;

        let percent = (rect.right - clientX) / rect.width;
        percent = Math.max(0, Math.min(1, percent));

        video.currentTime = percent * video.duration;
    }

    let isDragging = false;

    centerPlay.addEventListener("click", togglePlay);
    playToggle.addEventListener("click", togglePlay);
    video.addEventListener("click", togglePlay);
    soundToggle.addEventListener("click", toggleSound);

    fullscreenToggle.addEventListener("click", async () => {
        if (!document.fullscreenElement) {
            await player.requestFullscreen?.();
        } else {
            await document.exitFullscreen?.();
        }
    });

    progress.addEventListener("pointerdown", (event) => {
        isDragging = true;
        progress.setPointerCapture(event.pointerId);
        seekByPointer(event);
    });

    progress.addEventListener("pointermove", (event) => {
        if (!isDragging) return;
        seekByPointer(event);
    });

    progress.addEventListener("pointerup", () => {
        isDragging = false;
    });

    progress.addEventListener("pointercancel", () => {
        isDragging = false;
    });

    video.addEventListener("loadedmetadata", updateTime);
    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("play", updatePlayState);
    video.addEventListener("pause", updatePlayState);
    video.addEventListener("ended", updatePlayState);

    updatePlayState();
}