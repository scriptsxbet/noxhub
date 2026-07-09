const TOOL_CONFIG = {
    name: "CRASHFX",
    downloadUrl: "https://download.noxir.org/crashup-v1/CrashFX.apk",
    videoUrl: "https://download.noxir.org/crashup-v1/how-to-use-crashfx.mp4"
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