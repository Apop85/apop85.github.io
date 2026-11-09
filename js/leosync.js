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
