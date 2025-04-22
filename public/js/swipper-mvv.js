// Inicializa o Swiper MVV
var swiperMvv = new Swiper('.swiper-mvv', {
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    slidesPerView: 1,
    spaceBetween: 30,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    breakpoints: {
        // quando a largura da janela é >= 768px
        768: {
            slidesPerView: 3,
            spaceBetween: 20
        }
    }
});