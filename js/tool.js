const TOOL_CONFIG = {
    name: "CRASHFX",
    downloadUrl: "https://download.noxir.org/crashup-v1/CrashFX.apk",
    videoUrl: "assets/crashfx-guide.mp4",

    faqVideos: {
        minimum: "assets/crashfx-guide.mp4",
        dailyLimit: "assets/crashfx-guide.mp4",
        activationIssue: "assets/crashfx-guide.mp4",
        correctLinking: "assets/crashfx-guide.mp4"
    }
};

const androidDownloadBtn = document.getElementById("androidDownloadBtn");
const lessonVideo = document.getElementById("lessonVideo");
const faqItems = document.querySelectorAll("[data-faq-item]");

if (androidDownloadBtn) {
    androidDownloadBtn.href = TOOL_CONFIG.downloadUrl;

    androidDownloadBtn.addEventListener("click", (event) => {
        if (!TOOL_CONFIG.downloadUrl || TOOL_CONFIG.downloadUrl.includes("example.com")) {
            event.preventDefault();
            window.showToast?.("ضع رابط تحميل APK الحقيقي داخل ملف js/tool.js");
            return;
        }

        window.showToast?.("جاري تجهيز التحميل...");
    });
}

if (lessonVideo && TOOL_CONFIG.videoUrl) {
    lessonVideo.src = TOOL_CONFIG.videoUrl;
}

function getFaqVideo(item) {
    if (!item) return null;

    return item.querySelector(".faq-video, .faq-custom-player video, video");
}

function loadFaqVideo(item) {
    if (!item) return;

    const videoKey = item.dataset.faqVideo;
    const videoUrl = TOOL_CONFIG.faqVideos?.[videoKey];
    const video = getFaqVideo(item);

    if (!video || !videoUrl) return;

    const source = video.querySelector("source");

    if (source) {
        if (source.getAttribute("src") !== videoUrl) {
            source.setAttribute("src", videoUrl);
            video.load();
        }
    } else {
        if (video.getAttribute("src") !== videoUrl) {
            video.setAttribute("src", videoUrl);
            video.load();
        }
    }
}

function pauseFaqVideo(item, reset = true) {
    const video = getFaqVideo(item);

    if (!video) return;

    video.pause();

    if (reset) {
        try {
            video.currentTime = 0;
        } catch (error) {
            console.warn("Video reset skipped:", error);
        }
    }
}

function closeFaqItem(item) {
    if (!item) return;

    const button = item.querySelector(".faq-question");

    item.classList.remove("active");

    if (button) {
        button.setAttribute("aria-expanded", "false");
    }

    pauseFaqVideo(item);
}

function openFaqItem(item) {
    if (!item) return;

    const button = item.querySelector(".faq-question");

    faqItems.forEach((faqItem) => {
        if (faqItem !== item) {
            closeFaqItem(faqItem);
        }
    });

    item.classList.add("active");

    if (button) {
        button.setAttribute("aria-expanded", "true");
    }

    loadFaqVideo(item);
}

faqItems.forEach((item) => {
    const button = item.querySelector(".faq-question");

    item.classList.remove("active");

    if (button) {
        button.setAttribute("aria-expanded", "false");

        button.addEventListener("click", () => {
            const isActive = item.classList.contains("active");

            if (isActive) {
                closeFaqItem(item);
            } else {
                openFaqItem(item);
            }
        });
    }

    pauseFaqVideo(item);
});