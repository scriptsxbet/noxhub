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

    let controlsTimer = null;
    let centerIconTimer = null;
    let isDragging = false;

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
        if (!button) return;
        button.innerHTML = `<i class="${iconClass}"></i>`;
    }

    function clearControlsTimer() {
        if (controlsTimer) {
            clearTimeout(controlsTimer);
            controlsTimer = null;
        }
    }

    function clearCenterIconTimer() {
        if (centerIconTimer) {
            clearTimeout(centerIconTimer);
            centerIconTimer = null;
        }
    }

    function hideControls() {
        if (!video.paused) {
            player.classList.add("controls-hidden");
        }
    }

    function showControls() {
        player.classList.remove("controls-hidden");

        clearControlsTimer();

        if (!video.paused) {
            controlsTimer = setTimeout(() => {
                hideControls();
            }, 5000);
        }
    }

    function hideCenterIcon() {
        if (!video.paused) {
            player.classList.remove("show-center");
        }
    }

    function showCenterPauseIcon() {
        if (video.paused) return;

        setIcon(centerPlay, "ri-pause-fill");
        player.classList.add("show-center");

        clearCenterIconTimer();

        centerIconTimer = setTimeout(() => {
            hideCenterIcon();
        }, 2000);
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
        setIcon(centerPlay, isPlaying ? "ri-pause-fill" : "ri-play-fill");

        if (isPlaying) {
            player.classList.remove("show-center");
            showControls();
        } else {
            clearControlsTimer();
            clearCenterIconTimer();

            player.classList.remove("controls-hidden");
            player.classList.add("show-center");
        }
    }

    function toggleSound() {
        video.muted = !video.muted;
        setIcon(soundToggle, video.muted ? "ri-volume-mute-line" : "ri-volume-up-line");
        showControls();
    }

    function seekByPointer(event) {
        const rect = progress.getBoundingClientRect();
        const clientX = event.clientX;

        let percent = (rect.right - clientX) / rect.width;
        percent = Math.max(0, Math.min(1, percent));

        video.currentTime = percent * video.duration;
    }

    centerPlay.addEventListener("click", (event) => {
        event.stopPropagation();
        togglePlay();
    });

    playToggle.addEventListener("click", (event) => {
        event.stopPropagation();
        togglePlay();
        showControls();
    });

    soundToggle.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleSound();
    });

    fullscreenToggle.addEventListener("click", async (event) => {
        event.stopPropagation();
        showControls();

        if (!document.fullscreenElement) {
            await player.requestFullscreen?.();
        } else {
            await document.exitFullscreen?.();
        }
    });

    player.addEventListener("mouseenter", () => {
        showControls();
    });

    player.addEventListener("mousemove", () => {
        showControls();
    });

    player.addEventListener("pointermove", () => {
        showControls();
    });

    player.addEventListener("click", (event) => {
        if (event.target.closest(".video-controls")) return;
        if (event.target.closest(".center-play")) return;

        if (video.paused) {
            video.play();
            return;
        }

        showCenterPauseIcon();
    });

    progress.addEventListener("pointerdown", (event) => {
        event.stopPropagation();

        isDragging = true;
        progress.setPointerCapture(event.pointerId);
        seekByPointer(event);
        showControls();
    });

    progress.addEventListener("pointermove", (event) => {
        if (!isDragging) return;

        seekByPointer(event);
        showControls();
    });

    progress.addEventListener("pointerup", (event) => {
        event.stopPropagation();

        isDragging = false;
        showControls();
    });

    progress.addEventListener("pointercancel", () => {
        isDragging = false;
    });

    video.addEventListener("loadedmetadata", updateTime);
    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("play", updatePlayState);
    video.addEventListener("pause", updatePlayState);
    video.addEventListener("ended", updatePlayState);

    updateTime();
    updatePlayState();
}