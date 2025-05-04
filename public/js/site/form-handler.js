document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("meuFormulario");
    const tipoBtns = document.querySelectorAll("button[data-tipo]");
    const notaContainer = document.getElementById("notaContainer");
    const estrelas = document.querySelectorAll("#avaliacaoEstrelas i");
    const termosCheckbox = document.getElementById("termos");
    const btnConcordar = document.getElementById("concordarBtn");
    const btnEnviar = document.getElementById("btnEnviar");

    const labelMensagem = document.querySelector("label[for='mensagem']");
    const inputMensagem = document.getElementById("mensagem");

    let tipoSelecionado = "mensagem";
    let notaSelecionada = 0;

    function atualizarTipo(tipo) {
        tipoSelecionado = tipo;

        tipoBtns.forEach(btn => {
            btn.classList.toggle("ativo", btn.dataset.tipo === tipo);
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

    tipoBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            atualizarTipo(btn.dataset.tipo);
        });
    });

    function atualizarEstrelas(nota) {
        estrelas.forEach((estrela, index) => {
            estrela.classList.toggle("bi-star-fill", index < nota);
            estrela.classList.toggle("bi-star", index >= nota);
        });
    }

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

    btnConcordar.addEventListener("click", () => {
        termosCheckbox.checked = true;
        const modal = bootstrap.Modal.getInstance(document.getElementById("modalTermos"));
        modal.hide();
    });

    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    btnEnviar.addEventListener("click", async (e) => {
        const nome = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const mensagem = inputMensagem.value.trim();

        if (!nome || !email || !mensagem) {
            showCustomToast("Preencha todos os campos obrigatórios.", "warning");
            return;
        }

        if (!validarEmail(email)) {
            showCustomToast("Digite um email válido.", "warning");
            return;
        }

        if (tipoSelecionado === "avaliacao" && notaSelecionada === 0) {
            showCustomToast("Selecione uma nota para sua avaliação.", "warning");
            return;
        }

        if (!termosCheckbox.checked) {
            showCustomToast("Você precisa aceitar os termos para continuar.", "warning");
            return;
        }

        const dados = {
            nome,
            email,
            mensagem,
            data: new Date()
        };

        if (tipoSelecionado === "avaliacao") {
            dados.nota = notaSelecionada;
        }

        const colecoes = {
            mensagem: "messages",
            avaliacao: "reviews"
        };

        try {
            console.log("Enviando para coleção:", colecoes[tipoSelecionado]);
            console.log("Dados:", dados);

            await db.collection(colecoes[tipoSelecionado]).add(dados);

            showCustomToast("Formulário enviado com sucesso!", "success");

            form.reset();
            termosCheckbox.checked = false;
            notaSelecionada = 0;
            atualizarTipo("mensagem");
            atualizarEstrelas(notaSelecionada);
        } catch (error) {
            console.error("Erro ao enviar:", error);
            showCustomToast("Erro ao enviar!", "danger");
        }
    });
});

// TOAST PERSONALIZADO
function showCustomToast(message, type = "success") {
    const toast = document.getElementById("customToast");
    const toastMessage = document.getElementById("toastMessage");
    const icon = document.getElementById("toastIcon");
    const timerBar = document.getElementById("toastTimer");

    const icons = {
        success: "fa-check-circle",
        warning: "fa-exclamation-triangle",
        danger: "fa-times-circle",
        info: "fa-info-circle"
    };

    const bgColors = {
        success: "#198754",
        warning: "#ffc107",
        danger: "#dc3545",
        info: "#0dcaf0"
    };

    toastMessage.textContent = message;
    toast.style.backgroundColor = bgColors[type] || "#198754";
    icon.className = `toast-icon fa ${icons[type] || icons.success}`;

    timerBar.style.animation = "none";
    void timerBar.offsetWidth;
    timerBar.style.animation = "shrinkTimer 4s linear forwards";

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 4000);
}
