// Evento de envio do formulário de pedidos
document.getElementById("pedidoForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const produto = document.getElementById("produto").value;

    // Envia os dados do pedido para o servidor
    const response = await fetch("/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, produto })
    });

    if (response.ok) {
        alert("Pedido enviado com sucesso!");
        carregarPedidosServidor(); // Atualiza os pedidos da API
    } else {
        alert("Erro ao enviar o pedido.");
    }
});

// Função para carregar pedidos do servidor
async function carregarPedidosServidor() {
    const response = await fetch("/pedidos");
    if (response.ok) {
        const pedidos = await response.json();
        atualizarListaPedidos(pedidos);
    } else {
        alert("Erro ao carregar pedidos do servidor.");
    }
}

// Função para carregar pedidos locais (localStorage)
function carregarPedidosLocal() {
    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    atualizarListaPedidos(pedidos);
}

// Função para atualizar a lista de pedidos exibida
function atualizarListaPedidos(pedidos) {
    const listaPedidos = document.getElementById("listaPedidos");
    listaPedidos.innerHTML = "";

    pedidos.forEach((pedido) => {
        const item = document.createElement("li");
        item.textContent = `${pedido.nome} pediu: ${pedido.produto}`;
        listaPedidos.appendChild(item);
    });
}

// Função para adicionar um pedido ao localStorage
function adicionarAoPedidoLocal(nome, produto) {
    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    pedidos.push({ nome, produto });
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    alert(`${nome} pediu: ${produto}`);
    carregarPedidosLocal(); // Atualiza a lista exibida
}

// Função para limpar pedidos do localStorage
function limparPedidosLocal() {
    localStorage.removeItem("pedidos");
    carregarPedidosLocal();
}

// Carregar pedidos ao abrir a página (prioriza servidor, mas usa localStorage como fallback)
document.addEventListener("DOMContentLoaded", async () => {
    if (window.location.pathname.includes("pedidos.html")) {
        try {
            await carregarPedidosServidor();
        } catch {
            carregarPedidosLocal(); // Caso a API falhe, usa localStorage
        }
    }
});
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const session = require("express-session");

const app = express();
const users = []; // Simulação de banco de dados

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: "chave-secreta",
    resave: false,
    saveUninitialized: true
}));

app.get("/", (req, res) => {
    if (req.session.user) {
        res.send(`<h1>Bem-vindo, ${req.session.user.email}!</h1><a href="/logout">Logout</a>`);
    } else {
        res.redirect("/login");
    }
});

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/login.html");
});

app.post("/login", async (req, res) => {
    const user = users.find(u => u.email === req.body.email);
    if (user && await bcrypt.compare(req.body.senha, user.senha)) {
        req.session.user = user;
        res.redirect("/");
    } else {
        res.send("Email ou senha inválidos!");
    }
});

app.get("/cadastro", (req, res) => {
    res.sendFile(__dirname + "/cadastro.html");
});

app.post("/cadastro", async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.senha, 10);
    users.push({ email: req.body.email, senha: hashedPassword });
    res.redirect("/login");
});

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("gerarPDF").addEventListener("click", gerarPDF);
});

// Função para gerar o recibo em PDF
function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let nome = document.getElementById("nome").value.trim();
    let pedido = document.getElementById("pedido").value.trim();
    let valor = document.getElementById("valor").value.trim();

    if (!nome || !pedido || !valor) {
        alert("Preencha todos os campos para gerar o recibo!");
        return;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Recibo de Pagamento", 10, 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Nome: ${nome}`, 10, 20);
    doc.text(`Pedido: ${pedido}`, 10, 30);
    doc.text(`Valor: R$ ${valor}`, 10, 40);

    doc.save("recibo_pagamento.pdf");
}
