document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("avaliacoesContainer");

    const cores = ["#007bff", "#6f42c1", "#d63384", "#fd7e14", "#20c997", "#198754"];

    try {
        const snapshot = await db.collection("reviews")
            .where("status", "==", "approved") // Adicionando a condição para status "approved"
            .orderBy("data", "desc")
            .get();

        let avaliacoesHtml = ''; // Acumula o HTML das avaliações

        snapshot.forEach(doc => {
            const { nome, mensagem, nota } = doc.data();

            const iniciais = nome.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
            const cor = cores[Math.floor(Math.random() * cores.length)];

            const estrelasHtml = Array.from({ length: 5 }, (_, i) =>
                `<i class="bi ${i < nota ? "bi-star-fill text-warning" : "bi-star text-muted"} me-1"></i>`
            ).join("");

            const card = `
                <div class="swiper-slide">
                    <div class="card border-0 p-3 d-flex flex-column h-100 text-center" style="max-width: 400px;">
                        <div class="avatar-circle mx-auto mb-2" style="background-color: ${cor}; width: 50px; height: 50px; font-size: 1.2rem;">
                        ${iniciais}
                        </div>

                        <div class="mb-2">
                        ${estrelasHtml}
                        </div>
                        <p class="fst-italic flex-grow-1 mb-3">"${mensagem}"</p>
                        <h6 class="fw-bold mb-0">${nome}</h6>

                    </div>
                </div>
            `;
            avaliacoesHtml += card; // Adiciona o card ao HTML acumulado
        });

        container.innerHTML = avaliacoesHtml; // Define o innerHTML do container após o loop

        // Inicializa o Swiper APENAS se houver avaliações
        if (snapshot.size > 0) {
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
                    768: { slidesPerView: 3 },   // tablets
                    992: { slidesPerView: 3 },   // laptops médios
                    1200: { slidesPerView: 4 }   // desktops grandes
                }
            });
        } else {
            // Opcional: Mostrar uma mensagem caso não haja avaliações aprovadas
            container.innerHTML = '<p class="text-muted text-center">Nenhuma avaliação no momento.</p>';
        }

    } catch (error) {
        console.error("Erro ao buscar avaliações:", error);
        container.innerHTML = '<p class="text-danger text-center">Erro ao carregar as avaliações.</p>';
    }
});