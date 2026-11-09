/* =====================================================
   LEOSYNC LOADING SCREEN CONTROL
   (Die Sprachen sind eigene Seiten: /leosync/ und /leosync/en/)
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


/* =====================================================
   MOBILE NAVIGATION (HAMBURGER MENU)
   Der Button wird per JS eingefügt. Ohne JS bleibt die
   normale, umbrechende Navigation sichtbar.
   ===================================================== */

(function initMobileNav() {

    const navigation = document.querySelector(".site-header .navigation");
    const nav = navigation && navigation.querySelector(".nav-links");

    if (!nav) return;

    const isEnglish =
        (document.documentElement.lang || "").toLowerCase().startsWith("en");

    const labelOpen = isEnglish ? "Open menu" : "Menü öffnen";
    const labelClose = isEnglish ? "Close menu" : "Menü schliessen";

    if (!nav.id) nav.id = "site-nav";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "nav-toggle";
    button.setAttribute("aria-controls", nav.id);
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", labelOpen);
    button.innerHTML = "<span></span><span></span><span></span>";

    navigation.insertBefore(button, nav);
    navigation.classList.add("nav-ready");

    function setOpen(open) {
        nav.classList.toggle("open", open);
        button.setAttribute("aria-expanded", String(open));
        button.setAttribute("aria-label", open ? labelClose : labelOpen);
    }

    button.addEventListener("click", () => {
        setOpen(!nav.classList.contains("open"));
    });

    nav.addEventListener("click", (event) => {
        if (event.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && nav.classList.contains("open")) {
            setOpen(false);
            button.focus();
        }
    });

    window.matchMedia("(min-width: 681px)").addEventListener("change", (event) => {
        if (event.matches) setOpen(false);
    });

})();


/* =====================================================
   ANKER-SPRUNG MIT LAZY-LOADING-KORREKTUR
   Lazy geladene Bilder vergrössern die Seite beim Scrollen und
   verschieben das Ziel. Darum: sofort springen und das Ziel
   nachführen, bis die Bilder geladen sind (oder der Nutzer scrollt).
   ===================================================== */

(function initAnchorJump() {

    function targetFor(link) {
        if (!link.hash || link.hash.length < 2) return null;
        if (link.pathname.replace(/index\.html$/, "") !==
            location.pathname.replace(/index\.html$/, "")) return null;
        return document.getElementById(decodeURIComponent(link.hash.slice(1)));
    }

    function jump(target) {
        const root = document.documentElement;
        const previous = root.style.scrollBehavior;
        root.style.scrollBehavior = "auto";
        target.scrollIntoView({ block: "start" });
        root.style.scrollBehavior = previous;
    }

    document.addEventListener("click", (event) => {

        const link = event.target.closest("a[href*='#']");
        if (!link || event.defaultPrevented || event.button !== 0 ||
            event.metaKey || event.ctrlKey || event.shiftKey) return;

        const target = targetFor(link);
        if (!target) return;

        event.preventDefault();
        history.pushState(null, "", link.hash);

        // Mobiles Menü zuerst schliessen, damit die Header-Höhe stimmt
        const nav = document.querySelector(".nav-links.open");
        const toggle = document.querySelector(".nav-toggle");
        if (nav) {
            nav.classList.remove("open");
            if (toggle) toggle.setAttribute("aria-expanded", "false");
        }

        jump(target);

        let active = true;
        const stop = () => { active = false; };
        ["wheel", "touchstart", "keydown", "mousedown"].forEach((name) =>
            window.addEventListener(name, stop, { once: true, passive: true }));

        const realign = () => { if (active) jump(target); };

        document.querySelectorAll("img[loading='lazy']").forEach((img) => {
            if (!img.complete) img.addEventListener("load", realign, { once: true });
        });

        let ticks = 0;
        const timer = setInterval(() => {
            realign();
            if (!active || ++ticks > 12) clearInterval(timer);
        }, 150);

    });

})();
