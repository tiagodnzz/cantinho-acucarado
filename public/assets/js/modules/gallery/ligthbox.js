
function ajustarAltura() {
    const bigImg = document.getElementById('big-image');
    const smallImgs = document.querySelectorAll('.small-img');
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
        // Em telas pequenas, altura automática para todos
        smallImgs.forEach(img => {
            img.style.height = 'auto';
        });
    } else {
        // Altura igual entre as imagens
        const altura = bigImg.offsetHeight;
        smallImgs.forEach(img => {
            img.style.height = (altura / 2 - 8) + 'px'; // Subtrai o gap
        });
    }
}

window.addEventListener('load', ajustarAltura);
window.addEventListener('resize', ajustarAltura);