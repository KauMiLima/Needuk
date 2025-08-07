document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("experienciaForm");
    const tituloExperiencia = document.getElementById("tituloExperiencia");
    const tipoExperiencia = document.getElementById("tipoExperiencia");
    const dataInicioInput = document.getElementById("dataInicio");
    const dataTerminoInput = document.getElementById("dataTermino");
    const cargaHorariaInput = document.getElementById("cargaHoraria");
    const habilidadesInput = document.getElementById("habilidades");
    const descricaoInput = document.getElementById("descricao");
    const tituloPagina = document.getElementById("tituloPagina");

    const API_EXPERIENCIAS_URL = 'https://needuk-6.onrender.com/experiencias';

    let experienciaIdParaEdicao = null;

    async function carregarExperienciaParaEdicao(id) {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Você precisa estar logado para editar experiências. Redirecionando...");
            window.location.href = "index.html";
            return;
        }

        try {
            const response = await fetch(`${API_EXPERIENCIAS_URL}/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            // CORREÇÃO: Verificação do tipo de conteúdo antes de analisar como JSON
            const contentType = response.headers.get("content-type");
            let data;
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                const text = await response.text();
                throw new Error(text || 'Resposta não é um JSON válido');
            }

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao carregar dados da experiência para edição.');
            }

            tituloExperiencia.value = data.titulo || '';
            tipoExperiencia.value = data.tipo || '';
            dataInicioInput.value = data.dataInicio || '';
            dataTerminoInput.value = data.dataFim || '';
            cargaHorariaInput.value = data.cargaHoraria || '';
            habilidadesInput.value = data.habilidades || '';
            descricaoInput.value = data.descricao || '';

            tituloPagina.textContent = "Editar Experiência";
            experienciaIdParaEdicao = id;
        } catch (error) {
            console.error("Erro ao carregar experiência para edição:", error);
            alert(`Não foi possível carregar a experiência para edição: ${error.message}`);
            window.location.href = "dashboard.html";
        }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('editId');
    if (editId) {
        carregarExperienciaParaEdicao(editId);
    } else {
        tituloPagina.textContent = "Criar Nova Experiência";
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const titulo = tituloExperiencia.value.trim();
        const tipo = tipoExperiencia.value;
        const dataInicio = dataInicioInput.value;
        const dataTermino = dataTerminoInput.value;
        const cargaHorariaStr = cargaHorariaInput.value.trim();
        const habilidades = habilidadesInput.value.trim();
        const descricao = descricaoInput.value.trim();

        let isValid = true;
        let errorMessage = "Por favor, corrija os seguintes erros:\n";

        if (!titulo) {
            errorMessage += "• O título da experiência é obrigatório.\n";
            isValid = false;
        }
        if (!tipo) {
            errorMessage += "• O tipo de experiência é obrigatório.\n";
            isValid = false;
        }
        if (!dataInicio) {
            errorMessage += "• A data de início é obrigatória.\n";
            isValid = false;
        }

        if (!isValid) {
            alert(errorMessage);
            return;
        }

        let cargaHorariaNum = null;
        if (cargaHorariaStr !== "") {
            cargaHorariaNum = parseInt(cargaHorariaStr);
            if (isNaN(cargaHorariaNum) || cargaHorariaNum <= 0) {
                alert("A carga horária, se informada, deve ser um número inteiro positivo.");
                return;
            }
        }

        if (dataInicio && dataTermino) {
            const inicioObj = new Date(dataInicio);
            const terminoObj = new Date(dataTermino);

            if (terminoObj < inicioObj) {
                alert("A data de término não pode ser anterior à data de início.");
                return;
            }
        }

        const experienciaData = {
            titulo,
            tipo,
            dataInicio,
            dataFim: dataTermino || null,
            cargaHoraria: cargaHorariaNum,
            habilidades,
            descricao
        };

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Você não está autenticado. Por favor, faça login novamente.");
            window.location.href = "index.html";
            return;
        }

        let method = 'POST';
        let url = API_EXPERIENCIAS_URL;

        if (experienciaIdParaEdicao) {
            method = 'PUT';
            url = `${API_EXPERIENCIAS_URL}/${experienciaIdParaEdicao}`;
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(experienciaData),
            });

            // CORREÇÃO: Verificação do tipo de conteúdo antes de analisar como JSON
            const contentType = response.headers.get("content-type");
            let data;
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                const text = await response.text();
                data = { message: text || `Erro desconhecido. Status: ${response.status}` };
            }

            if (!response.ok) {
                throw new Error(data.message || data.error || `Erro ao ${experienciaIdParaEdicao ? 'atualizar' : 'criar'} experiência.`);
            }

            alert(`Experiência ${experienciaIdParaEdicao ? 'atualizada' : 'criada'} com sucesso!`);
            form.reset();
            window.location.href = "dashboard.html";
        } catch (error) {
            console.error("Erro na operação da API:", error);
            alert(`Erro ao ${experienciaIdParaEdicao ? 'atualizar' : 'criar'} experiência: ` + error.message);
        }
    });
});