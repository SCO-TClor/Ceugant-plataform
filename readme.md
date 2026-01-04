# 🛒 Market API

> Uma API RESTful moderna e segura para gerenciamento de marketplace, construída com Node.js, TypeScript e PostgreSQL.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
---

## Informações Iniciais

Este projeto ainda está em construção. Algumas funcionalidades estão em desenvolvimento e podem não estar completamente implementadas. Fique à vontade para acompanhar o progresso!

## 📋 Índice

- Sobre
- Features
- Tecnologias
- Estrutura do Projeto
- Pré-requisitos
- Instalação
- Configuração
- Uso
- API Endpoints
- Segurança
- Licença

---

## 🎯 Sobre

A **Market API** é uma solução completa para gerenciamento de marketplaces, oferecendo:

- 🔐 **Autenticação JWT** segura
- 📧 **Verificação de email** com tokens únicos
- 👥 **Gestão de usuários** com bcrypt
- 🗄️ **PostgreSQL** para persistência de dados
- 🎨 **Arquitetura modular** (MVC)
- 🔒 **CORS** configurável por ambiente

---

## ✨ Features

- [x] Sistema de autenticação completo (registro/login)
- [x] Middleware de verificação JWT
- [x] Hash de senhas com bcrypt
- [x] Envio de emails de verificação
- [x] CORS configurável
- [x] Logs detalhados (modo debug)
- [x] Tratamento robusto de erros
- [x] TypeScript com tipagem forte
- [ ] Sistema de produtos (em desenvolvimento)
- [ ] Sistema de estilização (dando liberdade ao cliente)
- [ ] Carrinho de compras (planejado)
- [ ] Processamento de pagamentos (planejado)

---

## 🛠️ Tecnologias

### Core
- **[Node.js](https://nodejs.org/)** - Runtime JavaScript
- **[TypeScript](https://www.typescriptlang.org/)** - Superset tipado do JavaScript
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional

### Principais Dependências
- **[bcrypt](https://github.com/kelektiv/node.bcrypt.js)** - Hash de senhas
- **[jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)** - Autenticação JWT
- **[nodemailer](https://nodemailer.com/)** - Envio de emails
- **[pg](https://node-postgres.com/)** - Cliente PostgreSQL
- **[dotenv](https://github.com/motdotla/dotenv)** - Variáveis de ambiente

---

## 📁 Estrutura do Projeto

```
marketAPI/
├── 📄 .env                     # Variáveis de ambiente (NÃO commitado)
├── 📄 .gitignore               # Arquivos ignorados pelo Git
├── 📄 package.json             # Dependências do projeto
├── 📄 tsconfig.json            # Configuração TypeScript
├── 📂 docs/                    # Documentação
│   ├── project.md
│   ├── routes.md
│   └── database/
└── 📂 src/                    # Código fonte (em desenvolvimento)
    ├── 📄 server.ts           # Entry point do servidor
    ├── 📄 app.ts              # Configuração principal da aplicação
    ├── 📂 data/               # Camada de dados
    │   ├── databaseCtrl.ts
    │   └── database/
    │       └── databaseConfig.ts
    ├── 📂 middleware/         # Middlewares (auth, CORS, etc)
    │   └── auth.middleware.ts
    ├── 📂 plataform/          # Módulo de plataforma (em desenvolvimento)
    │   ├── controller/
    │   ├── router/
    │   └── services/
    ├── 📂 store/              # Módulo de loja (em desenvolvimento)
    │   ├── controller/
    │   ├── router/
    │   └── services/
    └── 📂 utils/              # Utilitários  (em desenvolvimento)
        ├── DBInterface.ts
        ├── emailSender.ts
        ├── endPoints.ts
        └── headWriter.ts
```

---

## 📦 Pré-requisitos

Antes de começar, você precisa ter instalado:

- **Node.js** (v16 ou superior) - [Download](https://nodejs.org/) (de preferencia v20+ para rodar sem precisar importar o dotenv)
- **PostgreSQL** (v13 ou superior) - [Download](https://www.postgresql.org/download/)
- **npm** ou **yarn** - Gerenciador de pacotes
- **Git** - [Download](https://git-scm.com/)

---

## 🚀 Instalação

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/seu-usuario/marketAPI.git
cd marketAPI
```

### 2️⃣ Instale as dependências

```bash
npm install
```

### 3️⃣ Configure o banco de dados

```sql
-- Crie o banco de dados
CREATE DATABASE market_api;

-- Conecte-se ao banco
\c market_api

-- Crie o schema
CREATE SCHEMA plataform;

-- Crie a tabela de usuários
CREATE TABLE plataform.users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## ⚙️ Configuração

### 1️⃣ Crie o arquivo .env

```bash
cp .env.example .env
```

### 2️⃣ Configure as variáveis de ambiente

```env
# Server
SERVER_PORT=3333
ALLOWED_ORIGIN_PLATAFORM=http://127.0.0.1:5500
ALLOWED_ORIGIN_CLIENTS=http://localhost:4000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha_segura
DB_DATABASE=market_api

# Email Sender (Gmail)
EMAIL_USER=seu_email@gmail.com
EMAIL_PASSWORD=sua_app_password

# JWT
JWT_SECRET=sua_chave_secreta_muito_longa_e_aleatoria
```

> ⚠️ **IMPORTANTE**: Gere um JWT_SECRET forte usando:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### 3️⃣ Configure App Password do Gmail

1. Acesse [Google Account Security](https://myaccount.google.com/security)
2. Ative a verificação em 2 etapas
3. Gere uma "App Password" em "App passwords"
4. Use essa senha no `EMAIL_PASSWORD`

---

## 💻 Uso

### Desenvolvimento

```bash
# Compilar TypeScript
npm run build

# Iniciar servidor
npm start

# Modo desenvolvimento (com nodemon)
npm run dev
```

### Produção

```bash
# Build otimizado
npm run build

# Iniciar em produção
NODE_ENV=production npm start
```

---

## 🌐 API Endpoints

### 🔓 Autenticação (Public)

#### Registro de Usuário
```http
POST /plataform/auth/signin
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response (200)**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login
```http
POST /plataform/auth/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response (200)**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com"
  }
}
```

### 🔐 Rotas Protegidas (Requer JWT)

#### Dashboard
```http
GET /plataform/dashboard
Authorization: Bearer {seu_token_jwt}
```

---

## 🔒 Segurança

### ✅ Implementado

- ✔️ **Bcrypt** para hash de senhas (salt rounds: 10)
- ✔️ **JWT** para autenticação stateless
- ✔️ **CORS** configurável por ambiente
- ✔️ **Validação de entrada** em todos os endpoints
- ✔️ **Variáveis de ambiente** para credenciais
- ✔️ **Prepared statements** (SQL injection prevention)

---

## 👨‍💻 Autor

**Pedro da Silveira Thiago**

- GitHub: [@SCO_TClor](https://github.com/SCO-TClor)
- LinkedIn: [Pedro da Silveira Thiago](https://www.linkedin.com/in/pedro-da-silveira-thiago-384222368/)
- Email: scotclor@gmail.com

---

## 🙏 Agradecimentos

- Comunidade Node.js
- Documentação PostgreSQL
- Minha mamãe que sempre acreditou em mim

---

<div align="center">

### ⭐ Se este projeto te ajudou, deixe uma estrela!

**Feito com ❤️ e TypeScript**

</div>