const firebaseConfig = {
    apiKey: "AIzaSyBYZr3YV1lFpn7C2G-a-z0h_xdae65vrxQ",
    authDomain: "cantinho-acucarado.firebaseapp.com",
    projectId: "cantinho-acucarado",
    storageBucket: "cantinho-acucarado.firebasestorage.app",
    messagingSenderId: "833210444318",
    appId: "1:833210444318:web:a050afb40d9b2f76621c0f"
};

// Inicializa Firebase e exporta o banco
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
