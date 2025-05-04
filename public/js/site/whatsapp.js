document.addEventListener('DOMContentLoaded', function () {
    const botaoWpp = document.createElement('a');
    botaoWpp.href = 'https://wa.me/5518997675264?text=Ola,%20vim%20pelo%20site%20Cantinho%20Açucarado%20e%20gostaria%20de%20mais%20informacoes.';
    botaoWpp.className = 'whatsapp-float';
    botaoWpp.target = '_blank';
    botaoWpp.setAttribute('aria-label', 'Fale conosco no WhatsApp');
    botaoWpp.id = 'whatsapp-float-btn';
    botaoWpp.innerHTML = `<i class="fa-brands fa-whatsapp"></i>`;
    document.body.appendChild(botaoWpp);
    console.log('Botão WhatsApp criado e adicionado ao body com ID:', botaoWpp.id);

    runClickTrackerForWhatsapp();
});

function runClickTrackerForWhatsapp() {
    const element = document.getElementById('whatsapp-float-btn');
    if (element) {
        element.addEventListener('click', () => {
            console.log(`Clique detectado no botão WhatsApp. Registrando evento: whatsappFloatClicks`);
            if (typeof trackEvent === 'function') {
                trackEvent('click', { elementId: 'whatsapp-float-btn', metricName: 'whatsappFloatClicks' });
            } else {
                console.error("Erro: trackEvent não está definida. O evento de clique do WhatsApp não foi registrado.");
            }
        });
        console.log(`Tracker de clique configurado para: #whatsapp-float-btn -> whatsappFloatClicks`);
    } else {
        console.log(`Elemento #whatsapp-float-btn não encontrado (isso não deveria acontecer aqui).`);
    }
}