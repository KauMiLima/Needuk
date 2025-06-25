const usuario = document.getElementById("usuario");
const senha = document.getElementById("senha");
const btnEntrar = document.getElementById("btnEntrar");
const msgError = document.getElementById("msgError");
const toggleSenha = document.getElementById("toggleSenha");

function togglePassword() {
  if (senha.type === "password") {
    senha.type = "text";
    toggleSenha.textContent = "🙈";
  } else {
    senha.type = "password";
    toggleSenha.textContent = "👁️";
  }
}

toggleSenha.addEventListener("click", togglePassword);

function entrar() {
  msgError.textContent = "";

  const listaUser = JSON.parse(localStorage.getItem("listaUser") || "[]");

  const userValid = listaUser.find(
    (u) => u.userCad === usuario.value && u.senhaCad === senha.value
  );

  if (userValid) {
    msgError.textContent = "";
    alert(`Bem-vindo, ${userValid.nomeCad}!`);

    const token =
      Math.random().toString(16).substr(2) +
      Math.random().toString(16).substr(2);
    localStorage.setItem("token", token);
    localStorage.setItem("userLogado", JSON.stringify(userValid));

    window.location.href = "index.html";
  } else {
    msgError.textContent = "Usuário ou senha incorretos.";
  }
}

btnEntrar.addEventListener("click", entrar);
