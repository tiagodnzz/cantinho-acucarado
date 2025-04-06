document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("avaliacoesContainer");

    const cores = ["#007bff", "#6f42c1", "#d63384", "#fd7e14", "#20c997", "#198754"];

    try {
        const snapshot = await db.collection("avaliacoes").orderBy("data", "desc").get();

        snapshot.forEach(doc => {
            const { nome, mensagem, nota } = doc.data();

            const iniciais = nome.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
            const cor = cores[Math.floor(Math.random() * cores.length)];

            const estrelasHtml = Array.from({ length: 5 }, (_, i) =>
                `<i class="bi ${i < nota ? "bi-star-fill text-warning" : "bi-star text-muted"} me-1"></i>`
            ).join("");

            const card = `
                <div class="swiper-slide">
                    <div class="card p-3 shadow-sm" style="max-width: 400px;">
                        <div class="d-flex align-items-center mb-2">
                            <div class="avatar-circle" style="background-color: ${cor};">
                                ${iniciais}
                            </div>
                            <div>
                                <h6 class="mb-0">${nome}</h6>
                                <div>${estrelasHtml}</div>
                            </div>
                        </div>
                        <p class="mb-0 text-muted">${mensagem}</p>
                    </div>
                </div>
            `;
            container.innerHTML += card;
        });

        // Inicializa o Swiper após adicionar os cards
        new Swiper(".mySwiper", {
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            slidesPerView: 1,
            spaceBetween: 20,
            breakpoints: {
                768: { slidesPerView: 2 },
                992: { slidesPerView: 3 }
            }
        });

    } catch (error) {
        console.error("Erro ao buscar avaliações:", error);
    }
});
