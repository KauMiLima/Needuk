document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("experienciaForm");

    const currentYear = new Date().getFullYear();
    const startYear = 1950;
    const endYear = currentYear + 0; // Isso significa que o ano final é o ano atual. Se quiser incluir anos futuros, ajuste aqui (ex: currentYear + 5)

    const anoInicioSelect = document.getElementById('anoInicio');
    const anoTerminoSelect = document.getElementById('anoTermino');

    function populateYears(selectElement) {
        selectElement.innerHTML = '<option value="">Ano</option>';
        // Popula anos do atual para trás
        for (let year = currentYear; year >= startYear; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            selectElement.appendChild(option);
        }
        // Se 'endYear' for maior que 'currentYear', popula anos futuros
        for (let year = currentYear + 1; year <= endYear; year++) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            selectElement.appendChild(option);
        }
    }

    populateYears(anoInicioSelect);
    populateYears(anoTerminoSelect);

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const titulo = document.getElementById("tituloExperiencia").value.trim();
        const tipo = document.getElementById("tipoExperiencia").value;
        const mesInicio = document.getElementById("mesInicio").value;
        const anoInicio = document.getElementById("anoInicio").value;
        const mesTermino = document.getElementById("mesTermino").value;
        const anoTermino = document.getElementById("anoTermino").value;
        const cargaHorariaStr = document.getElementById("cargaHoraria").value.trim();
        const habilidades = document.getElementById("habilidades").value.trim();
        const descricao = document.getElementById("descricao").value.trim();

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
        if (!mesInicio || !anoInicio) {
            errorMessage += "• A data de início (mês e ano) é obrigatória.\n";
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

        if (mesTermino && anoTermino) {
            const dataInicioObj = new Date(`${anoInicio}-${mesInicio}-01`);
            const dataTerminoObj = new Date(`${anoTermino}-${mesTermino}-01`);

            // Ajusta para o último dia do mês (pronto)
            // Se você quer comparar a data exata do mês de início e término,
            // não precisa ajustar para o último dia do mês.
            // A comparação abaixo `dataTerminoObj < dataInicioObj` já funciona para o primeiro dia do mês.
            // Se precisar de mais precisão (e.g., considerar dia exato), seu formulário precisaria de inputs de dia.
            // Por enquanto, mantenho seu código, que parece querer a comparação do MÊS/ANO
            dataInicioObj.setMonth(dataInicioObj.getMonth() + 1);
            dataInicioObj.setDate(0);

            dataTerminoObj.setMonth(dataTerminoObj.getMonth() + 1);
            dataTerminoObj.setDate(0);


            if (dataTerminoObj < dataInicioObj) {
                alert("A data de término não pode ser anterior à data de início.");
                return;
            }
        }

        const novaExperiencia = {
            titulo,
            tipo,
            mesInicio,
            anoInicio,
            mesTermino,
            anoTermino,
            cargaHoraria: cargaHorariaNum,
            habilidades,
            descricao
        };

        // *** Bloco fetch para API (MANTIDO COMENTADO para uso futuro) ***
        /*
        fetch('SUA_URL_DA_API_AQUI', { // Substitua 'SUA_URL_DA_API_AQUI' pela URL real da sua API
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novaExperiencia), // Envia o objeto novaExperiencia para a API
        })
        .then(res => {
            if (!res.ok) {
                // Tenta ler a resposta de erro do servidor, se houver
                return res.json().then(err => { throw new Error(err.message || 'Erro ao salvar experiência na API.'); });
            }
            return res.json();
        })
        .then(data => {
            // Sucesso na API, tratar resposta (ex: mostrar mensagem de sucesso da API)
            console.log("Experiência salva na API com sucesso:", data);
            alert("Experiência salva com sucesso (via API)!");
            form.reset(); // Reseta o formulário
            window.location.href = "dashboard.html"; // Redireciona para o dashboard
        })
        .catch(err => {
            console.error("Erro ao salvar experiência na API:", err);
            alert("Erro ao salvar experiência: " + err.message); // Mostra o erro da API
        });
        */


        // Código atual usando localStorage (CONTINUA ATIVO)
        let experiencias = [];
        const experienciasSalvasJSON = localStorage.getItem('experiencias');
        if (experienciasSalvasJSON) {
            try {
                experiencias = JSON.parse(experienciasSalvasJSON);
            } catch {
                experiencias = [];
            }
        }

        experiencias.push(novaExperiencia);
        localStorage.setItem('experiencias', JSON.stringify(experiencias));

        alert("Experiência salva com sucesso!"); // Alerta de sucesso antes de redirecionar

        // Redireciona para o dashboard após salvar no localStorage
        window.location.href = "dashboard.html";
    });
});
