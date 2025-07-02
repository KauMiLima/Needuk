document.addEventListener("DOMContentLoaded", function () {
    const btnCriarExp = document.getElementById("criarex");
    const experienciasContainer = document.getElementById(
        "experiencias-container"
    );
    const noExperiencesMessage = document.getElementById(
        "no-experiences-message"
    );

    // Listener para o botão de criar experiência (mantido)
    btnCriarExp.addEventListener("click", function () {
        window.location.href = "newExp.html";
    });

    // Função para formatar a data (mantida)
    function formatDate(mes, ano) {
        if (!mes || !ano) return "Data não informada";
        const meses = [
            "Janeiro",
            "Fevereiro",
            "Março",
            "Abril",
            "Maio",
            "Junho",
            "Julho",
            "Agosto",
            "Setembro",
            "Outubro",
            "Novembro",
            "Dezembro",
        ];
        const mIndex = parseInt(mes, 10) - 1;
        if (mIndex < 0 || mIndex > 11) return "Data inválida";
        return meses[mIndex] + "/" + ano;
    }

    // --- Função para carregar e renderizar as experiências ---
    function carregarExperiencias() {
        const experienciasSalvasJSON = localStorage.getItem("experiencias");
        let experiencias = [];

        if (experienciasSalvasJSON) {
            try {
                experiencias = JSON.parse(experienciasSalvasJSON);
            } catch {
                experiencias = [];
            }
        }

        experienciasContainer.innerHTML = ""; // Limpa o contêiner antes de adicionar

        if (experiencias.length === 0) {
            noExperiencesMessage.style.display = "block";
            return;
        } else {
            noExperiencesMessage.style.display = "none";
        }

        experiencias.forEach((exp, index) => {
            const card = document.createElement("div");
            card.className = "experiencia-card";

            // --- Título clicável ---
            const tituloEl = document.createElement("h3");
            tituloEl.textContent = exp.titulo;
            tituloEl.classList.add("titulo-experiencia"); // Adiciona a classe para o estilo de cursor/hover
            card.appendChild(tituloEl);

            // --- Contêiner para os detalhes (inicialmente oculto) ---
            const detalhesContainer = document.createElement("div");
            detalhesContainer.className = "experiencia-detalhes";

            const tipoEl = document.createElement("p");
            tipoEl.innerHTML = `<span class="detalhe">Tipo:</span> ${exp.tipo}`;
            detalhesContainer.appendChild(tipoEl);

            const periodoEl = document.createElement("p");
            const inicioFormatado = formatDate(exp.mesInicio, exp.anoInicio);
            const terminoFormatado =
                exp.mesTermino && exp.anoTermino
                    ? formatDate(exp.mesTermino, exp.anoTermino)
                    : "Atual";
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

            // --- Adiciona o contêiner para os botões de ação (Editar, Excluir, Gerar PDF) ---
            const actionsContainer = document.createElement("div");
            actionsContainer.className = "experiencia-actions";

            // Adiciona o botão de Editar
            const btnEditar = document.createElement("button");
            btnEditar.textContent = "Editar";
            btnEditar.classList.add("btn-editar");
            btnEditar.dataset.index = index; // Armazena o índice para identificar a experiência
            actionsContainer.appendChild(btnEditar);

            // Adiciona o botão de Excluir
            const btnExcluir = document.createElement("button");
            btnExcluir.textContent = "Excluir";
            btnExcluir.classList.add("btn-excluir");
            btnExcluir.dataset.index = index; // Armazena o índice para identificar a experiência
            actionsContainer.appendChild(btnExcluir);

            // Adiciona o botão de Gerar PDF
            const btnGerarPDF = document.createElement("button");
            btnGerarPDF.textContent = "Gerar PDF";
            btnGerarPDF.classList.add("btn-gerar-pdf");
            actionsContainer.appendChild(btnGerarPDF);

            card.appendChild(actionsContainer); // Adiciona o contêiner de ações ao card

            // --- Lógica para Gerar PDF (mantida) ---
            btnGerarPDF.addEventListener("click", function () {
                const { jsPDF } = window.jspdf; // Obtém a biblioteca jsPDF
                const doc = new jsPDF();

                // Adiciona o conteúdo ao PDF
                doc.text(`Experiência: ${exp.titulo}`, 10, 10);
                doc.text(`Tipo: ${exp.tipo}`, 10, 20);
                doc.text(`Período: ${inicioFormatado} - ${terminoFormatado}`, 10, 30);
                if (exp.cargaHoraria)
                    doc.text(`Carga Horária: ${exp.cargaHoraria} horas`, 10, 40);
                if (exp.habilidades)
                    doc.text(`Habilidades: ${exp.habilidades}`, 10, 50);
                if (exp.descricao) doc.text(`Descrição: ${exp.descricao}`, 10, 60);

                // Salva o PDF
                doc.save(`experiencia_${exp.titulo}.pdf`);
            });

            experienciasContainer.appendChild(card);
        });
    }

    // --- Lógica de clique para expandir/colapsar os detalhes (MANTIDA) ---
    experienciasContainer.addEventListener("click", function (event) {
        const tituloClicado = event.target.closest(".experiencia-card h3");
        if (tituloClicado) {
            const detalhes = tituloClicado.parentNode.querySelector(
                ".experiencia-detalhes"
            );
            if (detalhes) {
                detalhes.classList.toggle("show");
            }
        }
    });

    // --- Lógica de clique para Editar Experiência (Delegation) ---
    experienciasContainer.addEventListener("click", function (event) {
        const btnEditarClicado = event.target.closest(".btn-editar");
        if (btnEditarClicado) {
            const index = parseInt(btnEditarClicado.dataset.index);
            window.location.href = `newExp.html?editIndex=${index}`;
        }
    });

    // --- Lógica de clique para Excluir Experiência (Delegation) ---
    experienciasContainer.addEventListener("click", function (event) {
        const btnExcluirClicado = event.target.closest(".btn-excluir");
        if (btnExcluirClicado) {
            const index = parseInt(btnExcluirClicado.dataset.index);

            // Confirmação antes de excluir
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
                    } catch {
                        experiencias = [];
                    }
                }

                experiencias.splice(index, 1); // Remove a experiência do array
                localStorage.setItem("experiencias", JSON.stringify(experiencias)); // Salva o array atualizado

                carregarExperiencias(); // Recarrega as experiências para atualizar a interface
                alert("Experiência excluída com sucesso!");
            }
        }
    });

    carregarExperiencias();
});