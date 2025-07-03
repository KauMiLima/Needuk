document.addEventListener("DOMContentLoaded", function () {
    const btnCriarExp = document.getElementById("criarex");
    const experienciasContainer = document.getElementById("experiencias-container");
    const noExperiencesMessage = document.getElementById("no-experiences-message");
    const userWelcomeMessageElement = document.getElementById("user-welcome-message");

    // ✅ EXIBIR MENSAGEM DE BOAS-VINDAS COM O NOME DO USUÁRIO
    function displayWelcomeMessage() {
        const loggedInUserEmail = localStorage.getItem("loggedInUserEmail");
        const listaUser = JSON.parse(localStorage.getItem("listaUser") || "[]");

        const currentUser = listaUser.find(user => user.userCad === loggedInUserEmail);

        if (currentUser && currentUser.nomeCad) {
            userWelcomeMessageElement.textContent = `Bem Vindo, ${currentUser.nomeCad}!`;
        } else {
            userWelcomeMessageElement.textContent = "Olá!";
        }
    }

    // ✅ BOTÃO DE CRIAR EXPERIÊNCIA
    btnCriarExp.addEventListener("click", function () {
        window.location.href = "newExp.html";
    });

    // ✅ FORMATAR DATA
    function formatDate(mes, ano) {
        if (!mes || !ano) return "Data não informada";
        const meses = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
        ];
        const mIndex = parseInt(mes, 10) - 1;
        if (mIndex < 0 || mIndex > 11) return "Data inválida";
        return meses[mIndex] + "/" + ano;
    }

    // ✅ CARREGAR EXPERIÊNCIAS
    function carregarExperiencias() {
        const experienciasSalvasJSON = localStorage.getItem("experiencias");
        let experiencias = [];

        if (experienciasSalvasJSON) {
            try {
                experiencias = JSON.parse(experienciasSalvasJSON);
            } catch (e) {
                console.error("Erro ao fazer parse das experiências salvas:", e);
                experiencias = [];
            }
        }

        experienciasContainer.innerHTML = "";

        if (experiencias.length === 0) {
            noExperiencesMessage.style.display = "block";
        } else {
            noExperiencesMessage.style.display = "none";
        }

        experiencias.forEach((exp, index) => {
            const card = document.createElement("div");
            card.className = "experiencia-card";

            const tituloEl = document.createElement("h3");
            tituloEl.textContent = exp.titulo;
            tituloEl.classList.add("titulo-experiencia");
            card.appendChild(tituloEl);

            const detalhesContainer = document.createElement("div");
            detalhesContainer.className = "experiencia-detalhes";

            const tipoEl = document.createElement("p");
            tipoEl.innerHTML = `<span class="detalhe">Tipo:</span> ${exp.tipo}`;
            detalhesContainer.appendChild(tipoEl);

            const inicioFormatado = formatDate(exp.mesInicio, exp.anoInicio);
            const terminoFormatado =
                exp.mesTermino && exp.anoTermino
                    ? formatDate(exp.mesTermino, exp.anoTermino)
                    : "Atual";

            const periodoEl = document.createElement("p");
            periodoEl.innerHTML = `<span class="detalhe">Período:</span> ${inicioFormatado} - ${terminoFormatado}`;
            detalhesContainer.appendChild(periodoEl);

            if (exp.cargaHoraria) {
                const cargaEl = document.createElement("p");
                cargaEl.innerHTML = `<span class="detalhe">Carga horária:</span> ${exp.cargaHoraria} horas`;
                detalhesContainer.appendChild(cargaEl);
            }

            if (exp.habilidades) {
                const habsEl = document.createElement("p");
                habsEl.innerHTML = `<span class="detalhe">Habilidades:</span> ${exp.habilidades}`;
                detalhesContainer.appendChild(habsEl);
            }

            if (exp.descricao) {
                const descEl = document.createElement("p");
                descEl.innerHTML = `<span class="detalhe">Descrição:</span> ${exp.descricao}`;
                detalhesContainer.appendChild(descEl);
            }

            card.appendChild(detalhesContainer);

            const actionsContainer = document.createElement("div");
            actionsContainer.className = "experiencia-actions";

            const btnEditar = document.createElement("button");
            btnEditar.textContent = "Editar";
            btnEditar.classList.add("btn-editar");
            btnEditar.dataset.index = index;
            actionsContainer.appendChild(btnEditar);

            const btnExcluir = document.createElement("button");
            btnExcluir.textContent = "Excluir";
            btnExcluir.classList.add("btn-excluir");
            btnExcluir.dataset.index = index;
            actionsContainer.appendChild(btnExcluir);

            const btnGerarPDF = document.createElement("button");
            btnGerarPDF.textContent = "Gerar PDF";
            btnGerarPDF.classList.add("btn-gerar-pdf");
            actionsContainer.appendChild(btnGerarPDF);

            card.appendChild(actionsContainer);

            btnGerarPDF.addEventListener("click", function () {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();

                doc.text(`Experiência: ${exp.titulo}`, 10, 10);
                doc.text(`Tipo: ${exp.tipo}`, 10, 20);
                doc.text(`Período: ${inicioFormatado} - ${terminoFormatado}`, 10, 30);
                if (exp.cargaHoraria)
                    doc.text(`Carga Horária: ${exp.cargaHoraria} horas`, 10, 40);
                if (exp.habilidades)
                    doc.text(`Habilidades: ${exp.habilidades}`, 10, 50);
                if (exp.descricao)
                    doc.text(`Descrição: ${exp.descricao}`, 10, 60);

                doc.save(`experiencia_${exp.titulo}.pdf`);
            });

            experienciasContainer.appendChild(card);
        });
    }

    // ✅ MOSTRAR/ESCONDER DETALHES
    experienciasContainer.addEventListener("click", function (event) {
        const tituloClicado = event.target.closest(".experiencia-card h3");
        if (tituloClicado) {
            const detalhes = tituloClicado.parentNode.querySelector(".experiencia-detalhes");
            if (detalhes) {
                detalhes.classList.toggle("show");
            }
        }
    });

    // ✅ EDITAR EXPERIÊNCIA
    experienciasContainer.addEventListener("click", function (event) {
        const btnEditarClicado = event.target.closest(".btn-editar");
        if (btnEditarClicado) {
            const index = parseInt(btnEditarClicado.dataset.index);
            window.location.href = `newExp.html?editIndex=${index}`;
        }
    });

    // ✅ EXCLUIR EXPERIÊNCIA
    experienciasContainer.addEventListener("click", function (event) {
        const btnExcluirClicado = event.target.closest(".btn-excluir");
        if (btnExcluirClicado) {
            const index = parseInt(btnExcluirClicado.dataset.index);

            if (
                confirm(
                    `Tem certeza que deseja excluir a experiência "${experienciasContainer.children[index].querySelector("h3").textContent}"?`
                )
            ) {
                let experiencias = [];
                const experienciasSalvasJSON = localStorage.getItem("experiencias");
                if (experienciasSalvasJSON) {
                    try {
                        experiencias = JSON.parse(experienciasSalvasJSON);
                    } catch (e) {
                        console.error("Erro ao fazer parse das experiências salvas ao excluir:", e);
                        experiencias = [];
                    }
                }

                experiencias.splice(index, 1);
                localStorage.setItem("experiencias", JSON.stringify(experiencias));

                carregarExperiencias();
                alert("Experiência excluída com sucesso!");
            }
        }
    });

    // ✅ CHAMAR FUNÇÕES INICIAIS
    displayWelcomeMessage();
    carregarExperiencias();
});
