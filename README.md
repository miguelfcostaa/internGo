# InternGO - Aplicação Full-Stack

Uma aplicação full-stack para gestão de estágios, desenvolvida com React (frontend) e Node.js/Express/MongoDB (backend).

## 📁 Estrutura do Projeto

```
internGo/
├── frontend/          # Aplicação React
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── node_modules/
├── backend/           # API Node.js/Express
│   ├── models/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── node_modules/
├── .gitignore
└── README.md
```

## 🚀 Como executar

### Frontend (React)
```bash
cd frontend
npm start
```
- Acesse: http://localhost:3000

### Backend (Node.js/Express)
```bash
cd backend
npm run dev
```
- Acesse: http://localhost:5000

## 🛠 Tecnologias

### Frontend
- React 19.1.0
- React Router DOM
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose

## 📋 Funcionalidades

- ✅ Frontend React com roteamento
- ✅ Backend API RESTful
- ✅ Conexão com MongoDB Atlas
- ✅ CRUD de usuários
- ✅ CORS configurado

## 🔧 Configuração

1. Clone o repositório
2. Instale as dependências do frontend: `cd frontend && npm install`
3. Instale as dependências do backend: `cd backend && npm install`
4. Configure as variáveis de ambiente no `backend/.env`
5. Execute ambos os servidores

## 🌐 APIs Disponíveis

- `GET /` - Status da API
- `GET /api/test` - Teste de conexão
- `GET /api/users` - Listar usuários
- `POST /api/users` - Criar usuário
- `GET /api/users/:id` - Buscar usuário
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário
