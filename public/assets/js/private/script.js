
// Funções globais para sidebar
window.toggleSidebar = function () {
    const sidebar = document.getElementById("sidebar");
    const mainWrapper = document.getElementById("mainWrapper");

    if (!sidebar || !mainWrapper) return;

    if (window.innerWidth < 768) {
        toggleSidebarMobile();
    } else {
        sidebar.classList.toggle("collapsed");
        mainWrapper.classList.toggle("collapsed");
    }
};

function toggleSidebarMobile(show) {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");

    if (!sidebar || !overlay) return;

    const visible = sidebar.classList.contains("sidebar-mobile-visible");

    if (show === true || (!visible && show === undefined)) {
        sidebar.classList.add("sidebar-mobile-visible");
        overlay.classList.add("active");
    } else {
        sidebar.classList.remove("sidebar-mobile-visible");
        overlay.classList.remove("active");
    }
}

// Fechar sidebar ao redimensionar para desktop
window.addEventListener("resize", () => {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");

    if (!sidebar || !overlay) return;

    if (window.innerWidth >= 768) {
        sidebar.classList.remove("sidebar-mobile-visible");
        overlay.classList.remove("active");
    }
});
