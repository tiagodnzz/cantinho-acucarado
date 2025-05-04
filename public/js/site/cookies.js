document.addEventListener('DOMContentLoaded', function () {
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieOverlay = document.getElementById('cookie-overlay');
    const acceptBtn = document.getElementById('accept-cookies-btn');
    const rejectBtn = document.getElementById('reject-cookies-btn');
    const cookieName = 'cookie_consent';

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
        }
        return null;
    }

    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    const consent = getCookie(cookieName);

    if (!consent) {
        cookieBanner.style.display = 'block';
        cookieOverlay.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Bloqueia scroll

        acceptBtn.addEventListener('click', function () {
            setCookie(cookieName, 'accepted', 365);
            cookieBanner.style.display = 'none';
            cookieOverlay.style.display = 'none';
            document.body.style.overflow = ''; // Libera scroll
            startAnalyticsWithCookies();
        });

        rejectBtn.addEventListener('click', function () {
            setCookie(cookieName, 'rejected', 30);
            cookieBanner.style.display = 'none';
            cookieOverlay.style.display = 'none';
            document.body.style.overflow = ''; // Libera scroll
        });
    } else if (consent === 'accepted') {
        startAnalyticsWithCookies();
    }

    function startAnalyticsWithCookies() {
        console.log('Consentimento de cookies aceito. Iniciando analytics com cookies.');
        currentUserId = obterOuCriarIdUsuarioComCookie(); // defina essa função no seu código
        inicializarRastreamento(); // defina essa função no seu código
    }
});
