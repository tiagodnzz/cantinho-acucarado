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
        el: ".swiper-pagination",
        clickable: true,
    },
    slidesPerView: 2,
    spaceBetween: 20,
    breakpoints: {
        768: { slidesPerView: 2 },   // tablets
        992: { slidesPerView: 2 },   // laptops médios
        1200: { slidesPerView: 1 }   // desktops grandes
    }
});