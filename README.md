# Frontend — Projeto IRR

## Visão Geral

O frontend do Projeto IRR é responsável pela interface da aplicação, permitindo a interação do usuário com o sistema de controle e acompanhamento de entradas e saídas de materiais.

A aplicação consome uma API REST desenvolvida em Spring Boot, sendo responsável por exibir dados, permitir operações de cadastro e consulta, e facilitar a navegação entre os diferentes módulos do sistema.

Este projeto também tem como objetivo servir como ambiente de aprendizado e desenvolvimento para os membros da equipe.

---

## Objetivo

O frontend tem como principais objetivos:

- Exibir informações do sistema de forma clara e organizada
- Permitir interação com os dados através de operações de cadastro e consulta
- Facilitar a visualização de entradas e saídas de materiais
- Integrar com o backend por meio de requisições HTTP

---

## Tecnologias Utilizadas

- React
- TypeScript
- Vite
- React Router
- Axios ou Fetch API
- CSS ou outra abordagem de estilização utilizada no projeto

---

## Estrutura do Projeto

A aplicação segue uma estrutura baseada em separação de responsabilidades:

```
src/
│
├── components/       # Componentes reutilizáveis da interface
├── pages/            # Páginas da aplicação
├── services/         # Comunicação com a API (requisições HTTP)
├── routes/           # Configuração de rotas da aplicação
├── hooks/            # Hooks customizados (se aplicável)
├── utils/            # Funções utilitárias
├── assets/           # Imagens, ícones e arquivos estáticos
└── main.tsx          # Ponto de entrada da aplicação
```

---

## Como Executar o Projeto

### Pré-requisitos

- Node.js instalado
- npm ou yarn

---

### Instalação

```bash
npm install
```

ou

```bash
yarn install
```

---

### Execução

```bash
npm run dev
```

ou

```bash
yarn dev
```

A aplicação será iniciada em:

```
http://localhost:5173
```

---

## Integração com o Backend

O frontend se comunica com o backend através de uma API REST.

As requisições são realizadas via HTTP, utilizando Axios ou Fetch.

Exemplos de endpoints:

```
GET /usuarios
POST /doacoes
GET /materialEntrada
GET /materialSaida
```

A configuração da URL base da API deve ser definida nos arquivos de serviço:

```ts
const API_URL = "http://localhost:8080";
```

---

## Funcionalidades

O sistema contempla funcionalidades como:

- Autenticação de usuários
- Cadastro e listagem de dados
- Registro de entradas de materiais
- Registro de saídas de materiais
- Visualização de informações do sistema
- Navegação entre módulos

---

## Boas Práticas

- Manter componentes reutilizáveis na pasta `components`
- Centralizar chamadas de API em `services`
- Evitar lógica de negócio dentro de componentes visuais
- Seguir padronização de código e nomenclatura
- Criar componentes pequenos e reutilizáveis

---

## Observações

> Este projeto está em fase de desenvolvimento e pode sofrer alterações ao longo do tempo.  
> A integração com o backend pode estar incompleta ou em evolução.

---

## Contribuição

Para contribuir com o projeto:

1. Criar uma branch para a funcionalidade ou correção  
2. Desenvolver a alteração proposta  
3. Realizar commits claros e organizados  
4. Abrir um Pull Request para revisão  

---

## Projeto IRR

Este frontend faz parte do Projeto IRR, desenvolvido pela Code JR, com foco em aprendizado, organização e evolução contínua dos membros da equipe.