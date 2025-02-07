const express = require("express");
const cors = require("cors");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt"); // Importe o bcrypt aqui

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexão com o banco de dados
const db = new sqlite3.Database("./hamburgueria.sqlite", (err) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err.message);
    } else {
        console.log("Conexão com o banco de dados estabelecida.");
    }
});

// Criar tabelas automaticamente
const createTables = () => {
    const schema = `
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            senha TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            descricao TEXT,
            preco REAL NOT NULL,
            loja_id INTEGER NOT NULL,
            FOREIGN KEY (loja_id) REFERENCES lojas(id)
        );

        CREATE TABLE IF NOT EXISTS lojas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            endereco TEXT NOT NULL,
            telefone TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS vendas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            produto_id INTEGER NOT NULL,
            quantidade INTEGER NOT NULL,
            total REAL NOT NULL,
            data_venda TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
            FOREIGN KEY (produto_id) REFERENCES produtos(id)
        );
    `;

    db.exec(schema, (err) => {
        if (err) {
            console.error("Erro ao criar tabelas:", err.message);
        } else {
            console.log("Tabelas criadas com sucesso!");
        }
    });
};

createTables();

// Rota de Cadastro de Usuário
app.post("/usuarios", async (req, res) => {
    const { nome, email, senha } = req.body;
    const hashedPassword = await bcrypt.hash(senha, 10); // Use o bcrypt aqui

    db.run(
        "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
        [nome, email, hashedPassword],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID });
        }
    );
});

// Rota de Login de Usuário
app.post("/login", (req, res) => {
    const { email, senha } = req.body;

    db.get("SELECT * FROM usuarios WHERE email = ?", [email], async (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

        const match = await bcrypt.compare(senha, user.senha); // Use o bcrypt aqui
        if (!match) return res.status(401).json({ error: "Senha incorreta" });

        res.status(200).json({ message: "Login bem-sucedido", userId: user.id });
    });
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; img-src 'self' data:;");
    next();
});