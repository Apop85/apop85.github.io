// =========================================================
// LEOSYNC WEBSITE - LANGUAGE HANDLING
// =========================================================

(() => {
    "use strict";

    const supportedLanguages = ["de", "en"];
    const defaultLanguage = "de";

    function getSavedLanguage() {
        try {
            const saved = localStorage.getItem("leosync-language");

            if (supportedLanguages.includes(saved)) {
                return saved;
            }
        } catch (error) {
            // Local storage may be unavailable.
        }

        return defaultLanguage;
    }

    function applyLanguage(language) {
        if (!supportedLanguages.includes(language)) {
            language = defaultLanguage;
        }

        document.documentElement.lang = language;

        document.querySelectorAll("[data-de][data-en]").forEach(element => {
            const translation = element.getAttribute("data-" + language);

            if (translation === null) {
                return;
            }

            if (element.hasAttribute("data-html")) {
                element.innerHTML = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Update language-dependent images
        document.querySelectorAll("[data-de-src][data-en-src]").forEach(img => {

            const imageSource = img.getAttribute("data-" + language + "-src");

            if (imageSource) {
                img.src = imageSource;
            }

        });
        
        const button = document.querySelector("[data-language-toggle]");

        if (button) {
            button.textContent = language === "de" ? "EN" : "DE";
            button.setAttribute(
                "aria-label",
                language === "de"
                    ? "Switch to English"
                    : "Zu Deutsch wechseln"
            );
        }

        const title = document.querySelector("[data-title-de]");

        if (title) {
            document.title = title.getAttribute("data-title-" + language);
        }

        try {
            localStorage.setItem("leosync-language", language);
        } catch (error) {
            // The page still works without local storage.
        }
    }

    function toggleLanguage() {
        const current = document.documentElement.lang || defaultLanguage;
        const next = current === "de" ? "en" : "de";

        applyLanguage(next);
    }

    document.addEventListener("DOMContentLoaded", () => {
        applyLanguage(getSavedLanguage());

        const button = document.querySelector("[data-language-toggle]");

        if (button) {
            button.addEventListener("click", toggleLanguage);
        }
    });
})();


/* =====================================================
   LEOSYNC LOADING SCREEN CONTROL
   ===================================================== */

function hideLeoLoadingScreen() {

    const loadingScreen =
        document.getElementById("leo-loading");

    if (!loadingScreen) return;

    loadingScreen.classList.add("finished");

    setTimeout(() => {
        loadingScreen.remove();
    }, 700);

}

// Nach vollständigem Laden aller Ressourcen
window.addEventListener("load", () => {

    setTimeout(hideLeoLoadingScreen, 700);

});

// Sicherheitsnetz
setTimeout(hideLeoLoadingScreen, 8000);
