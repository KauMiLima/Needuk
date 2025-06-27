// Este é o seu 'profile.js'
document.addEventListener('DOMContentLoaded', function () {
    const userNameSpan = document.getElementById('userName');
    const userEmailSpan = document.getElementById('userEmail');
    const userPhoneSpan = document.getElementById('userPhone');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const viewCurriculumBtn = document.getElementById('viewCurriculumBtn');
    const btnCriarExp = document.getElementById('criarex');

    const experienciasContainer = document.getElementById('experiencias-container');
    const noExperiencesMessage = document.getElementById('no-experiences-message');

    // --- Dados do Usuário ---
    function loadUserData() {
        // Agora, pegamos o objeto 'userLogado' do localStorage
        const userLogadoJSON = localStorage.getItem('userLogado');
        
        if (!userLogadoJSON) {
            // Se não houver usuário logado, redireciona para a página de login
            alert('Nenhum usuário logado. Por favor, faça login.');
            window.location.href = 'signin.html'; // **Confira se este é o caminho correto para sua página de login**
            return;
        }

        let currentUserData;
        try {
            currentUserData = JSON.parse(userLogadoJSON);
        } catch (e) {
            console.error("Erro ao fazer parse dos dados do usuário logado:", e);
            alert('Erro ao carregar dados do usuário. Por favor, faça login novamente.');
            localStorage.removeItem('userLogado'); // Remove dados corrompidos
            localStorage.removeItem('token'); // Remove o token também
            window.location.href = 'signin.html';
            return;
        }

        // Agora usamos os dados de currentUserData
        userNameSpan.textContent = currentUserData.nomeCad || 'Não informado';
        // É crucial que 'emailCad' e 'phoneCad' existam no objeto salvo no localStorage
        // se você espera que eles apareçam aqui. Se não existirem no seu cadastro original,
        // eles continuarão como 'Não informado' ou precisarão de um processo de edição.
        userEmailSpan.textContent = currentUserData.emailCad || 'Não informado'; 
        userPhoneSpan.textContent = currentUserData.phoneCad || 'Não informado'; 
    }

    // --- Função para formatar a data (mantida) ---
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

    // --- Função para carregar e renderizar as experiências (mantida) ---
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
            return;
        } else {
            noExperiencesMessage.style.display = 'none';
        }

        experiencias.forEach((exp, index) => {
            const card = document.createElement('div');
            card.className = 'experiencia-card';

            const tituloEl = document.createElement('h3');
            tituloEl.textContent = exp.titulo;
            card.appendChild(tituloEl);

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

            const actionsContainer = document.createElement('div');
            actionsContainer.className = 'experiencia-actions';

            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.classList.add('btn-editar');
            btnEditar.dataset.index = index; 
            actionsContainer.appendChild(btnEditar);

            const btnExcluir = document.createElement('button');
            btnExcluir.textContent = 'Excluir';
            btnExcluir.classList.add('btn-excluir');
            btnExcluir.dataset.index = index; 
            actionsContainer.appendChild(btnExcluir);

            card.appendChild(actionsContainer);

            experienciasContainer.appendChild(card);
        });
    }

    // --- Listener para o botão "Criar Nova Experiência" ---
    btnCriarExp.addEventListener('click', function () {
        window.location.href = 'newExp.html';
    });

    // --- Lógica de clique para expandir/colapsar os detalhes (delegação) ---
    experienciasContainer.addEventListener('click', function (event) {
        const tituloClicado = event.target.closest('.experiencia-card h3');
        if (tituloClicado) {
            const detalhes = tituloClicado.parentNode.querySelector('.experiencia-detalhes');
            if (detalhes) {
                detalhes.classList.toggle('show');
            }
        }
    });

    // --- Lógica de clique para Editar Experiência (delegação) ---
    experienciasContainer.addEventListener('click', function (event) {
        const btnEditarClicado = event.target.closest('.btn-editar');
        if (btnEditarClicado) {
            const index = parseInt(btnEditarClicado.dataset.index);
            window.location.href = `newExp.html?editIndex=${index}`; 
        }
    });

    // --- Lógica de clique para Excluir Experiência (delegação) ---
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
                
                experiencias.splice(index, 1); 
                localStorage.setItem('experiencias', JSON.stringify(experiencias));
                
                carregarExperiencias();
                alert("Experiência excluída com sucesso!");
            }
        }
    });

    // --- Lógica para o botão "Editar Dados" do Perfil ---
    editProfileBtn.addEventListener('click', function() {
        alert('Aqui você pode redirecionar para uma página de edição de perfil ou abrir um modal para editar os dados pessoais.');
    });

    // --- Lógica para o botão "Ver Currículo" ---
    viewCurriculumBtn.addEventListener('click', function() {
        alert('Aqui você pode gerar e exibir o currículo ou redirecionar para uma página de visualização do currículo.');
    });

    // --- Chamadas iniciais ao carregar a página ---
    loadUserData();
    carregarExperiencias();
});