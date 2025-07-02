// Elementos do login
const usuario = document.getElementById("usuario"); // Este campo receberá apenas o E-mail
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

toggleSenha?.addEventListener("click", togglePassword);

function entrar() {
    msgError.textContent = "";

    const listaUser = JSON.parse(localStorage.getItem("listaUser") || "[]");

    // Procura por um usuário que corresponda EXATAMENTE ao e-mail (userCad) E à senha
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

// --- Bloco para substituir localStorage pelo fetch para API (ajustado) ---
/*
// Se a API exigir login APENAS por e-mail e senha:
fetch('', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: usuario.value, // Enviando o valor do campo 'usuario' como 'email' para a API
        senha: senha.value
    }),
})
.then(res => {
    if (!res.ok) throw new Error('Erro ao fazer login. Verifique suas credenciais.');
    return res.json();
})
.then(data => {
    // A API deve retornar os dados do usuário (incluindo nomeCad, userCad, telCad, etc.) e o token
    localStorage.setItem("token", data.token);
    localStorage.setItem("userLogado", JSON.stringify(data.user)); // data.user deve ter todas as infos

    alert(`Bem-vindo, ${data.user.nomeCad}!`);
    window.location.href = "dashboard.html";
})
.catch(err => {
    msgError.textContent = err.message;
});
*/