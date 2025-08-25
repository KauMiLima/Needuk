document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("experienciaForm");
  const tituloExperiencia = document.getElementById("tituloExperiencia");
  const tipoExperiencia = document.getElementById("tipoExperiencia");
  const dataInicioInput = document.getElementById("dataInicio");
  const dataTerminoInput = document.getElementById("dataTermino");
  const cargaHorariaInput = document.getElementById("cargaHoraria");
  const habilidadesInput = document.getElementById("habilidades");
  const descricaoInput = document.getElementById("descricao");
  const tituloPagina = document.getElementById("tituloPagina");

  const API_EXPERIENCIAS_URL = "https://needuk-6.onrender.com/experiencias";
  let experienciaIdParaEdicao = null;

  // Adiciona o asterisco vermelho ao lado do label
  function adicionarAsterisco(campo) {
    const container = campo.closest("div");
    if (!container) return;

    const label = container.querySelector("label");
    if (!label) return;

    let estrela = label.querySelector(".obrigatorio");
    if (!estrela) {
      estrela = document.createElement("span");
      estrela.classList.add("obrigatorio");
      estrela.textContent = "*";
      estrela.style.color = "red";
      estrela.style.marginLeft = "4px";
      label.appendChild(estrela);
    }
  }

  // Mostra a mensagem "Obrigatório" acima do campo se estiver vazio
  function mostrarErroSeVazio(campo) {
    const container = campo.closest("div");
    if (!container) return;

    let mensagemErro = container.querySelector(".mensagem-obrigatorio");

    if (campo.value.trim() === "") {
      if (!mensagemErro) {
        mensagemErro = document.createElement("div");
        mensagemErro.classList.add("mensagem-obrigatorio");
        mensagemErro.style.color = "red";
        mensagemErro.style.fontSize = "12px";
        mensagemErro.style.marginBottom = "4px";
        mensagemErro.textContent = "Obrigatório";
        container.insertBefore(mensagemErro, campo);
      }
    } else {
      if (mensagemErro) {
        mensagemErro.remove();
      }
    }
  }

  const camposObrigatorios = [
    tituloExperiencia,
    tipoExperiencia,
    dataInicioInput,
    cargaHorariaInput,
  ];

  // Mostra os asteriscos, mas não a mensagem de erro ao iniciar
  camposObrigatorios.forEach((campo) => {
    adicionarAsterisco(campo);
    campo.addEventListener("input", () => {
      mostrarErroSeVazio(campo);
    });
  });

  // --- NOVO: Limita a entrada do campo de carga horária para 3 dígitos ---
  cargaHorariaInput.addEventListener('input', function() {
    if (this.value.length > 3) {
      this.value = this.value.slice(0, 3);
    }
  });

  async function carregarExperienciaParaEdicao(id) {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar logado para editar experiências.");
      window.location.href = "index.html";
      return;
    }

    try {
      const response = await fetch(`${API_EXPERIENCIAS_URL}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        throw new Error((await response.text()) || "Resposta inválida");
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Erro ao carregar dados da experiência."
        );
      }

      tituloExperiencia.value = data.titulo || "";
      tipoExperiencia.value = data.tipo || "";
      dataInicioInput.value = data.dataInicio || "";
      dataTerminoInput.value = data.dataFim || "";
      cargaHorariaInput.value = data.cargaHoraria || "";
      habilidadesInput.value = data.habilidades || "";
      descricaoInput.value = data.descricao || "";

      tituloPagina.textContent = "Editar Experiência";
      experienciaIdParaEdicao = id;
    } catch (error) {
      alert(`Erro: ${error.message}`);
      if (error.message.includes("autenticação")) {
        window.location.href = "index.html";
      }
    }
  }

  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get("editId");
  if (editId) {
    carregarExperienciaParaEdicao(editId);
  } else {
    tituloPagina.textContent = "Criar Nova Experiência";
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    let isValid = true;

    camposObrigatorios.forEach((campo) => {
      mostrarErroSeVazio(campo); 
      if (campo.value.trim() === "") {
        isValid = false;
      }
    });

    if (!isValid) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    let cargaHorariaNum = parseInt(cargaHorariaInput.value.trim());
    if (isNaN(cargaHorariaNum) || cargaHorariaNum <= 0) {
      alert("A carga horária deve ser um número inteiro positivo.");
      return;
    }

    if (dataInicioInput.value && dataTerminoInput.value) {
      const inicioObj = new Date(dataInicioInput.value);
      const terminoObj = new Date(dataTerminoInput.value);
      if (terminoObj < inicioObj) {
        alert("A data de término não pode ser anterior à data de início.");
        return;
      }
    }

    const experienciaData = {
      titulo: tituloExperiencia.value.trim(),
      tipo: tipoExperiencia.value,
      dataInicio: dataInicioInput.value,
      dataFim: dataTerminoInput.value || null,
      cargaHoraria: cargaHorariaNum,
      habilidades: habilidadesInput.value.trim(),
      descricao: descricaoInput.value.trim(),
    };

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você não está autenticado.");
      window.location.href = "index.html";
      return;
    }

    let method = experienciaIdParaEdicao ? "PUT" : "POST";
    let url = experienciaIdParaEdicao
      ? `${API_EXPERIENCIAS_URL}/${experienciaIdParaEdicao}`
      : API_EXPERIENCIAS_URL;

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(experienciaData),
      });

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = { message: (await response.text()) || "Resposta inválida." };
      }

      if (!response.ok) {
        throw new Error(data.message || "Erro ao salvar experiência.");
      }

      localStorage.setItem("experienciaAtualizada", JSON.stringify(experienciaData));

      alert(
        `Experiência ${
          experienciaIdParaEdicao ? "atualizada" : "criada"
        } com sucesso!`
      );
      form.reset();
      window.location.href = "dashboard.html";
    } catch (error) {
      alert(`Erro: ${error.message}`);
    }
  });
});