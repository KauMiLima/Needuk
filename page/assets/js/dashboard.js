document.addEventListener("DOMContentLoaded", function () {
  const btnCriarExp = document.getElementById("criarex");
  const experienciasContainer = document.getElementById("experiencias-container");
  const noExperiencesMessage = document.getElementById("no-experiences-message");
  const userWelcomeMessageElement = document.getElementById("user-welcome-message");
  const perfilLink = document.querySelector('a[href="perfil.html"]'); 

  const API_EXPERIENCIAS_URL = 'https://needuk-6.onrender.com/experiencias';

  if (perfilLink) {
    perfilLink.addEventListener('click', function(e) {
      e.preventDefault();
      const link = this.href;
      this.classList.add('nav-loading');
      setTimeout(function() {
        window.location.href = link;
      }, 500);
    });
  }

  if (btnCriarExp) {
    btnCriarExp.addEventListener("click", function () {
      window.location.href = "newexp.html";
    });
  }

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

  // Função para renderizar as experiências no DOM
  function renderizarExperiencias(experiencias) {
    if (!Array.isArray(experiencias) || experiencias.length === 0) {
      noExperiencesMessage.style.display = 'block';
      experienciasContainer.innerHTML = '';
    } else {
      noExperiencesMessage.style.display = 'none';
      experienciasContainer.innerHTML = '';
      experiencias.forEach((experiencia) => {
        const experienciaHTML = `
          <div class="experiencia-card" data-id="${experiencia.id}">
            <h3>${experiencia.titulo}</h3>
            
            <div class="experiencia-detalhes">
              <p><strong>Tipo:</strong> ${experiencia.tipo}</p>
              <p><strong>Período:</strong> ${experiencia.dataInicio} até ${experiencia.dataFim || "Atualmente"}</p>
              <p><strong>Carga Horária:</strong> ${experiencia.cargaHoraria} horas</p>
              <p><strong>Habilidades:</strong> ${experiencia.habilidades}</p>
              <p><strong>Descrição:</strong> ${experiencia.descricao}</p>
              <div class="card-botoes">
                <button class="btn-editar" data-id="${experiencia.id}">Editar</button>
                <button class="btn-deletar" data-id="${experiencia.id}">Deletar</button>
              </div>
            </div>
          </div>
        `;
        experienciasContainer.insertAdjacentHTML("beforeend", experienciaHTML);
      });
    }
  }

  // Adiciona o event listener para expandir/recolher o card.
  // Ele verifica se o clique ocorreu em um botão para não expandir o card.
  experienciasContainer.addEventListener('click', function(event) {
    const card = event.target.closest('.experiencia-card');

    if (card && !event.target.classList.contains('btn-editar') && !event.target.classList.contains('btn-deletar')) {
      const detalhes = card.querySelector('.experiencia-detalhes');
      detalhes.classList.toggle('show');
    }
  });

  // Mantido o event listener para os botões de editar e deletar
  experienciasContainer.addEventListener("click", async function (event) {
    if (event.target.classList.contains("btn-deletar")) {
      const id = event.target.dataset.id;
      if (confirm("Tem certeza que deseja deletar esta experiência?")) {
        await deletarExperiencia(id);
      }
    }
    if (event.target.classList.contains("btn-editar")) {
      const id = event.target.dataset.id;
      window.location.href = `newexp.html?editId=${id}`;
    }
  });

  async function carregarExperiencias() {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você não está autenticado.");
      window.location.href = "index.html";
      return;
    }

    try {
      const response = await fetch(API_EXPERIENCIAS_URL, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erro de rede: ${response.status} ${response.statusText}`);
      }
      
      const experiencias = await response.json();
      
      if (!Array.isArray(experiencias)) {
        throw new Error("Formato de dados inesperado do servidor. Esperado um array.");
      }

      // O bloco de código que causava a duplicação foi removido.
      // Agora, a função renderizarExperiencias() usa apenas os dados da API.
      renderizarExperiencias(experiencias);

    } catch (error) {
      console.error("Erro ao carregar experiências:", error);
      alert("Não foi possível carregar as experiências. Tente novamente mais tarde.");
      noExperiencesMessage.style.display = 'block';
      noExperiencesMessage.textContent = 'Erro ao carregar experiências.';
    }
  }

  async function deletarExperiencia(id) {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você não está autenticado.");
      window.location.href = "index.html";
      return;
    }

    try {
      const response = await fetch(`${API_EXPERIENCIAS_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro: ${errorText}`);
      }

      alert("Experiência deletada com sucesso!");
      const cardParaDeletar = experienciasContainer.querySelector(`.experiencia-card[data-id="${id}"]`);
      if (cardParaDeletar) {
        cardParaDeletar.remove();
        if (experienciasContainer.children.length === 0) {
          noExperiencesMessage.style.display = 'block';
        }
      }

    } catch (error) {
      console.error("Erro ao deletar experiência:", error);
      alert("Não foi possível deletar a experiência.");
    }
  }

  displayWelcomeMessage();
  carregarExperiencias();
});