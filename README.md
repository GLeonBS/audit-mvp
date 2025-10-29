# Audit MVP

Sistema de auditoria automática para rastreamento de operações de banco de dados com arquitetura híbrida PostgreSQL + MongoDB.

## Sobre o Projeto

Este projeto implementa um sistema de auditoria que monitora automaticamente todas as operações de CRUD em entidades do TypeORM, armazenando logs detalhados em MongoDB. Desenvolvido com NestJS, oferece uma solução escalável para rastreamento de mudanças e compliance.

### Principais Características

- **Auditoria Automática**: Interceptação transparente de operações CREATE, UPDATE e DELETE via TypeORM Subscribers
- **Arquitetura Híbrida**: PostgreSQL para dados operacionais + MongoDB para logs de auditoria
- **Contexto de Requisição**: Rastreamento do usuário que realizou cada operação usando AsyncLocalStorage
- **Autenticação JWT**: Sistema de login e proteção de rotas
- **API RESTful**: Endpoints completos para gerenciamento de usuários e eventos

## Tecnologias

- **Framework**: NestJS 11
- **Linguagem**: TypeScript
- **Bancos de Dados**:
  - PostgreSQL 16 (dados operacionais)
  - MongoDB 7 (logs de auditoria)
- **ORMs**:
  - TypeORM (PostgreSQL)
  - Mongoose (MongoDB)
- **Autenticação**: JWT (@nestjs/jwt)
- **Containerização**: Docker Compose

## Estrutura do Projeto

```
src/
├── modules/
│   ├── audit/          # Sistema de auditoria
│   │   ├── entity/     # Schema Mongoose para logs
│   │   ├── audit.subscriber.ts  # Interceptação de eventos TypeORM
│   │   └── audit.service.ts     # Lógica de persistência
│   ├── auth/           # Autenticação JWT
│   ├── user/           # Gerenciamento de usuários
│   └── event/          # Exemplo de entidade auditada
├── context.middleware.ts    # Middleware de contexto
├── request-context.ts       # AsyncLocalStorage
└── main.ts
```

## Instalação

### Pré-requisitos

- Node.js 18+
- Docker e Docker Compose

### 1. Instalar Dependências

```bash
npm install
```

### 2. Iniciar Bancos de Dados

```bash
docker-compose up -d
```

Isso irá iniciar:
- PostgreSQL na porta `5450`
- MongoDB na porta `28017`

### 3. Executar Aplicação

```bash
# Modo desenvolvimento (com hot-reload)
npm run start:dev

# Modo produção
npm run build
npm run start:prod
```

A aplicação estará disponível em `http://localhost:3000`

## Uso

### Autenticação

#### Criar Novo Usuário
```bash
POST /users
Content-Type: application/json

{
  "username": "admin",
  "password": "senha123"
}
```

#### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "senha123"
}
```

Resposta:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Endpoints Protegidos

Use o token JWT recebido no login:

```bash
# Listar eventos
GET /events
Authorization: Bearer {access_token}

# Criar evento (será auditado)
POST /events
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "Evento de Teste"
}

# Atualizar evento (será auditado)
PUT /events/:id
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "Evento Atualizado"
}

# Deletar evento (será auditado)
DELETE /events/:id
Authorization: Bearer {access_token}
```

### Consultar Logs de Auditoria

Os logs são armazenados automaticamente no MongoDB. Estrutura de um log:

```json
{
  "_id": "...",
  "userId": "uuid-do-usuario",
  "entity": "event",
  "action": "UPDATE",
  "before": {
    "id": "...",
    "name": "Evento de Teste"
  },
  "createdAt": "2025-10-29T12:00:00.000Z",
  "updatedAt": "2025-10-29T12:00:00.000Z"
}
```

## Como Funciona a Auditoria

### 1. Middleware de Contexto
O `context.middleware.ts` captura informações da requisição HTTP (userId, path, method) e armazena em AsyncLocalStorage.

### 2. TypeORM Subscriber
O `audit.subscriber.ts` intercepta eventos do TypeORM:
- `afterInsert`: Quando uma entidade é criada
- `afterUpdate`: Quando uma entidade é atualizada (inclui estado anterior)
- `afterRemove`: Quando uma entidade é deletada (inclui estado anterior)

### 3. Persistência
O `audit.service.ts` salva os logs no MongoDB usando Mongoose.

### 4. Regras de Exclusão
Algumas operações não são auditadas (definidas em `shouldSkipAudit()`):
- Criação de novos usuários (POST /users)

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev        # Inicia com hot-reload
npm run start:debug      # Inicia em modo debug

# Build
npm run build            # Compila o projeto

# Produção
npm run start:prod       # Executa versão compilada

# Testes
npm run test             # Testes unitários
npm run test:e2e         # Testes end-to-end
npm run test:cov         # Cobertura de testes

# Qualidade de Código
npm run lint             # Verifica e corrige problemas
npm run format           # Formata código com Prettier
```

## Configuração de Ambiente

### Banco de Dados PostgreSQL
```typescript
{
  type: 'postgres',
  host: 'localhost',
  port: 5450,
  username: 'postgres',
  password: 'postgres',
  database: 'audit_mvp',
  autoLoadEntities: true,
  synchronize: true  // Desabilitar em produção
}
```

### Banco de Dados MongoDB
```typescript
mongodb://localhost:28017/audit_mvp
```

## Gerenciamento de Containers

```bash
# Iniciar serviços
docker-compose up -d

# Parar serviços
docker-compose down

# Ver logs
docker-compose logs -f

# Remover volumes (CUIDADO: apaga dados)
docker-compose down -v
```

## Possíveis Melhorias

- [ ] Adicionar variáveis de ambiente (.env)
- [ ] Implementar paginação nos endpoints
- [ ] Adicionar filtros de busca nos logs de auditoria
- [ ] Implementar TTL automático para logs antigos
- [ ] Adicionar testes unitários e e2e
- [ ] Configurar CI/CD
- [ ] Documentação Swagger/OpenAPI
- [ ] Implementar rate limiting
- [ ] Adicionar logging estruturado (Winston/Pino)

## License

This project is licensed under the MIT License.
See the [LICENSE](./LICENSE) file for details.

## Autor

Gabriel Leon
