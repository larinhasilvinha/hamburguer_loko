const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

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

module.exports = db;