# 🌱 Verdeo

**Verdeo** é um projeto de estudo focado em arquitetura de microserviços utilizando **NestJS**, **Keycloak**, **RabbitMQ** e **monorepo**, com o objetivo de simular um ecossistema moderno de backend escalável e desacoplado.

---

## 📌 Objetivo

O projeto tem como objetivo praticar:

* Arquitetura de **microserviços**
* **Autenticação centralizada** com Keycloak
* Comunicação assíncrona com **RabbitMQ**
* Orquestração com **Saga Pattern**
* Organização em **monorepo**
* Integração entre frontend e múltiplos serviços

---

## 🧱 Arquitetura

A aplicação é composta pelos seguintes serviços:

```
web (Vite + React)
       │
       ▼
api-gateway (NestJS)
       │
       ├── auth-service (Keycloak)
       ├── orders-service
       └── inventory-service

Comunicação assíncrona:
RabbitMQ (event-driven / saga)
```

---

## 🚀 Tecnologias utilizadas

### Backend

* NestJS
* Prisma
* PostgreSQL
* RabbitMQ

### Autenticação

* Keycloak
* JWT (OIDC)

### Frontend

* Vite
* React

### Infra

* Docker + Docker Compose
* Monorepo (workspaces)

---

## 🔐 Autenticação

O projeto utiliza o Keycloak como provedor de identidade.

### Fluxo de autenticação

1. Usuário acessa o frontend
2. Redirecionamento para login no Keycloak
3. Keycloak autentica e retorna um **access token (JWT)**
4. Frontend envia o token para o `api-gateway`
5. Gateway valida ou delega validação ao `auth-service`
6. Requisição segue para os microserviços

### Responsabilidade do `auth-service`

* Validação de token JWT
* Integração com Keycloak
* Obtenção de dados do usuário
* Tradução de roles/permissões

---

## 🔄 Comunicação entre serviços

A comunicação entre microserviços acontece via:

* HTTP (via `api-gateway`)
* Eventos assíncronos com RabbitMQ

---

## 🔁 Saga Pattern

A orquestração de processos distribuídos é feita utilizando o **Saga Pattern**.

### Exemplo de fluxo

1. `orders-service` cria pedido
2. Publica evento: `order.created`
3. `inventory-service` tenta reservar estoque
4. Retorna:

   * `inventory.reserved` → pedido confirmado
   * `inventory.failed` → pedido cancelado (compensação)

---

## 📦 Serviços

### 🔑 auth-service

Responsável por autenticação e identidade:

* Login / validação
* Integração com Keycloak
* Gerenciamento de usuário autenticado

---

### 📦 orders-service

Responsável por pedidos:

* Criação de pedidos
* Início da saga
* Atualização de status

---

### 📦 inventory-service

Responsável por estoque:

* Consulta de disponibilidade
* Reserva de itens
* Liberação em caso de falha

---

### 🌐 api-gateway

Ponto de entrada da aplicação:

* Recebe requisições do frontend
* Valida autenticação
* Encaminha para microserviços

---

## 🐳 Infraestrutura

O projeto utiliza Docker para subir os serviços:

### Serviços disponíveis

* PostgreSQL
* Keycloak
* RabbitMQ

### Subir ambiente

```bash
docker-compose up -d
```

---

## ▶️ Como rodar o projeto

### 1. Instalar dependências

```bash
yarn install
```

### 2. Subir infraestrutura

```bash
docker-compose up -d
```

## 📚 Conceitos aplicados

* Microserviços
* API Gateway
* Saga Pattern
* Event-driven architecture
* Autenticação centralizada
* Monorepo

---

## 🎯 Objetivo educacional

Este projeto não tem foco em produção, mas sim em aprendizado prático de:

* Arquiteturas modernas
* Boas práticas com NestJS
* Integração entre serviços distribuídos

---

## 🧠 Próximos passos

* Implementar cache com Redis
* Adicionar observabilidade (logs + tracing)
* Criar testes e2e
* Implementar circuit breaker
* Adicionar rate limiting no gateway
