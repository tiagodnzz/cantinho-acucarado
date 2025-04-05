document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("meuFormulario");
    const tipoBtns = document.querySelectorAll("button[data-tipo]");
    const notaContainer = document.getElementById("notaContainer");
    const estrelas = document.querySelectorAll("#avaliacaoEstrelas i");
    const termosCheckbox = document.getElementById("termos");
    const btnConcordar = document.getElementById("concordarBtn");

    const labelMensagem = document.querySelector("label[for='mensagem']");
    const inputMensagem = document.getElementById("mensagem");

    let tipoSelecionado = "mensagem"; // padrão
    let notaSelecionada = 0; // começa sem nenhuma estrela

    // Atualiza o tipo do formulário
    function atualizarTipo(tipo) {
        tipoSelecionado = tipo;

        tipoBtns.forEach(btn => {
            btn.classList.toggle("active", btn.dataset.tipo === tipo);
        });

        if (tipo === "avaliacao") {
            notaContainer.classList.remove("d-none");
            labelMensagem.innerText = "Avaliação";
        } else {
            notaContainer.classList.add("d-none");
            labelMensagem.innerText = "Mensagem";
        }

        atualizarEstrelas(notaSelecionada);
    }

    // Clique nos botões "Mensagem" / "Avaliação"
    tipoBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            atualizarTipo(btn.dataset.tipo);
        });
    });

    // Atualiza visual das estrelas
    function atualizarEstrelas(nota) {
        estrelas.forEach((estrela, index) => {
            estrela.classList.toggle("bi-star-fill", index < nota);
            estrela.classList.toggle("bi-star", index >= nota);
        });
    }

    // Estrelas: clique e hover
    estrelas.forEach((estrela, index) => {
        estrela.addEventListener("click", () => {
            notaSelecionada = index + 1;
            atualizarEstrelas(notaSelecionada);
        });

        estrela.addEventListener("mouseenter", () => {
            atualizarEstrelas(index + 1);
        });

        estrela.addEventListener("mouseleave", () => {
            atualizarEstrelas(notaSelecionada);
        });
    });

    // Concordar com termos (ativa checkbox)
    btnConcordar.addEventListener("click", () => {
        termosCheckbox.checked = true;
        const modal = bootstrap.Modal.getInstance(document.getElementById("modalTermos"));
        modal.hide();
    });

    // Envio do formulário
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nome = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const mensagem = inputMensagem.value.trim();

        if (!nome || !email || !mensagem) {
            showToast("Preencha todos os campos!", "warning");
            return;
        }

        if (!termosCheckbox.checked) {
            showToast("Você precisa concordar com os termos para enviar.", "warning");
            return;
        }

        if (tipoSelecionado === "avaliacao" && notaSelecionada === 0) {
            showToast("Selecione uma nota de 1 a 5 estrelas.", "warning");
            return;
        }

        const dados = {
            nome,
            email,
            data: new Date()
        };

        if (tipoSelecionado === "avaliacao") {
            dados.avaliacao = mensagem;
            dados.nota = notaSelecionada;
        } else {
            dados.mensagem = mensagem;
        }

        try {
            await db.collection(tipoSelecionado + "s").add(dados);
            showToast("Formulário enviado com sucesso!", "success");
            form.reset();
            termosCheckbox.checked = false;
            notaSelecionada = 0;
            atualizarTipo("mensagem");
            atualizarEstrelas(notaSelecionada);
        } catch (error) {
            console.error("Erro ao enviar:", error);
            showToast("Erro ao enviar. Tente novamente.", "danger");
        }
    });
});

// Função de exibição do Toast
function showToast(mensagem, tipo = "success") {
    const toastEl = document.getElementById("formToast");
    const toastBody = document.getElementById("formToastBody");

    toastBody.innerText = mensagem;
    toastEl.className = `toast align-items-center text-bg-${tipo} border-0 position-fixed top-0 end-0 m-3`;

    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}
