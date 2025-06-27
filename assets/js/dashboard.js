document.addEventListener('DOMContentLoaded', function () {
    const btnCriarExp = document.getElementById('criarex');
    const experienciasContainer = document.getElementById('experiencias-container');
    const noExperiencesMessage = document.getElementById('no-experiences-message');

    // Listener para o botão de criar experiência (mantido)
    btnCriarExp.addEventListener('click', function () {
        window.location.href = 'newExp.html';
    });

    // Função para formatar a data (mantida)
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

    // --- Função para carregar e renderizar as experiências ---
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

        experienciasContainer.innerHTML = ''; // Limpa o contêiner antes de adicionar

        if (experiencias.length === 0) {
            noExperiencesMessage.style.display = 'block';
            return;
        } else {
            noExperiencesMessage.style.display = 'none';
        }

        experiencias.forEach((exp, index) => { // O 'index' não é mais estritamente necessário aqui, mas não causa problema
            const card = document.createElement('div');
            card.className = 'experiencia-card';

            // --- Título clicável ---
            const tituloEl = document.createElement('h3');
            tituloEl.textContent = exp.titulo;
            tituloEl.classList.add('titulo-experiencia'); // Adiciona a classe para o estilo de cursor/hover
            card.appendChild(tituloEl);

            // --- Contêiner para os detalhes (inicialmente oculto) ---
            const detalhesContainer = document.createElement('div');
            detalhesContainer.className = 'experiencia-detalhes';

            const tipoEl = document.createElement('p');
            tipoEl.innerHTML = `<span class="detalhe">Tipo:</span> ${exp.tipo}`;
            detalhesContainer.appendChild(tipoEl);

            const periodoEl = document.createElement('p');
            const inicioFormatado = formatDate(exp.mesInicio, exp.anoInicio);
            const terminoFormatado = (exp.mesTermino && exp.anoTermino) ? formatDate(exp.mesTermino, exp.anoTermino) : 'Atual';
            periodoEl.innerHTML = `<span class="detalhe">Período:</span> ${inicioFormatado} - ${terminoFormatado}`;
            detalhesContainer.appendChild(periodoEl);

            if (exp.cargaHoraria) {
                const cargaEl = document.createElement('p');
                cargaEl.innerHTML = `<span class="detalhe">Carga horária:</span> ${exp.cargaHoraria} horas`;
                detalhesContainer.appendChild(cargaEl);
            }

            if (exp.habilidades) {
                const habsEl = document.createElement('p');
                habsEl.innerHTML = `<span class="detalhe">Habilidades:</span> ${exp.habilidades}`;
                detalhesContainer.appendChild(habsEl);
            }

            if (exp.descricao) {
                const descEl = document.createElement('p');
                descEl.innerHTML = `<span class="detalhe">Descrição:</span> ${exp.descricao}`;
                detalhesContainer.appendChild(descEl);
            }
            
            card.appendChild(detalhesContainer);

            // --- BOTÕES DE AÇÃO REMOVIDOS ---
            // As linhas que criavam 'actionsContainer', 'btnEditar', 'btnExcluir'
            // e os adicionavam ao card foram removidas aqui.

            experienciasContainer.appendChild(card);
        });
    }

    // --- Lógica de clique para expandir/colapsar os detalhes (MANTIDA) ---
    experienciasContainer.addEventListener('click', function (event) {
        // Usa closest('.experiencia-card h3') para garantir que o clique foi no título
        // ou em um de seus filhos, mas que o elemento de interesse para expandir/colapsar seja o H3.
        const tituloClicado = event.target.closest('.experiencia-card h3');
        if (tituloClicado) {
            // Encontra o contêiner de detalhes DENTRO do mesmo card da experiência.
            // O parentNode do H3 é o '.experiencia-card'.
            // QuerySelector encontra o '.experiencia-detalhes' dentro desse card.
            const detalhes = tituloClicado.parentNode.querySelector('.experiencia-detalhes');
            if (detalhes) {
                detalhes.classList.toggle('show'); // Alterna a classe 'show' para exibir/ocultar
            }
        }
    });

    // --- Lógica de clique para Editar Experiência (REMOVIDA) ---
    // O event listener para '.btn-editar' foi removido.

    // --- Lógica de clique para Excluir Experiência (REMOVIDA) ---
    // O event listener para '.btn-excluir' foi removido.

    // Chama a função para carregar e exibir as experiências quando a página carrega
    carregarExperiencias();
});