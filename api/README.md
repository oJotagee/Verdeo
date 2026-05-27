# Verdeo — API

Monorepo NestJS com arquitetura de microserviços para o backend do Verdeo. Organizado com workspaces Yarn e NestJS CLI Monorepo Mode.

## Estrutura

```
api/
├── apps/
│   ├── bff/              # Backend for Frontend — entrada HTTP para o web
│   ├── auth-api/         # Autenticação e validação de JWT
│   ├── user-api/         # Gerenciamento de usuários
│   ├── order-api/        # Pedidos e orquestração de saga
│   ├── stock-api/        # Controle de estoque
│   └── audit-consumer/   # Consumer RabbitMQ para auditoria
└── libs/
    ├── core-cqrs/        # Abstrações de Command/Query
    ├── core-domain/      # Entidades e value objects base
    ├── core-events/      # Contratos de eventos de domínio
    ├── core-resilience/  # Circuit breaker (opossum), retry
    ├── core-saga/        # Orquestração de sagas distribuídas
    └── core-shared/      # Utilitários e helpers compartilhados
```

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Framework | NestJS 11 + TypeScript |
| ORM | Prisma 7 (PostgreSQL) |
| Banco NoSQL | Mongoose (MongoDB) |
| Mensageria | RabbitMQ via `@nestjs/microservices` + `amqplib` |
| Cache | Redis via `ioredis` |
| Auth | JWT (`@nestjs/jwt`) + bcryptjs |
| Resiliência | Circuit breaker com `opossum` |
| Padrão de erro | `neverthrow` (Result type) |
| Testes | Jest + Testcontainers |
| Docs HTTP | Swagger (`@nestjs/swagger`) |
| Observabilidade | Pino + pino-pretty |

## Pré-requisitos

- Node.js 20+
- Yarn
- Docker + Docker Compose

## Instalação

```bash
yarn install
```

## Infraestrutura

Suba PostgreSQL, MongoDB, RabbitMQ e Redis com:

```bash
docker-compose up -d
```

## Banco de dados

```bash
# Gerar client do Prisma
yarn prisma:generate

# Criar/executar migrations
yarn prisma:migrate

# Popular dados base
yarn prisma:seed

# Popular apenas dados core (sem fixtures de teste)
yarn seed:core
```

## Rodando os serviços

Todos os serviços em paralelo:

```bash
yarn start:dev
```

Serviço individual:

```bash
yarn start:dev:bff
yarn start:dev:auth
yarn start:dev:user
yarn start:dev:stock
yarn start:dev:order
yarn start:dev:audit
```

## Testes

```bash
# Unitários
yarn test

# Cobertura
yarn test:cov

# E2E (requer Docker para Testcontainers)
yarn test:e2e
```

## Serviços

### BFF (`apps/bff`)

Backend for Frontend. Ponto de entrada HTTP para o cliente web. Responsável por agregar respostas e repassar requisições autenticadas aos microserviços internos.

### auth-api (`apps/auth-api`)

Validação de tokens JWT e autenticação. Expõe endpoints de login/logout e fornece guards de autorização consumidos pelo BFF.

### user-api (`apps/user-api`)

CRUD e gerenciamento de perfil de usuários. Persiste em PostgreSQL via Prisma.

### order-api (`apps/order-api`)

Criação e gestão de pedidos. Inicia a saga `order.created → inventory.reserved/failed` publicando eventos no RabbitMQ.

### stock-api (`apps/stock-api`)

Controle de estoque. Consome eventos do RabbitMQ para reservar ou liberar itens e responde ao fluxo de saga do `order-api`.

### audit-consumer (`apps/audit-consumer`)

Consumer dedicado ao RabbitMQ para persistir logs de auditoria de todas as operações críticas do sistema.

## Libs compartilhadas

| Lib | Responsabilidade |
|---|---|
| `core-cqrs` | Interfaces base de Command, Query e seus handlers |
| `core-domain` | AggregateRoot, Entity, ValueObject base |
| `core-events` | Contratos dos eventos de domínio publicados no broker |
| `core-resilience` | Circuit breaker e retry wrapper com `opossum` |
| `core-saga` | Orquestrador de sagas com compensações |
| `core-shared` | Guards, decorators, pipes e filtros reutilizáveis |

## Padrões arquiteturais

- **Hexagonal Architecture** — domínio isolado de infra e transporte
- **CQRS** — separação de leitura e escrita via `@nestjs/cqrs`
- **Saga Pattern** — consistência eventual em transações distribuídas
- **Event-driven** — comunicação assíncrona via RabbitMQ
- **Result type** — tratamento explícito de erros com `neverthrow`
