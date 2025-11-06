# 🎵 S. Cecília API - Backend

Este é o repositório do backend (API) do projeto S. Cecília, um sistema completo de gerenciamento de cifras, celebrações e grupos de músicos para paróquias.

Construído com **NestJS**, **Prisma** e **PostgreSQL**, este backend oferece uma API RESTful segura, baseada em permissões (Admin, Coordenador, Músico) e pronta para consumo.

## Funcionalidades Principais

* **Autenticação JWT:** Sistema completo de login (`/auth/login`) e registro (`/auth/register`) com Tokens JWT.
* **Sistema de Permissões (RBAC):**
    * **Admin:** Gerencia o sistema (cria Paróquias, Igrejas, promove Coordenadores).
    * **Coordenador:** Gerencia *sua* Igreja (cria Grupos, convida Músicos, gerencia cifras e celebrações).
    * **Músico:** Usuário final (visualiza cifras e setlists de celebrações).
* **Arquitetura Multi-Tenant:** O sistema é estruturado para suportar múltiplas Comunidades, Paróquias e Igrejas.
* **CRUDs Completos:** Endpoints seguros para Cifras, Categorias, Celebrações (Eventos) e Grupos.
* **Lógica de Negócios:** Endpoints inteligentes para montar setlists, transpor cifras (via JavaScript no frontend) e buscar dados contextuais.

## Tecnologias Utilizadas

* **Framework:** [NestJS](https://nestjs.com/)
* **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/)
* **ORM:** [Prisma](https://www.prisma.io/)
* **Autenticação:** [Passport.js](http://www.passportjs.org/) (com estratégias JWT)
* **Validação:** `class-validator` e `class-transformer`

---

## 🚀 Guia de Instalação (Desenvolvimento)

Siga estes passos para rodar o servidor backend localmente.

### Pré-requisitos

* [Node.js](https://nodejs.org/) (v18 ou superior)
* [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
* Um servidor [PostgreSQL](https://www.postgresql.org/download/) rodando localmente.

### 1. Instalação do Banco de Dados

1.  **Crie seu Banco:** No PostgreSQL (usando DBeaver, pgAdmin, ou psql), crie um novo banco de dados.
    ```sql
    CREATE DATABASE scecilia_db;
    ```
2.  **Configure o `.env`:** Na raiz deste projeto (`scecilia_backend`), renomeie o arquivo `.env.example` (se houver) para `.env`. Se não houver, crie um arquivo `.env` e cole o seguinte:

    ```env
    # Troque 'sua_senha_aqui' e 'scecilia_db' pelos seus dados
    DATABASE_URL="postgresql://postgres:sua_senha_aqui@localhost:5432/scecilia_db"

    # Crie uma chave secreta longa e aleatória para os tokens
    JWT_SECRET="COLOQUE_UMA_CHAVE_SECRETA_MUITO_FORTE_AQUI"
    ```

### 2. Instalação do Projeto

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/scecilia-backend.git](https://github.com/seu-usuario/scecilia-backend.git)
    cd scecilia-backend
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Rode as Migrações + Seed (O "Big Bang"):**
    Este comando irá configurar seu banco de dados com a estrutura correta (schema) e, em seguida, executará o script `prisma/seed.ts` para criar seu usuário **Admin** padrão.

    ```bash
    npx prisma migrate dev
    ```
    *(Nota: Se o `seed` não rodar automaticamente após o `migrate`, rode-o manualmente: `npx prisma db seed`)*

### 3. Rodando o Servidor

1.  Para iniciar o servidor em modo de desenvolvimento (com auto-reload):
    ```bash
    npm run start:dev
    ```
2.  O servidor estará rodando em `http://localhost:3000`.

### 👤 Usuário Admin Padrão (Criado pelo Seed)

Após o `seed` rodar, o sistema terá um usuário Admin pronto:

* **Email:** `admin@scecilia.com`
* **Senha:** `admin123`

Use este usuário para logar no frontend e começar a configurar o sistema (criar Comunidades, Paróquias, Igrejas e promover seu primeiro Coordenador).
