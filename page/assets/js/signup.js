// Definindo a URL da API em uma constante para facilitar a manutenção
const API_BASE_URL = "https://needuk-6.onrender.com";

// Elementos do cadastro
const nome = document.getElementById("nome");
const email = document.getElementById("email");
const telefone = document.getElementById("telefone");
const senha = document.getElementById("senha");
const confirmSenha = document.getElementById("confirmSenha");
const btnCadastrar = document.getElementById("btnCadastrar");
const msgError = document.getElementById("msgError");
const msgSuccess = document.getElementById("msgSuccess");

const toggleSenha = document.getElementById("toggleSenha");
const toggleConfirmSenha = document.getElementById("toggleConfirmSenha");

// Função para formatar o telefone enquanto o usuário digita
function formatarTelefone(event) {
    let input = event.target;
    let value = input.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    let formattedValue = '';

    if (value.length > 0) {
        formattedValue += '(' + value.substring(0, 2);
    }
    if (value.length > 2) {
        formattedValue += ') ' + value.substring(2, 7);
    }
    if (value.length > 7) {
        formattedValue += '-' + value.substring(7, 11);
    }

    input.value = formattedValue;
}

telefone?.addEventListener("input", formatarTelefone);

// Alternar visibilidade da senha
function togglePassword(inputElement, toggleIconElement) {
    if (inputElement.type === "password") {
        inputElement.type = "text";
        toggleIconElement.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
    } else {
        inputElement.type = "password";
        toggleIconElement.innerHTML = '<i class="fa-solid fa-eye"></i>';
    }
}

toggleSenha?.addEventListener("click", () => togglePassword(senha, toggleSenha));
toggleConfirmSenha?.addEventListener("click", () => togglePassword(confirmSenha, toggleConfirmSenha));

// Adiciona um ouvinte de evento para o campo de confirmação de senha para a tecla Enter
confirmSenha?.addEventListener("keydown", (event) => {
    // Verifica se a tecla pressionada é a tecla "Enter"
    if (event.key === "Enter") {
        event.preventDefault(); // Impede o comportamento padrão do Enter
        cadastrar(); // Chama a função de cadastro
    }
});


// Validação dos campos
function validarCampos() {
    msgError.textContent = "";
    msgSuccess.textContent = "";

    if (nome.value.length < 3) {
        msgError.textContent = "Nome precisa ter pelo menos 3 caracteres.";
        nome.focus();
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        msgError.textContent = "E-mail inválido. Verifique o formato.";
        email.focus();
        return false;
    }

    let telefoneNumeros = telefone.value.replace(/\D/g, '');
    if (telefoneNumeros.length < 10 || telefoneNumeros.length > 11) {
        msgError.textContent = "Telefone inválido. Utilize o formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX.";
        telefone.focus();
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

// Cadastro do usuário
async function cadastrar() {
    if (!validarCampos()) {
        return;
    }

    const userData = {
        nome: nome.value,
        email: email.value,
        telefone: telefone.value.replace(/\D/g, ''), // Envia o telefone apenas com números para o backend
        senha: senha.value
    };

    btnCadastrar.disabled = true;
    msgError.textContent = "";
    msgSuccess.textContent = "Cadastrando usuário...";

    try {
        const response = await fetch(`https://needuk-6.onrender.com/usuarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData),
        });

        // Tenta ler a resposta como JSON, mesmo em caso de erro
        const data = await response.json().catch(() => ({ message: 'Erro desconhecido.' }));

        if (!response.ok) {
            // Tratamento de erro aprimorado
            if (response.status === 409) { // Exemplo: Conflito de e-mail ou telefone já cadastrado
                throw new Error(data.message || 'E-mail ou telefone já cadastrado.');
            }
            throw new Error(data.message || 'Erro ao cadastrar. Verifique os dados fornecidos.');
        }

        console.log("Usuário cadastrado com sucesso pela API:", data);

        if (data.token) {
            localStorage.setItem("token", data.token);
        }

        if (data.user) {
            localStorage.setItem("userLogado", JSON.stringify(data.user));
            localStorage.setItem("loggedInUserEmail", data.user.email || email.value);
        } else {
            localStorage.setItem("userLogado", JSON.stringify({
                nome: nome.value,
                email: email.value,
                telefone: telefone.value.replace(/\D/g, '')
            }));
            localStorage.setItem("loggedInUserEmail", email.value);
        }

        msgSuccess.textContent = "Usuário cadastrado com sucesso! Redirecionando...";
        msgError.textContent = "";

        // Limpa os campos
        nome.value = "";
        email.value = "";
        telefone.value = "";
        senha.value = "";
        confirmSenha.value = "";

        setTimeout(() => {
            window.location.href = "index.html";
        }, 2000);

    } catch (err) {
        console.error("Erro na requisição da API:", err);
        msgError.textContent = err.message || "Erro desconhecido ao tentar cadastrar o usuário.";
        msgSuccess.textContent = "";
    } finally {
        btnCadastrar.disabled = false;
    }
}

btnCadastrar?.addEventListener("click", cadastrar);