// Elementos do login
const usuario = document.getElementById("usuario");
const senha = document.getElementById("senha");
const btnEntrar = document.getElementById("btnEntrar");
const msgError = document.getElementById("msgError");
const toggleSenha = document.getElementById("toggleSenha");

// Mostrar/ocultar senha pronto{ pronto}
function togglePassword() {
  if (senha.type === "password") {
    senha.type = "text";
    toggleSenha.textContent = "🙈";
  } else {
    senha.type = "password";
    toggleSenha.textContent = "👁️";
  }
}

toggleSenha?.addEventListener("click", togglePassword);
function entrar() {
  msgError.textContent = "";
  
  const listaUser = JSON.parse(localStorage.getItem("listaUser") || "[]");
  
  const userValid = listaUser.find(
    (u) => u.userCad === usuario.value && u.senhaCad === senha.value
  );

  if (userValid) {
    const token =
      Math.random().toString(16).substr(2) +
      Math.random().toString(16).substr(2);
      localStorage.setItem("token", token);
      localStorage.setItem("userLogado", JSON.stringify(userValid));
      
      alert(`Bem-vindo, ${userValid.nomeCad}!`);
      window.location.href = "dashboard.html";
    } else {
      msgError.textContent = "Usuário ou senha incorretos.";
    }
  }
  
  btnEntrar?.addEventListener("click", entrar);
  
  
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
  
  // Login{pronto}
  // Código atual usando localStorage{local sotage}