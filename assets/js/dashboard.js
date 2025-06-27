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

        // Usamos forEach com o segundo argumento 'index' para saber a posição da experiência
        experiencias.forEach((exp, index) => { // <-- Adicionado 'index' aqui!
            const card = document.createElement('div');
            card.className = 'experiencia-card';

            // --- Título clicável ---
            const tituloEl = document.createElement('h3');
            tituloEl.textContent = exp.titulo;
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

            // --- Botões de Ação ---
            const actionsContainer = document.createElement('div');
            actionsContainer.className = 'experiencia-actions';

            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.classList.add('btn-editar');
            // Armazena o índice da experiência no botão para uso posterior
            btnEditar.dataset.index = index; 
            actionsContainer.appendChild(btnEditar);

            const btnExcluir = document.createElement('button');
            btnExcluir.textContent = 'Excluir';
            btnExcluir.classList.add('btn-excluir');
            // Armazena o índice da experiência no botão para uso posterior
            btnExcluir.dataset.index = index; 
            actionsContainer.appendChild(btnExcluir);

            card.appendChild(actionsContainer); // Adiciona os botões ao card

            experienciasContainer.appendChild(card);
        });
    }

    // --- Lógica de clique para expandir/colapsar os detalhes (pronto) ---
    experienciasContainer.addEventListener('click', function (event) {
        const tituloClicado = event.target.closest('.experiencia-card h3');
        if (tituloClicado) {
            const detalhes = tituloClicado.parentNode.querySelector('.experiencia-detalhes');
            if (detalhes) {
                detalhes.classList.toggle('show');
            }
        }
    });

    // --- Lógica de clique para Editar Experiência ---
    experienciasContainer.addEventListener('click', function (event) {
        const btnEditarClicado = event.target.closest('.btn-editar');
        if (btnEditarClicado) {
            const index = parseInt(btnEditarClicado.dataset.index);
            // Aqui você pode redirecionar para uma página de edição
            // ou abrir um modal/formulário pré-preenchido.
            // Por enquanto, vamos apenas logar o índice.
            alert(`Você clicou em Editar a experiência de índice: ${index}`);
            console.log("Editar experiência no índice:", index);
            
            // Exemplo: Redirecionar para uma página de edição com o índice na URL
            // window.location.href = `editExp.html?index=${index}`;
        }
    });

    // --- Lógica de clique para Excluir Experiência ---
    experienciasContainer.addEventListener('click', function (event) {
        const btnExcluirClicado = event.target.closest('.btn-excluir');
        if (btnExcluirClicado) {
            const index = parseInt(btnExcluirClicado.dataset.index);

            if (confirm(`Tem certeza que deseja excluir a experiência "${experienciasContainer.children[index].querySelector('h3').textContent}"?`)) {
                let experiencias = [];
                const experienciasSalvasJSON = localStorage.getItem('experiencias');
                if (experienciasSalvasJSON) {
                    try {
                        experiencias = JSON.parse(experienciasSalvasJSON);
                    } catch {
                        experiencias = [];
                    }
                }
                
                // Remove a experiência do array usando o índice
                experiencias.splice(index, 1); 
                
                // Salva o array atualizado no localStorage
                localStorage.setItem('experiencias', JSON.stringify(experiencias));
                
                // Re-renderiza as experiências para atualizar a lista na tela
                carregarExperiencias();
                alert("Experiência excluída com sucesso!");
            }
        }
    });

    // Chama a função para carregar e exibir as experiências quando a página carrega
    carregarExperiencias();
});