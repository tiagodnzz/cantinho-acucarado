// assets/js/firebase/firebase-auth.js

// Assumindo que firebase-config.js já inicializou o Firebase (firebase.initializeApp(firebaseConfig);)
const auth = firebase.auth();

const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message');

// --- Lógica de Login ---
if (loginForm) { // Executa apenas se o formulário existir na página atual (login.html)
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailInput.value;
        const password = passwordInput.value;

        // Verifica se o elemento de erro existe antes de tentar alterá-lo
        if (errorMessage) {
            errorMessage.textContent = ''; // Limpa a mensagem de erro antes de tentar um novo login
        }

        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                console.log('Login OK:', userCredential.user);
                // Redireciona para o dashboard na raiz
                window.location.href = '/dashboard';
            })
            .catch((error) => {
                console.error('Erro no login:', error);
                // Só tenta modificar o errorMessage se o elemento existir
                if (errorMessage) {
                    errorMessage.textContent = 'E-mail ou senha inválidos.';
                }
            });
    });
}

// --- Verificação de Estado de Autenticação (Executa em todas as páginas que incluem este script) ---
auth.onAuthStateChanged((user) => {
    const currentPage = window.location.pathname.split('/').pop();
    // Ajuste os nomes dos arquivos conforme os seus HTMLs na raiz
    const isLoginPage = currentPage === 'login';
    const isDashboardPage = currentPage === 'dashboard';
    const isAdminPage = isLoginPage || isDashboardPage; // Adicione outras páginas admin se houver

    console.log(`Auth state: user=${user ? user.uid : null}, page=${currentPage}, isAdmin=${isAdminPage}`);

    if (user) {
        // Usuário LOGADO
        // Se estiver na página de login -> vai pro dashboard
        if (isLoginPage) {
            console.log("Logado, redirecionando do login para o dashboard...");
            window.location.href = '/dashboard';
        }
    } else {
        // Usuário NÃO LOGADO
        // Se estiver em alguma página admin protegida (dashboard) -> vai pro login
        if (isDashboardPage) { // Adicione outras páginas protegidas aqui com ||
            console.log("Não logado, redirecionando do dashboard para o login...");
            window.location.href = '/login';
        }
    }
});

// --- Função de Logout (será chamada pelo botão em dashboard.html) ---
function adminLogout() { // Renomeando para evitar conflitos potenciais
    auth.signOut()
        .then(() => {
            console.log('Logout bem-sucedido.');
            // Após o logout, o estado do usuário será null, e o onAuthStateChanged será chamado
            // O que vai redirecionar para a página de login
            window.location.href = '/login'; // Redireciona explicitamente para login
        })
        .catch((error) => {
            console.error('Erro no logout:', error);
        });
}
