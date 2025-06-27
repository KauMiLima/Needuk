// Elementos do cadastro{pronto}
const nome = document.getElementById("nome");
const usuario = document.getElementById("usuario");
const senha = document.getElementById("senha");
const confirmSenha = document.getElementById("confirmSenha");
const btnCadastrar = document.getElementById("btnCadastrar");
const msgError = document.getElementById("msgError");
const msgSuccess = document.getElementById("msgSuccess");

const toggleSenha = document.getElementById("toggleSenha");
const toggleConfirmSenha = document.getElementById("toggleConfirmSenha");

// Mostrar/ocultar senha{pronto}
function togglePassword(input, toggleIcon) {
  if (input.type === "password") {
    input.type = "text";
    toggleIcon.textContent = "🙈";
  } else {
    input.type = "password";
    toggleIcon.textContent = "👁️";
  }
}

toggleSenha?.addEventListener("click", () => togglePassword(senha, toggleSenha));
toggleConfirmSenha?.addEventListener("click", () => togglePassword(confirmSenha, toggleConfirmSenha));

// Validação
function validarCampos() {
  msgError.textContent = "";
  msgSuccess.textContent = "";

  if (nome.value.length < 3) {
    msgError.textContent = "Nome precisa ter pelo menos 3 caracteres.";
    nome.focus();
    return false;
  }

  if (usuario.value.length < 5) {
    msgError.textContent = "Usuário precisa ter pelo menos 5 caracteres.";
    usuario.focus();
    return false;
  }

  if (senha.value.length < 6) {
    msgError.textContent = "Senha precisa ter pelo menos 6 caracteres.";
    senha.focus();
    return false;
  }

  if (senha.value !== confirmSenha.value) {
    msgError.textContent = "As senhas não conferem.";
    confirmSenha.focus();
    return false;
  }

  return true;
}

// Cadastro
function cadastrar() {
  if (!validarCampos()) return;

  let listaUser = JSON.parse(localStorage.getItem("listaUser") || "[]");
  
  if (listaUser.some(u => u.userCad === usuario.value)) {
    msgError.textContent = "Usuário já cadastrado.";
    usuario.focus();
    return;
  }
  
  listaUser.push({
    nomeCad: nome.value,
    userCad: usuario.value,
    senhaCad: senha.value
  });
  
  localStorage.setItem("listaUser", JSON.stringify(listaUser));
  
  msgSuccess.textContent = "Usuário cadastrado com sucesso! Redirecionando...";
  msgError.textContent = "";
  
  nome.value = "";
  usuario.value = "";
  senha.value = "";
  confirmSenha.value = "";
  
  setTimeout(() => {
    window.location.href = "signin.html";
  }, 2000);
}

btnCadastrar?.addEventListener("click", cadastrar);

//  substituir este bloco localStorage pelo fetch para API{em andamento}
/*
fetch('', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nome: nome.value,
    usuario: usuario.value,
    senha: senha.value
  }),
})
.then(res => {
  if (!res.ok) throw new Error('Erro ao cadastrar');
  return res.json();
})
.then(data => {
  // Sucesso, tratar resposta da API
})
.catch(err => {
  msgError.textContent = err.message;
});
*/

// Código atual usando localStorage{local sotage}