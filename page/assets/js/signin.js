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
        toggleSenha.innerHTML = "<i class=\"fa-solid fa-eye-slash\"></i>";
    } else {
        senha.type = "password";
        toggleSenha.innerHTML = "<i class=\"fa-solid fa-eye\"></i>";
    }
}

toggleSenha?.addEventListener("click", togglePassword);

// Função de login
async function entrar() { // Torna a função assíncrona
    msgError.textContent = ""; // Limpa a mensagem de erro anterior

    // Desabilita o botão para evitar cliques múltiplos
    btnEntrar.disabled = true;
    msgError.textContent = "Fazendo login..."; // Feedback para o usuário

    try {
        const response = await fetch('https://needuk-6.onrender.com/usuarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: usuario.value,
                senha: senha.value
            }),
        });

        const data = await response.json(); // Tenta sempre ler o JSON da resposta

        if (!response.ok) {
            // Se a resposta não for OK (status 4xx, 5xx), é um erro do servidor
            throw new Error(data.message || data.error || 'Erro ao fazer login. Verifique suas credenciais.');
        }

        // Sucesso no login!
        // A API deve retornar um token e um objeto 'usuarioDTO' com 'id', 'nome', 'email' e 'telefone'.
        // **** MUDANÇAS AQUI: data.user foi alterado para data.usuarioDTO ****
        if (data && data.token && data.usuarioDTO && data.usuarioDTO.email) {
            localStorage.setItem("token", data.token); // Salva o token JWT
            // Salva o objeto do usuário DTO completo (incluindo nome, email, telefone)
            localStorage.setItem("userLogado", JSON.stringify(data.usuarioDTO));
            // Salva apenas o email para compatibilidade se necessário
            localStorage.setItem("loggedInUserEmail", data.usuarioDTO.email);

            alert(`Bem-vindo(a), ${data.usuarioDTO.nome || data.usuarioDTO.email}!`); // Mensagem de boas-vindas
            window.location.href = "dashboard.html"; // Redireciona
        } else {
            // Se a API retornar sucesso (200 OK) mas sem os dados esperados
            throw new Error("Resposta da API incompleta. Não foi possível obter todos os dados do usuário.");
        }
    } catch (err) {
        console.error("Erro na requisição de login:", err);
        msgError.textContent = err.message; // Exibe a mensagem de erro
    } finally {
        btnEntrar.disabled = false; // Reabilita o botão
    }
}

btnEntrar?.addEventListener("click", entrar);