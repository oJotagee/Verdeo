# Verdeo

Projeto de estudo de arquitetura de microserviços com NestJS e Next.js. Simula um ecossistema moderno de backend escalável com frontend desacoplado, cobrindo comunicação síncrona e assíncrona, autenticação centralizada e consistência eventual.

## Repositório

```
Verdeo/
├── api/    # Monorepo NestJS (microserviços)
└── web/    # Aplicação Next.js (em desenvolvimento)
```

---

## API (`api/`)

Monorepo NestJS com múltiplos microserviços independentes gerenciados pelo NestJS CLI Monorepo Mode e Yarn Workspaces.

### Serviços

| Serviço | Descrição |
|---|---|
| `bff` | Backend for Frontend — entrada HTTP do cliente web |
| `auth-api` | Autenticação e validação de JWT |
| `user-api` | Gerenciamento de usuários |
| `order-api` | Pedidos e orquestração da saga |
| `stock-api` | Controle de estoque |
| `audit-consumer` | Consumer RabbitMQ para auditoria |

### Libs internas

| Lib | Responsabilidade |
|---|---|
| `core-cqrs` | Interfaces de Command, Query e handlers |
| `core-domain` | AggregateRoot, Entity e ValueObject base |
| `core-events` | Contratos dos eventos de domínio |
| `core-resilience` | Circuit breaker e retry com `opossum` |
| `core-saga` | Orquestrador de sagas com compensações |
| `core-shared` | Guards, decorators, pipes e filtros reutilizáveis |

### Stack

- **NestJS 11** + TypeScript
- **Prisma 7** (PostgreSQL) + **Mongoose** (MongoDB)
- **RabbitMQ** — comunicação assíncrona e event-driven
- **Redis** — cache via `ioredis`
- **JWT** — autenticação stateless
- **opossum** — circuit breaker
- **neverthrow** — tratamento explícito de erros (Result type)
- **Jest** + **Testcontainers** — testes unitários e E2E

### Rodar a API

```bash
cd api
yarn install
docker-compose up -d        # PostgreSQL, MongoDB, RabbitMQ, Redis
yarn prisma:generate
yarn prisma:migrate
yarn start:dev              # sobe todos os serviços em paralelo
```

> Veja [api/README.md](api/README.md) para documentação completa da API.

---

## Web (`web/`)

Frontend em desenvolvimento. Será implementado com **Next.js** e consumirá o BFF da API.

### Stack planejada

- **Next.js** (App Router)
- **TypeScript**
- Autenticação via JWT integrada ao `auth-api`
- Comunicação exclusiva com o `bff`

### Estrutura planejada

```
web/
├── app/          # App Router do Next.js
├── components/   # Componentes React reutilizáveis
├── lib/          # Utilitários, hooks e clientes HTTP
└── ...
```

---

## Arquitetura

```
  [web — Next.js]
        │  HTTP
        ▼
  [bff — NestJS]
        │
        ├── [auth-api]   — JWT / autenticação
        ├── [user-api]   — usuários
        ├── [order-api]  — pedidos
        └── [stock-api]  — estoque

  Comunicação assíncrona:
  [order-api] ──▶ RabbitMQ ──▶ [stock-api]
                      │
                      └──▶ [audit-consumer]
```

### Saga: criação de pedido

```
order-api cria pedido
    │ publica order.created
    ▼
stock-api tenta reservar estoque
    ├── inventory.reserved  → pedido confirmado
    └── inventory.failed    → compensação (pedido cancelado)
```

---

## Padrões aplicados

- **Hexagonal Architecture** — domínio isolado de infra e transporte
- **CQRS** — separação de leitura e escrita
- **Saga Pattern** — consistência eventual em transações distribuídas
- **Event-driven Architecture** — comunicação assíncrona via RabbitMQ
- **BFF Pattern** — Backend for Frontend dedicado ao cliente web
- **Result type** — tratamento explícito de erros sem exceções

---

## Pré-requisitos

- Node.js 20+
- Yarn
- Docker + Docker Compose

---

## Objetivo educacional

Estudo prático de arquiteturas modernas de software, cobrindo:

- Microserviços com NestJS em monorepo
- Comunicação síncrona (HTTP) e assíncrona (RabbitMQ)
- Consistência eventual com Saga Pattern
- Autenticação stateless com JWT
- Resiliência com circuit breaker
- Frontend desacoplado com Next.js
