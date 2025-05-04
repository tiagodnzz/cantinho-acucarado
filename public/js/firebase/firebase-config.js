// firebase-config.js

// Sua configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBYZr3YV1lFpn7C2G-a-z0h_xdae65vrxQ",
    authDomain: "cantinho-acucarado.firebaseapp.com",
    projectId: "cantinho-acucarado",
    storageBucket: "cantinho-acucarado.firebasestorage.app",
    messagingSenderId: "833210444318",
    appId: "1:833210444318:web:a050afb40d9b2f76621c0f"
};

let app;
let db;

// Inicializa o Firebase e o Firestore
function initializeFirebase() {
    try {
        // Verifica se o Firebase já foi inicializado
        if (firebase.apps.length === 0) {
            app = firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
            console.log("Firebase inicializado com sucesso em firebase-config.js.");
        } else {
            app = firebase.app();
            db = firebase.firestore();
            console.log("Firebase já estava inicializado.");
        }


    } catch (e) {
        console.error("Erro ao inicializar o Firebase em firebase-config.js:", e);
        // Em um cenário real, você provavelmente gostaria de lidar com esse erro de forma mais robusta,
        // talvez exibindo uma mensagem para o usuário.
    }
}

// Garante que o Firebase seja inicializado quando o script for carregado
initializeFirebase();

// Exponha o Firestore para uso em outros scripts
window.db = db;
