// Este é o seu 'profile.js'
document.addEventListener('DOMContentLoaded', function () {
    const userNameSpan = document.getElementById('userName');
    const userEmailSpan = document.getElementById('userEmail');
    const userPhoneSpan = document.getElementById('userPhone');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const viewCurriculumBtn = document.getElementById('viewCurriculumBtn');

    const experienciasContainer = document.getElementById('experiencias-container');
    const noExperiencesMessage = document.getElementById('no-experiences-message');

    const API_EXPERIENCIAS_URL = 'https://needuk-6.onrender.com/experiencias';

    // **** NOVA FUNÇÃO: Formata o número de telefone para o padrão brasileiro ****
    function formatPhoneNumber(phoneNumber) {
        if (!phoneNumber) return 'Não informado';
        // Remove todos os caracteres não numéricos
        const cleaned = ('' + phoneNumber).replace(/\D/g, '');
        
        // Aplica a máscara: (DD) XXXXX-XXXX ou (DD) XXXX-XXXX
        // 11 dígitos para celular com 9 na frente (ex: 99 91234-5678)
        if (cleaned.length === 11) {
            return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7, 11)}`;
        } 
        // 10 dígitos para celular antigo ou fixo (ex: 99 1234-5678)
        else if (cleaned.length === 10) {
            return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6, 10)}`;
        } 
        // Se tiver outro tamanho, retorna sem formatação ou com uma mensagem de erro
        else {
            return phoneNumber; // Retorna o número original se não se encaixar nos padrões
        }
    }
    // **** FIM DA NOVA FUNÇÃO ****

    // --- Dados do Usuário ---
    async function loadUserData() {
        const userLogadoJSON = localStorage.getItem('userLogado');

        if (!userLogadoJSON) {
            alert('Nenhum usuário logado. Por favor, faça login.');
            window.location.href = 'index.html';
            return;
        }

        let currentUserData;
        try {
            currentUserData = JSON.parse(userLogadoJSON);
        } catch (e) {
            console.error("Erro ao fazer parse dos dados do usuário logado:", e);
            alert('Erro ao carregar dados do usuário. Por favor, faça login novamente.');
            localStorage.removeItem('userLogado');
            localStorage.removeItem('token');
            window.location.href = 'index.html';
            return;
        }

        userNameSpan.textContent = currentUserData.nome || 'Não informado';
        userEmailSpan.textContent = currentUserData.email || 'Não informado';
        // **** MUDANÇA AQUI: Usa a nova função para formatar o telefone ****
        userPhoneSpan.textContent = formatPhoneNumber(currentUserData.telefone);
    }

    // --- Função para formatar a data (Mantida como ajustada anteriormente para YYYY-MM-DD) ---
    function formatDate(isoDateString) { // Ex: "2023-01-15"
        if (!isoDateString) return "Data não informada";
        
        try {
            const date = new Date(isoDateString + "T00:00:00");
            const meses = [
                "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
            ];
            const mesNome = meses[date.getMonth()];
            const ano = date.getFullYear();
            return `${mesNome}/${ano}`;
        } catch (e) {
            console.error("Erro ao formatar data:", isoDateString, e);
            return "Data inválida";
        }
    }

    // --- Função para carregar e renderizar as experiências DA API (Mantida) ---
    async function carregarExperiencias() {
        experienciasContainer.innerHTML = '';
        noExperiencesMessage.textContent = 'Carregando experiências...';
        noExperiencesMessage.style.display = 'block';

        const token = localStorage.getItem('token');
        if (!token) {
            noExperiencesMessage.textContent = 'Você precisa estar logado para ver suas experiências.';
            setTimeout(() => { window.location.href = 'index.html'; }, 2000);
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
                noExperiencesMessage.textContent = 'Você ainda não tem experiências cadastradas.';
                noExperiencesMessage.style.display = 'block';
            } else {
                noExperiencesMessage.style.display = 'none';
            }

            localStorage.setItem("experienciasAPI", JSON.stringify(experiencias));


            experiencias.forEach((exp) => {
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

                const inicioFormatado = formatDate(exp.dataInicio);
                const terminoFormatado = exp.dataFim ? formatDate(exp.dataFim) : "Atual";

                const periodoEl = document.createElement('p');
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
        } catch (error) {
            console.error("Erro ao carregar experiências:", error);
            noExperiencesMessage.textContent = `Erro ao carregar experiências: ${error.message}`;
            noExperiencesMessage.style.display = 'block';
        }
    }

    // --- Gerar Currículo PDF ---
    function gerarCurriculoPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // --- Dados do Usuário para o PDF ---
        const userLogadoJSON = localStorage.getItem('userLogado');
        let currentUserData = {};
        if (userLogadoJSON) {
            try {
                currentUserData = JSON.parse(userLogadoJSON);
            } catch (e) {
                console.error("Erro ao fazer parse dos dados do usuário logado ao gerar PDF:", e);
            }
        }

        let y = 10;

        doc.setFontSize(18);
        doc.text("Currículo Profissional", 10, y);
        y += 15;

        // --- Informações Pessoais para o PDF ---
        doc.setFontSize(12);
        doc.text("Dados Pessoais:", 10, y);
        y += 7;
        doc.text(`Nome: ${currentUserData.nome || 'Não informado'}`, 10, y);
        y += 7;
        doc.text(`Email: ${currentUserData.email || 'Não informado'}`, 10, y);
        y += 7;
        // **** MUDANÇA AQUI: Usa a nova função para formatar o telefone no PDF ****
        doc.text(`Telefone: ${formatPhoneNumber(currentUserData.telefone)}`, 10, y);
        // **** FIM DA MUDANÇA ****
        y += 15;

        // --- Experiências Profissionais para o PDF ---
        doc.text("Experiências Profissionais:", 10, y);
        y += 7;

        const experienciasSalvasPDF = localStorage.getItem("experienciasAPI");
        let experienciasParaPDF = [];

        if (experienciasSalvasPDF) {
            try {
                experienciasParaPDF = JSON.parse(experienciasSalvasPDF);
            } catch {
                experienciasParaPDF = [];
            }
        }

        if (experienciasParaPDF.length === 0) {
            doc.text("Nenhuma experiência cadastrada.", 10, y);
            y += 10;
        } else {
            experienciasParaPDF.forEach((exp) => {
                if (y > doc.internal.pageSize.height - 30) {
                    doc.addPage();
                    y = 10;
                }

                const inicioFormatado = formatDate(exp.dataInicio);
                const terminoFormatado = exp.dataFim ? formatDate(exp.dataFim) : "Atual";

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
                y += 10;
            });
        }

        doc.save("curriculo.pdf");
    }

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