const sidebar = document.getElementById("sidebar");
const mainWrapper = document.getElementById("mainWrapper");
const overlay = document.getElementById("overlay");

function toggleSidebar() {
    if (window.innerWidth < 768) {
        toggleSidebarMobile();
    } else {
        sidebar.classList.toggle("collapsed");
        mainWrapper.classList.toggle("collapsed");
    }
}

function toggleSidebarMobile(show) {
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
    if (window.innerWidth >= 768) {
        sidebar.classList.remove("sidebar-mobile-visible");
        overlay.classList.remove("active");
    }
});