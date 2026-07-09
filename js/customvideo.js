const player = document.querySelector("[data-video-player]");
const video = document.getElementById("lessonVideo");

if (player && video) {
    const centerPlay = player.querySelector(".center-play");
    const playToggle = player.querySelector(".play-toggle");
    const soundToggle = player.querySelector(".sound-toggle");
    const fullscreenToggle = player.querySelector(".fullscreen-toggle");
    const videoControls = player.querySelector(".video-controls");
    const progress = player.querySelector("[data-progress]");
    const progressFill = player.querySelector(".video-progress-fill");
    const progressThumb = player.querySelector(".video-progress-thumb");
    const currentTimeText = player.querySelector(".current-time");
    const durationTimeText = player.querySelector(".duration-time");

    let controlsTimer = null;
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

    function setIcon(button, iconClass) {
        if (!button) return;
        button.innerHTML = `<i class="${iconClass}"></i>`;
    }

    function updateTime() {
        const percent = video.duration ? (video.currentTime / video.duration) * 100 : 0;

        if (progressFill) {
            progressFill.style.width = `${percent}%`;
        }

        if (progressThumb) {
            progressThumb.style.right = `${percent}%`;
        }

        if (currentTimeText) {
            currentTimeText.textContent = formatTime(video.currentTime);
        }

        if (durationTimeText) {
            durationTimeText.textContent = formatTime(video.duration);
        }
    }

    function clearControlsTimer() {
        if (controlsTimer) {
            clearTimeout(controlsTimer);
            controlsTimer = null;
        }
    }

    function hideControlsAfterDelay() {
        clearControlsTimer();

        if (!video.paused) {
            controlsTimer = setTimeout(() => {
                player.classList.add("controls-hidden");
            }, 5000);
        }
    }

    function showControls() {
        player.classList.remove("controls-hidden");
        hideControlsAfterDelay();
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

            player.classList.remove("controls-hidden");
            player.classList.add("show-center");
        }
    }

    function togglePlay() {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }

    function toggleSound() {
        video.muted = !video.muted;

        setIcon(soundToggle, video.muted ? "ri-volume-mute-line" : "ri-volume-up-line");

        showControls();
    }

    function isFullscreenActive() {
        return (
            document.fullscreenElement === player ||
            document.webkitFullscreenElement === player ||
            video.webkitDisplayingFullscreen
        );
    }

    function updateFullscreenIcon() {
        const active = isFullscreenActive();

        setIcon(
            fullscreenToggle,
            active ? "ri-fullscreen-exit-line" : "ri-fullscreen-line"
        );
    }

    async function enterFullscreen() {
        try {
            if (player.requestFullscreen) {
                await player.requestFullscreen();
            } else if (player.webkitRequestFullscreen) {
                player.webkitRequestFullscreen();
            } else if (video.requestFullscreen) {
                await video.requestFullscreen();
            } else if (video.webkitEnterFullscreen) {
                video.webkitEnterFullscreen();
            }
        } catch (error) {
            console.warn("Fullscreen enter skipped:", error);
        }

        updateFullscreenIcon();
        showControls();
    }

    async function exitFullscreen() {
        try {
            if (document.fullscreenElement && document.exitFullscreen) {
                await document.exitFullscreen();
            } else if (document.webkitFullscreenElement && document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (video.webkitDisplayingFullscreen && video.webkitExitFullscreen) {
                video.webkitExitFullscreen();
            }
        } catch (error) {
            console.warn("Fullscreen exit skipped:", error);
        }

        updateFullscreenIcon();
        showControls();
    }

    async function toggleFullscreen() {
        if (isFullscreenActive()) {
            await exitFullscreen();
        } else {
            await enterFullscreen();
        }
    }

    function seekByPointer(event) {
        if (!progress || !video.duration) return;

        const rect = progress.getBoundingClientRect();
        const clientX = event.clientX;

        let percent = (rect.right - clientX) / rect.width;
        percent = Math.max(0, Math.min(1, percent));

        video.currentTime = percent * video.duration;
    }

    if (videoControls) {
        videoControls.addEventListener("click", (event) => {
            event.stopPropagation();
        });

        videoControls.addEventListener("pointerdown", (event) => {
            event.stopPropagation();
        });
    }

    centerPlay?.addEventListener("click", (event) => {
        event.stopPropagation();
        togglePlay();
    });

    playToggle?.addEventListener("click", (event) => {
        event.stopPropagation();
        togglePlay();
        showControls();
    });

    soundToggle?.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleSound();
    });

    fullscreenToggle?.addEventListener("click", async (event) => {
        event.stopPropagation();
        await toggleFullscreen();
    });

    /*
        أي ضغطة على مساحة الفيديو نفسها:
        - لو واقف: يشغل
        - لو شغال: يوقف
        بشرط ألا تكون الضغطة على شريط التحكم
    */
    player.addEventListener("click", (event) => {
        if (event.target.closest(".video-controls")) return;
        if (event.target.closest(".center-play")) return;

        togglePlay();
    });

    /*
        الحركة / hover / touch تظهر الإعدادات فقط
        بدون تشغيل أو إيقاف الفيديو
    */
    player.addEventListener("mouseenter", () => {
        showControls();
    });

    player.addEventListener("mousemove", () => {
        showControls();
    });

    player.addEventListener("pointermove", () => {
        showControls();
    });

    player.addEventListener("touchstart", () => {
        showControls();
    }, { passive: true });

    progress?.addEventListener("pointerdown", (event) => {
        event.stopPropagation();

        isDragging = true;
        progress.setPointerCapture(event.pointerId);
        seekByPointer(event);
        showControls();
    });

    progress?.addEventListener("pointermove", (event) => {
        if (!isDragging) return;

        event.stopPropagation();
        seekByPointer(event);
        showControls();
    });

    progress?.addEventListener("pointerup", (event) => {
        event.stopPropagation();

        isDragging = false;
        showControls();
    });

    progress?.addEventListener("pointercancel", () => {
        isDragging = false;
    });

    document.addEventListener("fullscreenchange", updateFullscreenIcon);
    document.addEventListener("webkitfullscreenchange", updateFullscreenIcon);

    video.addEventListener("webkitbeginfullscreen", updateFullscreenIcon);
    video.addEventListener("webkitendfullscreen", updateFullscreenIcon);

    video.addEventListener("loadedmetadata", updateTime);
    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("play", updatePlayState);
    video.addEventListener("pause", updatePlayState);
    video.addEventListener("ended", updatePlayState);

    updateTime();
    updatePlayState();
    updateFullscreenIcon();
}