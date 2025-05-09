document.addEventListener("DOMContentLoaded", () => {
    // Carrega os componentes da sidebar e navbar
    includeHTML("sidebar-container", "/pages/admin/components/sidebar.html");
    includeHTML("navbar-container", "/pages/admin/components/navbar.html");
});

// Função para carregar os componentes
function includeHTML(containerId, filePath) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Elemento com id '${containerId}' não encontrado.`);
        return;
    }

    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status} - ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            container.innerHTML = data;
            // Chama a função para destacar o item ativo após o carregamento do conteúdo
            if (containerId === "sidebar-container") {
                highlightActiveSidebarItem(); // Só chama essa função após o sidebar ser carregado
            }
        })
        .catch(error => console.error("Erro ao carregar componente:", error));
}

// Função para destacar o item ativo no sidebar
function highlightActiveSidebarItem() {
    const currentPath = window.location.pathname;

    const links = document.querySelectorAll("#sidebar-container a"); // Seleciona os links dentro do sidebar

    links.forEach(link => {
        const href = link.getAttribute("href");
        if (href && currentPath.includes(href)) {
            link.classList.add("active"); // Destaca o item ativo
        } else {
            link.classList.remove("active"); // Remove o destaque dos itens não ativos
        }
    });
}


