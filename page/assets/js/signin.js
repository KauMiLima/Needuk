// Elementos do login
const usuario = document.getElementById("usuario"); // Este campo receberá apenas o E-mail
const senha = document.getElementById("senha");
const btnEntrar = document.getElementById("btnEntrar");
const msgError = document.getElementById("msgError");
const toggleSenha = document.getElementById("toggleSenha");

// Alternar visibilidade da senha
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

// Função de login
function entrar() {
    msgError.textContent = "";

    const listaUser = JSON.parse(localStorage.getItem("listaUser") || "[]");

    // Verifica se email e senha estão corretos
    const userValid = listaUser.find(
        (u) => u.userCad === usuario.value && u.senhaCad === senha.value
    );

    if (userValid) {
        const token =
            Math.random().toString(16).substr(2) +
            Math.random().toString(16).substr(2);
        
        localStorage.setItem("token", token);
        localStorage.setItem("userLogado", JSON.stringify(userValid));

        // ✅ Salvar email logado para mensagem de boas-vindas no dashboard
        localStorage.setItem("loggedInUserEmail", userValid.userCad);

        alert(`Bem-vindo, ${userValid.nomeCad}!`);
        window.location.href = "dashboard.html";
    } else {
        msgError.textContent = "Usuário ou senha incorretos.";
    }
}

btnEntrar?.addEventListener("click", entrar);

// --- Bloco de login com API (opcional - ajustado e comentado) ---
/*
fetch('', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: usuario.value,
        senha: senha.value
    }),
})
.then(res => {
    if (!res.ok) throw new Error('Erro ao fazer login. Verifique suas credenciais.');
    return res.json();
})
.then(data => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userLogado", JSON.stringify(data.user));
    localStorage.setItem("loggedInUserEmail", data.user.userCad); // Também aqui

    alert(`Bem-vindo, ${data.user.nomeCad}!`);
    window.location.href = "dashboard.html";
})
.catch(err => {
    msgError.textContent = err.message;
});
*/
