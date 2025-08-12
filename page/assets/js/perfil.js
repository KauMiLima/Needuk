document.addEventListener('DOMContentLoaded', function() {
    // Elementos básicos
    const elements = {
        user: document.getElementById('userName'),
        email: document.getElementById('userEmail'),
        phone: document.getElementById('userPhone'),
        editBtn: document.getElementById('editProfileBtn'),
        viewBtn: document.getElementById('viewCurriculumBtn'),
        expContainer: document.getElementById('experiencias-container'),
        noExpMsg: document.getElementById('no-experiences-message')
    };

    // Configura delay de navegação
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            if (!this.href.includes('#') && !this.href.includes('javascript:')) {
                e.preventDefault();
                this.classList.add('loading');
                setTimeout(() => window.location.href = this.href, 500);
            }
        });
    });

    // Funções principais
    const utils = {
        formatPhone: num => {
            const clean = (''+(num||'')).replace(/\D/g,'');
            return clean.length === 11 ? `(${clean.substr(0,2)}) ${clean.substr(2,5)}-${clean.substr(7)}` :
                   clean.length === 10 ? `(${clean.substr(0,2)}) ${clean.substr(2,4)}-${clean.substr(6)}` : 
                   num || 'Não informado';
        },
        formatDate: date => {
            if (!date) return "Data não informada";
            try {
                const d = new Date(date+"T00:00:00");
                return `${["Janeiro","Fevereiro","Março","Abril","Maio","Junho",
                         "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"][d.getMonth()]}/${d.getFullYear()}`;
            } catch(e) { return "Data inválida"; }
        }
    };

    // Carrega dados do usuário
    async function loadUser() {
        try {
            const user = JSON.parse(localStorage.getItem('userLogado')||'{}');
            if (!user.email) throw new Error('Nenhum usuário logado');
            elements.user.textContent = user.nome || 'Não informado';
            elements.email.textContent = user.email;
            elements.phone.textContent = utils.formatPhone(user.telefone);
        } catch(e) {
            alert('Erro ao carregar dados. Faça login novamente.');
            window.location.href = 'index.html';
        }
    }

    // Carrega experiências
    async function loadExperiences() {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Não autenticado');
            
            const res = await fetch('https://needuk-6.onrender.com/experiencias', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            const data = await res.json();
            const experiences = data.experiencias || data;
            
            if (!Array.isArray(experiences)) throw new Error('Dados inválidos');
            
            elements.expContainer.innerHTML = experiences.length ? 
                experiences.map(exp => `
                    <div class="experiencia-card">
                        <h3>${exp.titulo}</h3>
                        <div class="experiencia-detalhes">
                            <p><span class="detalhe">Tipo:</span> ${exp.tipo}</p>
                            <p><span class="detalhe">Período:</span> ${utils.formatDate(exp.dataInicio)} - ${exp.dataFim ? utils.formatDate(exp.dataFim) : "Atual"}</p>
                            ${exp.cargaHoraria ? `<p><span class="detalhe">Carga horária:</span> ${exp.cargaHoraria} horas</p>` : ''}
                            ${exp.habilidades ? `<p><span class="detalhe">Habilidades:</span> ${exp.habilidades}</p>` : ''}
                            ${exp.descricao ? `<p><span class="detalhe">Descrição:</span> ${exp.descricao}</p>` : ''}
                        </div>
                    </div>
                `).join('') : 
                (elements.noExpMsg.textContent = 'Nenhuma experiência cadastrada', '');
                
        } catch(e) {
            elements.noExpMsg.textContent = `Erro: ${e.message}`;
        }
    }

    // Event listeners
    elements.expContainer.addEventListener('click', e => {
        if (e.target.closest('h3')) {
            e.target.nextElementSibling?.classList.toggle('show');
        }
    });

    elements.viewBtn.addEventListener('click', () => {
        // Lógica para gerar PDF (simplificada)
        const doc = new window.jspdf.jsPDF();
        doc.text("Currículo", 10, 10);
        doc.save("curriculo.pdf");
    });

    // Inicialização
    loadUser();
    loadExperiences();
});