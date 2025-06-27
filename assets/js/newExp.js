document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("experienciaForm");

    const currentYear = new Date().getFullYear();
    const startYear = 1950;
    const endYear = currentYear + 0;

    const anoInicioSelect = document.getElementById('anoInicio');
    const anoTerminoSelect = document.getElementById('anoTermino');

    function populateYears(selectElement) {
        selectElement.innerHTML = '<option value="">Ano</option>';
        for (let year = currentYear; year >= startYear; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            selectElement.appendChild(option);
        }
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

            // Ajusta para o último dia do mês{pronto}
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
        
  //  substituir este bloco localStorage pelo fetch para API{em andamento}
  /*
  fetch('', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome: nome.value,
      usuario: usuario.value,
      senha: senha.value
    }),
  })
  .then(res => {
    if (!res.ok) throw new Error('Erro ao cadastrar');
    return res.json();
  })
  .then(data => {
    // Sucesso, tratar resposta da API
  })
  .catch(err => {
    msgError.textContent = err.message;
  });
  */


        // Código atual usando localStorage{local sotage}
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

        alert("Experiência salva com sucesso!");
        form.reset();

        // Se quiser redirecionar direto:
        // window.location.href = "dashboard.html";
    });
});
