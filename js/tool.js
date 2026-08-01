(() => {
    "use strict";

    const config = window.TOOL_CONFIG;

    if (!config) {
        console.error(
            "TOOL_CONFIG is missing. Load the tool configuration file before js/tool.js"
        );

        return;
    }

    const androidDownloadBtn =
        document.getElementById("androidDownloadBtn");

    const lessonVideo =
        document.getElementById("lessonVideo");

    const faqItems =
        document.querySelectorAll("[data-faq-item]");

    const floatingDownloadBtn =
        document.querySelector(".floating-download-btn");

    const downloadSection =
        document.getElementById("download");

    initializeDownloadButton();
    initializeVideo();
    initializeFaq();
    initializeFloatingDownloadButton();

    function initializeDownloadButton() {
        if (!androidDownloadBtn) return;

        if (config.downloadUrl) {
            androidDownloadBtn.href = config.downloadUrl;
        }

        androidDownloadBtn.addEventListener("click", (event) => {
            const downloadUrl =
                typeof config.downloadUrl === "string"
                    ? config.downloadUrl.trim()
                    : "";

            if (
                !downloadUrl ||
                downloadUrl === "#" ||
                downloadUrl.includes("example.com")
            ) {
                event.preventDefault();

                window.showToast?.(
                    `لم يتم إضافة رابط تحميل ${config.name}`
                );

                return;
            }

            window.showToast?.(
                `جاري تجهيز تحميل ${config.name}...`
            );
        });
    }

    function initializeVideo() {
        if (!lessonVideo) return;

        const videoUrl =
            typeof config.videoUrl === "string"
                ? config.videoUrl.trim()
                : "";

        const posterUrl =
            typeof config.posterUrl === "string"
                ? config.posterUrl.trim()
                : "";

        if (videoUrl) {
            lessonVideo.src = videoUrl;
        } else {
            lessonVideo.removeAttribute("src");
        }

        if (posterUrl) {
            lessonVideo.poster = posterUrl;
        } else {
            lessonVideo.removeAttribute("poster");
        }

        lessonVideo.load();
    }

    function closeFaqItem(item) {
        if (!item) return;

        const button =
            item.querySelector(".faq-question");

        item.classList.remove("active");

        if (button) {
            button.setAttribute(
                "aria-expanded",
                "false"
            );
        }
    }

    function openFaqItem(item) {
        if (!item) return;

        faqItems.forEach((faqItem) => {
            if (faqItem !== item) {
                closeFaqItem(faqItem);
            }
        });

        const button =
            item.querySelector(".faq-question");

        item.classList.add("active");

        if (button) {
            button.setAttribute(
                "aria-expanded",
                "true"
            );
        }
    }

    function initializeFaq() {
        faqItems.forEach((item) => {
            const button =
                item.querySelector(".faq-question");

            closeFaqItem(item);

            if (!button) return;

            button.addEventListener("click", () => {
                const isActive =
                    item.classList.contains("active");

                if (isActive) {
                    closeFaqItem(item);
                } else {
                    openFaqItem(item);
                }
            });
        });
    }

    function initializeFloatingDownloadButton() {
        if (
            !floatingDownloadBtn ||
            !downloadSection
        ) {
            return;
        }

        const updateFloatingButton = () => {
            const sectionRect =
                downloadSection.getBoundingClientRect();

            const windowHeight =
                window.innerHeight ||
                document.documentElement.clientHeight;

            const sectionVisible =
                sectionRect.top < windowHeight * 0.72 &&
                sectionRect.bottom > windowHeight * 0.25;

            floatingDownloadBtn.classList.toggle(
                "is-hidden",
                sectionVisible
            );
        };

        floatingDownloadBtn.addEventListener(
            "click",
            () => {
                floatingDownloadBtn.classList.add(
                    "is-hidden"
                );
            }
        );

        if ("IntersectionObserver" in window) {
            const downloadObserver =
                new IntersectionObserver(
                    (entries) => {
                        const entry = entries[0];

                        if (!entry) return;

                        const shouldHide =
                            entry.isIntersecting &&
                            entry.intersectionRatio > 0.18;

                        floatingDownloadBtn.classList.toggle(
                            "is-hidden",
                            shouldHide
                        );
                    },
                    {
                        threshold: [0, 0.18, 0.35],
                        rootMargin:
                            "0px 0px -12% 0px",
                    }
                );

            downloadObserver.observe(
                downloadSection
            );
        } else {
            window.addEventListener(
                "scroll",
                updateFloatingButton,
                {
                    passive: true,
                }
            );

            window.addEventListener(
                "resize",
                updateFloatingButton
            );
        }

        updateFloatingButton();
    }
})();