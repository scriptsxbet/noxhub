const TOOL_CONFIG = {
    name: "CRASHFX",
    downloadUrl: "https://download.noxir.org/crashup-v1/CrashFX.apk",
    videoUrl: "https://download.noxir.org/crashup-v1/how-to-use-crashfx.mp4"
};

const androidDownloadBtn = document.getElementById("androidDownloadBtn");
const lessonVideo = document.getElementById("lessonVideo");
const faqItems = document.querySelectorAll("[data-faq-item]");
const floatingDownloadBtn = document.querySelector(".floating-download-btn");
const downloadSection = document.getElementById("download");

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

function closeFaqItem(item) {
    if (!item) return;

    const button = item.querySelector(".faq-question");

    item.classList.remove("active");

    if (button) {
        button.setAttribute("aria-expanded", "false");
    }
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
});

if (floatingDownloadBtn && downloadSection) {
    const toggleFloatingDownloadBtn = () => {
        const sectionRect = downloadSection.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;

        const sectionVisible =
            sectionRect.top < windowHeight * 0.72 &&
            sectionRect.bottom > windowHeight * 0.25;

        floatingDownloadBtn.classList.toggle("is-hidden", sectionVisible);
    };

    floatingDownloadBtn.addEventListener("click", () => {
        floatingDownloadBtn.classList.add("is-hidden");
    });

    if ("IntersectionObserver" in window) {
        const downloadObserver = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                floatingDownloadBtn.classList.toggle(
                    "is-hidden",
                    entry.isIntersecting && entry.intersectionRatio > 0.18
                );
            },
            {
                threshold: [0, 0.18, 0.35],
                rootMargin: "0px 0px -12% 0px"
            }
        );

        downloadObserver.observe(downloadSection);
    } else {
        window.addEventListener("scroll", toggleFloatingDownloadBtn, { passive: true });
        window.addEventListener("resize", toggleFloatingDownloadBtn);
    }

    toggleFloatingDownloadBtn();
}