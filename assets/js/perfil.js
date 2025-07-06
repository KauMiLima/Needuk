// Este é o seu 'profile.js'
document.addEventListener('DOMContentLoaded', function () {
    const userNameSpan = document.getElementById('userName');
    const userEmailSpan = document.getElementById('userEmail');
    const userPhoneSpan = document.getElementById('userPhone');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const viewCurriculumBtn = document.getElementById('viewCurriculumBtn'); // Este será o botão para gerar o PDF do currículo
    const btnCriarExp = document.getElementById('criarex');

    const experienciasContainer = document.getElementById('experiencias-container');
    const noExperiencesMessage = document.getElementById('no-experiences-message');

    // --- Dados do Usuário ---
    function loadUserData() {
        const userLogadoJSON = localStorage.getItem('userLogado');

        if (!userLogadoJSON) {
            alert('Nenhum usuário logado. Por favor, faça login.');
            window.location.href = 'index.html'; // **Confira se este é o caminho correto para sua página de login**
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
            window.location.href = 'index.html';
            return;
        }

        // --- CORREÇÃO AQUI ---
        // As propriedades corretas salvas no localStorage são: nomeCad, userCad (para email), telCad
        userNameSpan.textContent = currentUserData.nomeCad || 'Não informado';
        userEmailSpan.textContent = currentUserData.userCad || 'Não informado'; // Use userCad para o e-mail
        userPhoneSpan.textContent = currentUserData.telCad || 'Não informado';   // Use telCad para o telefone
        // --- FIM DA CORREÇÃO ---
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

        experiencias.forEach((exp) => { // Removido 'index' pois não é usado aqui
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
            experienciasContainer.appendChild(card);
        });
    }

    // --- Função para Gerar o Currículo Completo em PDF ---
    // Certifique-se de que a biblioteca jsPDF esteja carregada no seu HTML:
    // <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    function gerarCurriculoPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // --- Dados do Usuário ---
        const userLogadoJSON = localStorage.getItem('userLogado');
        let currentUserData = {};
        if (userLogadoJSON) {
            try {
                currentUserData = JSON.parse(userLogadoJSON);
            } catch (e) {
                console.error("Erro ao fazer parse dos dados do usuário logado ao gerar PDF:", e);
            }
        }

        let y = 10; // Posição Y inicial para o texto

        // Título do Currículo
        doc.setFontSize(18);
        doc.text("Currículo Profissional", 10, y);
        y += 15;

        // --- Informações Pessoais ---
        doc.setFontSize(12);
        doc.text("Dados Pessoais:", 10, y);
        y += 7;
        doc.text(`Nome: ${currentUserData.nomeCad || 'Não informado'}`, 10, y);
        y += 7;
        doc.text(`Email: ${currentUserData.userCad || 'Não informado'}`, 10, y); // Use userCad para o e-mail no PDF
        y += 7;
        doc.text(`Telefone: ${currentUserData.telCad || 'Não informado'}`, 10, y); // Use telCad para o telefone no PDF
        y += 15; // Espaço após os dados pessoais

        // --- Experiências Profissionais ---
        doc.text("Experiências Profissionais:", 10, y);
        y += 7;

        const experienciasSalvasJSON = localStorage.getItem("experiencias");
        let experiencias = [];

        if (experienciasSalvasJSON) {
            try {
                experiencias = JSON.parse(experienciasSalvasJSON);
            } catch {
                experiencias = [];
            }
        }

        if (experiencias.length === 0) {
            doc.text("Nenhuma experiência cadastrada.", 10, y);
            y += 10;
        } else {
            experiencias.forEach((exp) => {
                // Adiciona uma nova página se o conteúdo exceder a altura
                if (y > doc.internal.pageSize.height - 30) { // Margem inferior de 30
                    doc.addPage();
                    y = 10; // Reinicia Y na nova página
                }

                const inicioFormatado = formatDate(exp.mesInicio, exp.anoInicio);
                const terminoFormatado =
                    exp.mesTermino && exp.anoTermino
                        ? formatDate(exp.mesTermino, exp.anoTermino)
                        : "Atual";

                doc.setFontSize(11);
                doc.text(`- Título: ${exp.titulo}`, 15, y);
                y += 6;
                doc.text(`   Tipo: ${exp.tipo}`, 15, y);
                y += 6;
                doc.text(`   Período: ${inicioFormatado} - ${terminoFormatado}`, 15, y);
                y += 6;
                if (exp.cargaHoraria) {
                    doc.text(`   Carga Horária: ${exp.cargaHoraria} horas`, 15, y);
                    y += 6;
                }
                if (exp.habilidades) {
                    const habilidadesLines = doc.splitTextToSize(`   Habilidades: ${exp.habilidades}`, doc.internal.pageSize.width - 30);
                    doc.text(habilidadesLines, 15, y);
                    y += habilidadesLines.length * 5;
                }
                if (exp.descricao) {
                    const descricaoLines = doc.splitTextToSize(`   Descrição: ${exp.descricao}`, doc.internal.pageSize.width - 30);
                    doc.text(descricaoLines, 15, y);
                    y += descricaoLines.length * 5;
                }
                y += 10; // Espaço entre as experiências
            });
        }

        // Salva o PDF
        doc.save("curriculo.pdf");
    }

    // --- Listener para o botão "Criar Nova Experiência" ---
    btnCriarExp.addEventListener('click', function () {
        window.location.href = 'newexp.html';
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

    // --- Lógica para o botão "Editar Dados" do Perfil ---
    editProfileBtn.addEventListener('click', function() {
        alert('Aqui você pode redirecionar para uma página de edição de perfil ou abrir um modal para editar os dados pessoais.');
    });

    // --- Lógica para o botão "Ver Currículo" (agora gera o PDF) ---
    viewCurriculumBtn.addEventListener('click', gerarCurriculoPDF);

    // --- Chamadas iniciais ao carregar a página ---
    loadUserData();
    carregarExperiencias();
});