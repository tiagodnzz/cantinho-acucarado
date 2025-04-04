document.addEventListener('DOMContentLoaded', function () {
    const botaoWpp = document.createElement('a');
    botaoWpp.href = 'https://wa.me/5599999999999?text=Adorei%20seu%20artigo';
    botaoWpp.className = 'whatsapp-float';
    botaoWpp.target = '_blank';
    botaoWpp.setAttribute('aria-label', 'Fale conosco no WhatsApp');

    botaoWpp.innerHTML = `<i class="fa fa-whatsapp"></i>`;

    document.body.appendChild(botaoWpp);
});
