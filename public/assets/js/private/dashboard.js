// assets/js/admin/dashboard.js

// Assume que firebase e auth já foram inicializados e estão disponíveis
const authInstance = firebase.auth(); // Pega a instância do auth

const visitsCountElement = document.getElementById('visits-count');
const logoutButton = document.getElementById('logout-button');

// --- Listener do botão de Logout ---
if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        console.log("Botão Sair clicado.");
        // Chama a função de logout do firebase-auth.js
        adminLogout();  // Chama a função global definida em firebase-auth.js
    });
}

// --- Carregar dados do Firebase ---
// Verifica o estado do usuário ANTES de tentar buscar dados protegidos
authInstance.onAuthStateChanged((user) => {
    if (user) {
        console.log("Dashboard: Usuário autenticado, buscando dados...");
        loadAnalyticsData();
    } else {
        console.log("Dashboard: Usuário não autenticado.");
        // O redirecionamento já deve ter ocorrido via firebase-auth.js
    }
});

function loadAnalyticsData() {
    // Exemplo para Realtime Database
    const pageViewsRef = firebase.database().ref('analytics/pageViews/total');
    pageViewsRef.on('value', (snapshot) => {
        const data = snapshot.val();
        console.log("Visitas recebidas:", data);
        if (visitsCountElement) {
            visitsCountElement.textContent = data !== null ? data : '0';
        }
    }, (error) => {
        console.error("Erro ao buscar visitas:", error);
        if (visitsCountElement) visitsCountElement.textContent = 'Erro';
    });
}
