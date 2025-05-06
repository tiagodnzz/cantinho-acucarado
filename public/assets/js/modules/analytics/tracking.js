function gerarUUIDFallback() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function gerarIdUnico() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
        return window.crypto.randomUUID();
    } else {
        console.warn("crypto.randomUUID() não suportado. Usando fallback.");
        return gerarUUIDFallback();
    }
}

function obterCookie(nome) {
    const nomeEQ = nome + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nomeEQ) === 0) return c.substring(nomeEQ.length, c.length);
    }
    return null;
}

function definirCookie(nome, valor, dias) {
    let expires = "";
    if (dias) {
        const date = new Date();
        date.setTime(date.getTime() + (dias * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = nome + "=" + valor + expires + "; path=/";
}

function obterOuCriarIdUsuarioComCookie() {
    let userId = obterCookie('user_id');
    if (!userId) {
        userId = gerarIdUnico();
        definirCookie('user_id', userId, 365);
    }
    return userId;
}

let currentUserId = null;
console.log("Script de Rastreamento de Analytics Inicializado.");

let trackEvent;

function inicializarRastreamento() {
    try {
        if (typeof firebase === 'undefined' || typeof firebase.firestore !== 'function') {
            throw new Error("Firebase Firestore não carregado.");
        }

        console.log("Firebase Firestore carregado, inicializando Firestore...");

        trackEvent = function (eventType, eventDetails = {}) {
            if (!currentUserId) {
                console.error("Erro: currentUserId não está definido. Evento não registrado.");
                return;
            }
            const eventData = {
                userId: currentUserId,
                type: eventType,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                ...eventDetails
            };
            window.db.collection("analytics").add(eventData)
                .then(() => console.log(`Evento [${eventType}] registrado para o usuário ${currentUserId}.`))
                .catch(error => console.error(`Erro ao registrar evento:`, error));
        };

        console.log("trackEvent definida, chamando runTracking...");
        runTracking();
    } catch (error) {
        console.error("Erro ao inicializar o rastreamento:", error);
        setTimeout(inicializarRastreamento, 100);
    }
}

function runTracking() {
    console.log("runTracking chamada...");

    function trackPageView() {
        console.log("Registrando Page View como evento...");
        trackEvent('pageView', { url: window.location.pathname });
    }

    function setupClickTracker(elementId, metricName) {
        const element = document.getElementById(elementId);

        if (element) {
            element.addEventListener('click', () => {
                console.log(`Clique detectado em #${elementId}. Registrando evento: ${metricName}`);
                trackEvent('click', { elementId: elementId, metricName: metricName });
            });
            console.log(`Tracker de clique configurado para: #${elementId} -> ${metricName}`);
        } else {
            console.log(`Elemento #${elementId} não encontrado nesta página. Tracker de clique não adicionado.`);
        }
    }

    if (typeof trackEvent === 'function') {
        trackPageView();
        setupClickTracker('btnEnviar', 'mainContactClicks');
    } else {
        console.warn("trackEvent não está definido. Funções de rastreamento não executadas.");
    }
}
