// Função para lidar com o formulário de login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault(); // Impede o envio padrão do formulário

    // Captura os valores dos campos
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        // Envia os dados para o backend via POST
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha }),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Login realizado com sucesso!');
            // Redirecionar para outra página após o login
            window.location.href = 'dashboard.html'; // Substitua pelo nome da sua página protegida
        } else {
            alert(`Erro ao fazer login: ${result.error}`);
        }
    } catch (error) {
        alert('Erro ao conectar ao servidor. Tente novamente mais tarde.');
    }
});

// Função para lidar com o formulário de cadastro
document.getElementById('cadastroForm')?.addEventListener('submit', async (e) => {
    e.preventDefault(); // Impede o envio padrão do formulário

    // Captura os valores dos campos
    const nome = document.getElementById('nome')?.value;
    const email = document.getElementById('email')?.value;
    const senha = document.getElementById('senha')?.value;

    try {
        // Envia os dados para o backend via POST
        const response = await fetch('http://localhost:3000/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha }),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Cadastro realizado com sucesso!');
            // Redirecionar para a página de login após o cadastro
            window.location.href = 'views/login.html';
        } else {
            alert(`Erro ao cadastrar: ${result.error}`);
        }
    } catch (error) {
        alert('Erro ao conectar ao servidor. Tente novamente mais tarde.');
    }
});