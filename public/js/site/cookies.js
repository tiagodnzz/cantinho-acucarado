document.addEventListener('DOMContentLoaded', function () {
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies-btn');
    const rejectBtn = document.getElementById('reject-cookies-btn');
    const cookieName = 'cookie_consent';

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
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

    const consent = obterCookie(cookieName);

    if (!consent) {
        cookieBanner.style.display = 'block';

        acceptBtn.addEventListener('click', function () {
            setCookie(cookieName, 'accepted', 365);
            cookieBanner.style.display = 'none';
            startAnalyticsWithCookies();
        });

        rejectBtn.addEventListener('click', function () {
            setCookie(cookieName, 'rejected', 30);
            cookieBanner.style.display = 'none';
        });
    } else if (consent === 'accepted') {
        startAnalyticsWithCookies();
    }

    function startAnalyticsWithCookies() {
        console.log('Consentimento de cookies aceito. Iniciando analytics com cookies.');
        currentUserId = obterOuCriarIdUsuarioComCookie();
        inicializarRastreamento();
    }
});