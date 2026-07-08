const menuButton = document.querySelector(".menu-btn");
const navMenu = document.querySelector(".nav-menu");
const toast = document.getElementById("siteToast");

function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2600);
}

window.showToast = showToast;

if (menuButton && navMenu) {
    menuButton.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("open");

        menuButton.classList.toggle("active", isOpen);
        document.body.classList.toggle("menu-open", isOpen);
    });

    navMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("open");
            menuButton.classList.remove("active");
            document.body.classList.remove("menu-open");
        });
    });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") return;

        const target = document.querySelector(targetId);

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});

const revealItems = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        });
    },
    {
        threshold: 0.12
    }
);

revealItems.forEach((item) => revealObserver.observe(item));

document.querySelectorAll(".disabled-action").forEach((button) => {
    button.addEventListener("click", () => {
        showToast("قسم المشاكل الشائعة سيتم إضافته لاحقاً.");
    });
});

document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    navMenu?.classList.remove("open");
    menuButton?.classList.remove("active");
    document.body.classList.remove("menu-open");
});