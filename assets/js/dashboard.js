document.addEventListener('DOMContentLoaded', function () {
    const btnCriarExp = document.getElementById('criarex');

    btnCriarExp.addEventListener('click', function () {
        window.location.href = 'newExp.html';
    });

    const experienciasContainer = document.getElementById('experiencias-container');
    const noExperiencesMessage = document.getElementById('no-experiences-message');

    function formatDate(mes, ano) {
        if (!mes || !ano) return 'Data não informada';
        const meses = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        const mIndex = parseInt(mes, 10) - 1;
        if (mIndex < 0 || mIndex > 11) return 'Data inválida';
        return meses[mIndex] + '/' + ano;
    }

    function carregarExperiencias() {
        const experienciasSalvasJSON = localStorage.getItem('experiencias');
        let experiencias = [];

        if (experienciasSalvasJSON) {
            try {
                experiencias = JSON.parse(experienciasSalvasJSON);
            } catch {
                experiencias = [];
            }
        }

        experienciasContainer.innerHTML = '';

        if (experiencias.length === 0) {
            noExperiencesMessage.style.display = 'block';
            experienciasContainer.appendChild(noExperiencesMessage);
            return;
        } else {
            noExperiencesMessage.style.display = 'none';
        }

        experiencias.forEach(exp => {
            const card = document.createElement('div');
            card.className = 'experiencia-card';

            const tituloEl = document.createElement('h3');
            tituloEl.textContent = exp.titulo;
            card.appendChild(tituloEl);

            const tipoEl = document.createElement('p');
            tipoEl.innerHTML = `<span class="detalhe">Tipo:</span> ${exp.tipo}`;
            card.appendChild(tipoEl);

            const periodoEl = document.createElement('p');
            const inicioFormatado = formatDate(exp.mesInicio, exp.anoInicio);
            const terminoFormatado = (exp.mesTermino && exp.anoTermino) ? formatDate(exp.mesTermino, exp.anoTermino) : 'Atual';
            periodoEl.innerHTML = `<span class="detalhe">Período:</span> ${inicioFormatado} - ${terminoFormatado}`;
            card.appendChild(periodoEl);

            if (exp.cargaHoraria) {
                const cargaEl = document.createElement('p');
                cargaEl.innerHTML = `<span class="detalhe">Carga horária:</span> ${exp.cargaHoraria} horas`;
                card.appendChild(cargaEl);
            }

            if (exp.habilidades) {
                const habsEl = document.createElement('p');
                habsEl.innerHTML = `<span class="detalhe">Habilidades:</span> ${exp.habilidades}`;
                card.appendChild(habsEl);
            }

            if (exp.descricao) {
                const descEl = document.createElement('p');
                descEl.innerHTML = `<span class="detalhe">Descrição:</span> ${exp.descricao}`;
                card.appendChild(descEl);
            }

            experienciasContainer.appendChild(card);
        });
    }

    carregarExperiencias();
});
