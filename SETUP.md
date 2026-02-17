# 🚀 MyFinance - Guia de Configuração

Este guia mostra como configurar o projeto MyFinance em uma nova máquina.

## 📋 Pré-requisitos

Certifique-se de ter instalado:
- ✅ Docker Desktop
- ✅ .NET SDK 8.0+
- ✅ Node.js 18+ e npm
- ✅ Git

---

## 🔧 Configuração Passo a Passo

### 1️⃣ Clonar o Repositório

```bash
git clone https://github.com/paulotakeda1986/myfinance.git
cd myfinance
```

### 2️⃣ Configurar o Banco de Dados (PostgreSQL)

O projeto usa PostgreSQL via Docker. Execute:

```bash
docker-compose up -d db
```

Isso irá:
- Criar container `myfinance-db`
- PostgreSQL na porta **5433**
- Usuário: `admin`
- Senha: `password`
- Database: `myfinance`

**Verificar se está rodando:**
```bash
docker ps
```

### 3️⃣ Configurar o Backend (.NET)

#### a) Navegar para o backend
```bash
cd backend/MyFinance.API
```

#### b) Restaurar dependências
```bash
dotnet restore
```

#### c) Aplicar migrations (criar tabelas)
```bash
dotnet ef database update
```

#### d) Executar o backend
```bash
dotnet run
```

O backend estará disponível em: **http://localhost:8080**

**Testar:** Abra http://localhost:8080/swagger

### 4️⃣ Configurar o Frontend (React)

#### a) Abrir novo terminal e navegar para frontend
```bash
cd frontend
```

#### b) Instalar dependências
```bash
npm install
```

#### c) Executar o frontend
```bash
npm run dev
```

O frontend estará disponível em: **http://localhost:5173**

---

## 🎯 Acessar o Sistema

1. Abra o navegador em: **http://localhost:5173**
2. Faça login ou crie uma conta

---

## 🐳 Executar com Docker (Opcional)

Para rodar tudo com Docker:

```bash
# Na raiz do projeto
docker-compose up -d
```

Isso irá subir:
- PostgreSQL (porta 5433)
- Backend API (porta 8080)

**Nota:** O frontend ainda precisa rodar com `npm run dev` localmente.

---

## 🛠️ Comandos Úteis

### Backend
```bash
# Criar nova migration
dotnet ef migrations add NomeDaMigration

# Aplicar migrations
dotnet ef database update

# Reverter migration
dotnet ef database update NomeMigrationAnterior

# Build
dotnet build

# Publicar
dotnet publish -c Release
```

### Frontend
```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Lint
npm run lint
```

### Docker
```bash
# Subir todos os serviços
docker-compose up -d

# Parar todos os serviços
docker-compose down

# Ver logs
docker-compose logs -f

# Rebuild
docker-compose up -d --build

# Limpar volumes (CUIDADO: apaga dados)
docker-compose down -v
```

---

## 📁 Estrutura do Projeto

```
myfinance/
├── backend/
│   └── MyFinance.API/
│       ├── Controllers/      # Endpoints da API
│       ├── Models/           # Entidades do banco
│       ├── Services/         # Lógica de negócio
│       ├── Repositories/     # Acesso a dados
│       ├── DTOs/             # Data Transfer Objects
│       └── Data/             # Configuração do EF Core
├── frontend/
│   └── src/
│       ├── components/       # Componentes React
│       ├── pages/            # Páginas da aplicação
│       ├── services/         # Chamadas à API
│       ├── context/          # Context API (Auth, Theme)
│       └── hooks/            # Custom hooks
└── docker-compose.yml        # Configuração Docker
```

---

## 🔑 Variáveis de Ambiente

### Backend (`appsettings.json`)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=myfinance;Username=admin;Password=password;Port=5433"
  }
}
```

### Frontend (`.env` - criar se necessário)
```env
VITE_API_URL=http://localhost:8080
```

---

## 🐛 Troubleshooting

### Erro: Porta já em uso
```bash
# Verificar processos na porta 5433 (PostgreSQL)
netstat -ano | findstr :5433

# Verificar processos na porta 8080 (Backend)
netstat -ano | findstr :8080

# Matar processo (substitua PID)
taskkill /PID <PID> /F
```

### Erro: Migrations não aplicadas
```bash
cd backend/MyFinance.API
dotnet ef database update
```

### Erro: Dependências do frontend
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Erro: Docker não conecta
```bash
# Reiniciar Docker Desktop
# Ou recriar containers
docker-compose down
docker-compose up -d
```

---

## ✅ Checklist de Configuração

- [ ] Docker Desktop rodando
- [ ] Repositório clonado
- [ ] Container PostgreSQL criado (`docker-compose up -d db`)
- [ ] Backend: dependências restauradas (`dotnet restore`)
- [ ] Backend: migrations aplicadas (`dotnet ef database update`)
- [ ] Backend rodando (`dotnet run`) em http://localhost:8080
- [ ] Frontend: dependências instaladas (`npm install`)
- [ ] Frontend rodando (`npm run dev`) em http://localhost:5173
- [ ] Sistema acessível no navegador

---

## 📞 Suporte

Se encontrar problemas, verifique:
1. Logs do Docker: `docker-compose logs -f`
2. Logs do Backend: console onde rodou `dotnet run`
3. Logs do Frontend: console onde rodou `npm run dev`

---

**Pronto! 🎉** Seu ambiente está configurado e pronto para desenvolvimento!
