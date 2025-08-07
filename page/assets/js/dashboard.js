document.addEventListener("DOMContentLoaded", function () {
    const btnCriarExp = document.getElementById("criarex");
    const experienciasContainer = document.getElementById("experiencias-container");
    const noExperiencesMessage = document.getElementById("no-experiences-message");
    const userWelcomeMessageElement = document.getElementById("user-welcome-message");

    const API_EXPERIENCIAS_URL = 'https://needuk-6.onrender.com/experiencias';

    // EXIBIR MENSAGEM DE BOAS-VINDAS COM O NOME DO USUÁRIO
    function displayWelcomeMessage() {
        const loggedInUserEmail = localStorage.getItem("loggedInUserEmail");
        const userLogado = JSON.parse(localStorage.getItem("userLogado") || "{}");

        if (userLogado && userLogado.nome) {
            userWelcomeMessageElement.textContent = `Bem Vindo, ${userLogado.nome}!`;
        } else if (loggedInUserEmail) {
            userWelcomeMessageElement.textContent = `Bem Vindo, ${loggedInUserEmail}!`;
        } else {
            userWelcomeMessageElement.textContent = "Olá!";
        }
    }

    btnCriarExp.addEventListener("click", function () {
        window.location.href = "newexp.html";
    });

    // **** MUDANÇA AQUI: Nova função formatDate que recebe YYYY-MM-DD ou mes/ano ****
    function formatDate(dateInput, monthInput, yearInput) { // Agora pode receber 1 ou 3 argumentos
        if (dateInput && typeof dateInput === 'string' && dateInput.includes('-')) {
            // Se for uma string no formato YYYY-MM-DD (dataInicio/dataFim do backend)
            try {
                const date = new Date(dateInput + "T00:00:00"); // Adiciona T00:00:00 para evitar problemas de fuso horário
                const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                               "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
                const mesNome = meses[date.getMonth()];
                const ano = date.getFullYear();
                return `${mesNome}/${ano}`;
            } catch (e) {
                console.error("Erro ao formatar data YYYY-MM-DD:", dateInput, e);
                return "Data inválida";
            }
        } else if (monthInput && yearInput) {
            // Se forem mes e ano separados (mesInicio/anoInicio do formato antigo)
            const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                           "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
            const mIndex = parseInt(monthInput, 10) - 1;
            if (mIndex >= 0 && mIndex <= 11) {
                return `${meses[mIndex]}/${yearInput}`;
            }
            return "Data inválida";
        }
        return "Data não informada";
    }
    // **** FIM DA MUDANÇA ****

    // CARREGAR EXPERIÊNCIAS (COM FETCH DA API)
    async function carregarExperiencias() {
        experienciasContainer.innerHTML = "";
        noExperiencesMessage.style.display = "none";
        noExperiencesMessage.textContent = "Carregando experiências...";

        const token = localStorage.getItem("token");
        if (!token) {
            noExperiencesMessage.textContent = "Você precisa estar logado para ver suas experiências. Redirecionando...";
            noExperiencesMessage.style.display = "block";
            setTimeout(() => {
                window.location.href = "index.html";
            }, 2000);
            return;
        }

        try {
            const response = await fetch(API_EXPERIENCIAS_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao carregar experiências da API.');
            }

            let experiencias = data.experiencias || data;

            if (!Array.isArray(experiencias)) {
                console.error("A API não retornou um array de experiências:", experiencias);
                experiencias = [];
            }

            if (experiencias.length === 0) {
                noExperiencesMessage.textContent = "Você ainda não tem experiências cadastradas.";
                noExperiencesMessage.style.display = "block";
            } else {
                noExperiencesMessage.style.display = "none";
            }

            experiencias.forEach((exp) => {
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

                // **** MUDANÇA AQUI: Chamando formatDate com dataInicio/mesInicio/anoInicio ****
                const inicioFormatado = formatDate(exp.dataInicio, exp.mesInicio, exp.anoInicio);
                const terminoFormatado = (exp.dataFim) ? formatDate(exp.dataFim) :
                                         (exp.mesTermino && exp.anoTermino) ? formatDate(null, exp.mesTermino, exp.anoTermino) : "Atual";
                // **** FIM DA MUDANÇA ****

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
                btnEditar.dataset.id = exp.id;
                actionsContainer.appendChild(btnEditar);

                const btnExcluir = document.createElement("button");
                btnExcluir.textContent = "Excluir";
                btnExcluir.classList.add("btn-excluir");
                btnExcluir.dataset.id = exp.id;
                actionsContainer.appendChild(btnExcluir);

                card.appendChild(actionsContainer);
                experienciasContainer.appendChild(card);
            });
        } catch (error) {
            console.error("Erro ao carregar experiências:", error);
            noExperiencesMessage.textContent = `Erro ao carregar experiências: ${error.message}`;
            noExperiencesMessage.style.display = "block";
        }
    }

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

    experienciasContainer.addEventListener("click", function (event) {
        const btnEditarClicado = event.target.closest(".btn-editar");
        if (btnEditarClicado) {
            const experienciaId = btnEditarClicado.dataset.id;
            window.location.href = `newexp.html?editId=${experienciaId}`;
        }
    });

    experienciasContainer.addEventListener("click", async function (event) {
        const btnExcluirClicado = event.target.closest(".btn-excluir");
        if (btnExcluirClicado) {
            const experienciaId = btnExcluirClicado.dataset.id;
            const token = localStorage.getItem("token");

            if (!token) {
                alert("Você precisa estar logado para excluir experiências.");
                return;
            }

            const cardElement = btnExcluirClicado.closest(".experiencia-card");
            const tituloExperiencia = cardElement ? cardElement.querySelector("h3").textContent : "esta experiência";

            if (confirm(`Tem certeza que deseja excluir "${tituloExperiencia}"?`)) {
                try {
                    const response = await fetch(`${API_EXPERIENCIAS_URL}/${experienciaId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.status === 204) {
                        console.log("Experiência excluída com sucesso (204 No Content).");
                    } else if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || errorData.error || 'Erro ao excluir experiência da API.');
                    } else {
                        const successData = await response.json();
                        console.log("Experiência excluída com sucesso:", successData);
                    }

                    alert("Experiência excluída com sucesso!");
                    carregarExperiencias();
                } catch (error) {
                    console.error("Erro ao excluir experiência:", error);
                    alert(`Não foi possível excluir a experiência: ${error.message}`);
                }
            }
        }
    });

    displayWelcomeMessage();
    carregarExperiencias();
});