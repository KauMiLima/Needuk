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

    // Aplica a máscara (XX) XXXXX-XXXX
    if (value.length > 10) { // Para celular com 9º dígito
        value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else if (value.length > 6) { // Para telefone fixo ou celular sem 9º dígito
        value = value.replace(/^(\d{2})(\d{4})(\d{4}).*/, '($1) $2-$3');
    } else if (value.length > 2) { // Para (XX) XXXX
        value = value.replace(/^(\d{2})(\d+).*/, '($1) $2');
    } else if (value.length > 0) { // Para (XX
        value = value.replace(/^(\d*)/, '($1');
    }
    input.value = value;
}


telefone?.addEventListener("input", formatarTelefone); 


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

    if (email.value.length < 5 || !email.value.includes('@')) { // Validação básica de e-mail
        msgError.textContent = "E-mail inválido.";
        email.focus();
        return false;
    }

    // Validação do campo de telefone (verificando apenas os dígitos)
    let telefoneNumeros = telefone.value.replace(/\D/g, ''); 
    if (telefoneNumeros.length < 10 || telefoneNumeros.length > 11) { 
        msgError.textContent = "Telefone inválido. Utilize o formato (XX) XXXXX-XXXX.";
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

// Cadastro
function cadastrar() {
    if (!validarCampos()) return;

    let listaUser = JSON.parse(localStorage.getItem("listaUser") || "[]");

    if (listaUser.some(u => u.userCad === email.value)) {
        msgError.textContent = "E-mail já cadastrado.";
        email.focus();
        return;
    }

    listaUser.push({
        nomeCad: nome.value,
        userCad: email.value, 
        telCad: telefone.value, 
        senhaCad: senha.value
    });

    localStorage.setItem("listaUser", JSON.stringify(listaUser));

    msgSuccess.textContent = "Usuário cadastrado com sucesso! Redirecionando...";
    msgError.textContent = "";

    nome.value = "";
    email.value = "";
    telefone.value = "";
    senha.value = "";
    confirmSenha.value = "";

    setTimeout(() => {
        window.location.href = "signin.html";
    }, 2000);
}

btnCadastrar?.addEventListener("click", cadastrar);

// Bloco para integração com API (mantido comentado)
/*
fetch('', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        nome: nome.value,
        email: email.value,
        telefone: telefone.value, 
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