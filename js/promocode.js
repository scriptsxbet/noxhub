const PROMO_DATA = {
    "1xbet": {
        name: "1xBet",
        code: "NXR66",
        url: "https://tinyurl.com/2h2ddjf6"
    },
    "melbet": {
        name: "MelBet",
        code: "NXR66",
        url: "https://refpa3665.com/L?tag=d_5717398m_2170c_&site=5717398&ad=2170"
    },
    "linebet": {
        name: "LineBet",
        code: "NXR66",
        url: "https://lb-aff.com/L?tag=d_5716988m_22611c_site&site=5716988&ad=22611&r=registration"
    }
};

const promoTabs = document.querySelectorAll(".promo-tab");
const promoPlatformName = document.getElementById("promoPlatformName");
const promoPlatformChip = document.getElementById("promoPlatformChip");
const promoPlatformBadge = document.getElementById("promoPlatformBadge");
const promoCodeText = document.getElementById("promoCodeText");
const promoCodeMini = document.getElementById("promoCodeMini");
const copyPromoBtn = document.getElementById("copyPromoBtn");
const copyPromoMainBtn = document.getElementById("copyPromoMainBtn");

let currentPromoPlatform = "1xbet";

function updatePromo(platformKey) {
    const data = PROMO_DATA[platformKey];

    if (!data) return;

    currentPromoPlatform = platformKey;

    promoTabs.forEach((tab) => {
        const isActive = tab.dataset.platform === platformKey;
        tab.classList.toggle("active", isActive);
    });

    if (promoPlatformName) promoPlatformName.textContent = data.name;
    if (promoPlatformChip) promoPlatformChip.textContent = data.name;
    if (promoPlatformBadge) promoPlatformBadge.textContent = data.name;
    if (promoCodeText) promoCodeText.textContent = data.code;
    if (promoCodeMini) promoCodeMini.textContent = data.code;
}

async function copyPromoAndRedirect() {
    const data = PROMO_DATA[currentPromoPlatform];

    if (!data) return;

    try {
        await navigator.clipboard.writeText(data.code);
        window.showToast?.(`تم نسخ البروموكود ${data.code} بنجاح`);
    } catch {
        window.showToast?.("لم يتم النسخ تلقائياً، انسخ الكود يدوياً.");
    }

    setTimeout(() => {
        if (data.url && data.url !== "#") {
            window.location.href = data.url;
        }
    }, 750);
}

promoTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        updatePromo(tab.dataset.platform);
    });
});

copyPromoBtn?.addEventListener("click", copyPromoAndRedirect);
copyPromoMainBtn?.addEventListener("click", copyPromoAndRedirect);

updatePromo(currentPromoPlatform);