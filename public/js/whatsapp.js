document.addEventListener('DOMContentLoaded', function () {
    const botaoWpp = document.createElement('a');
    botaoWpp.href = 'https://wa.me/5518997675264?text=Ola,%20vim%20pelo%20site%20Cantinho%20Açucarado%20e%20gostaria%20de%20mais%20informacoes.';
    botaoWpp.className = 'whatsapp-float';
    botaoWpp.target = '_blank';
    botaoWpp.setAttribute('aria-label', 'Fale conosco no WhatsApp');

    botaoWpp.innerHTML = `<i class="fa-brands fa-whatsapp"></i>`;

    document.body.appendChild(botaoWpp);
});
