document.addEventListener("DOMContentLoaded", function () {
    const btnCriarExp = document.getElementById("criarex");
    const experienciasContainer = document.getElementById("experiencias-container");
    const noExperiencesMessage = document.getElementById("no-experiences-message");
    const userWelcomeMessageElement = document.getElementById("user-welcome-message");
    const perfilLink = document.querySelector('a[href="perfil.html"]'); // Seleciona o link do perfil

    const API_EXPERIENCIAS_URL = 'https://needuk-6.onrender.com/experiencias';

    // Adiciona o event listener para o link do perfil com delay
    if (perfilLink) {
        perfilLink.addEventListener('click', function(e) {
            e.preventDefault();
            const link = this.href;
            
            // Adiciona feedback visual (opcional)
            this.classList.add('nav-loading');
            
            // Delay de 500ms antes de redirecionar
            setTimeout(function() {
                window.location.href = link;
            }, 500);
        });
    }

    // EXIBIR MENSAGEM DE BOAS-VINDAS COM O NOME DO USUÁRIO
    function displayWelcomeMessage() {
        const loggedInUserEmail = localStorage.getItem("loggedInUserEmail");
        const userLogado = JSON.parse(localStorage.getItem("userLogado") || "{}");

        if (userLogado && userLogado.nome) {
            userWelcomeMessageElement.textContent = `Bem Vindo, ${userLogado.nome}!`;
        } else if (loggedInUserEmail) {
            userWelcomeMessageElement.textContent = `Bem Vindo, ${loggedInUserEmail}!`;
        } else {
            userWelcomeMessageElement.textContent = "Olá!";
        }
    }

    // ... (restante do seu código existente permanece igual) ...
    btnCriarExp.addEventListener("click", function () {
        window.location.href = "newexp.html";
    });

    function formatDate(dateInput, monthInput, yearInput) {
        // ... (código existente da formatDate) ...
    }

    async function carregarExperiencias() {
        // ... (código existente da carregarExperiencias) ...
    }

    // ... (restante dos event listeners existentes) ...

    displayWelcomeMessage();
    carregarExperiencias();
});