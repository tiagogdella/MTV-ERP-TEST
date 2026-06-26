# MTV ERP — Roadmap de Desenvolvimento

> Sistema ERP web para indústria de beneficiamento de arroz.
> Desenvolvido em etapas por um único desenvolvedor.
> Marque os itens conforme avançar.

---

## Índice

- [Fase 0 — Preparação do Projeto](#fase-0--preparação-do-projeto)
- [Fase 1 — Arquitetura Base](#fase-1--arquitetura-base)
- [Fase 2 — Autenticação](#fase-2--autenticação)
- [Fase 3 — Cadastros Essenciais](#fase-3--cadastros-essenciais)
- [Fase 4 — Estoque e Lotes](#fase-4--estoque-e-lotes)
- [Fase 5 — Compras](#fase-5--compras)
- [Fase 6 — Produção e Beneficiamento](#fase-6--produção-e-beneficiamento)
- [Fase 7 — Vendas e Expedição](#fase-7--vendas-e-expedição)
- [Fase 8 — Financeiro](#fase-8--financeiro)
- [Fase 9 — Dashboard e Relatórios MVP](#fase-9--dashboard-e-relatórios-mvp)
- [MVP — Definição e Critérios](#mvp--definição-e-critérios)
- [v1.1 — Qualidade e Estabilidade](#v11--qualidade-e-estabilidade)
- [v1.2 — Rastreabilidade e Auditoria](#v12--rastreabilidade-e-auditoria)
- [v1.3 — Fiscal e Integração NF-e](#v13--fiscal-e-integração-nf-e)
- [v2.0 — Módulos Avançados](#v20--módulos-avançados)
- [v3.0 — Inteligência e Automação](#v30--inteligência-e-automação)
- [Entidades do Banco de Dados](#entidades-do-banco-de-dados)
- [Padrões e Convenções](#padrões-e-convenções)

---

## Fase 0 — Preparação do Projeto

> Objetivo: ambiente 100% funcional antes de escrever qualquer lógica de negócio.

### Repositório e Versionamento

- [ ] Criar repositório no GitHub (`MTV-ERP`)
- [ ] Criar `.gitignore` adequado (Node, Vue, `.env`, `dist/`, `node_modules/`)
- [ ] Definir estratégia de branches (`main` = produção, `develop` = desenvolvimento, `feature/*`)
- [ ] Criar commit inicial com estrutura de pastas vazia
- [ ] Configurar proteção de branch `main` no GitHub

### Estrutura de Pastas do Monorepo

```
mtv-erp/
├── apps/
│   ├── web/          ← frontend Vue 3
│   └── api/          ← backend Express
├── packages/
│   └── shared/       ← tipos e DTOs compartilhados
├── docker/
├── docker-compose.yml
├── docker-compose.dev.yml
├── .env.example
└── TODO.md
```

- [ ] Criar estrutura de pastas do monorepo
- [ ] Criar `README.md` raiz com visão geral do projeto

### Docker e Ambiente

- [ ] Criar `docker-compose.yml` para produção
- [ ] Criar `docker-compose.dev.yml` para desenvolvimento (com hot-reload)
- [ ] Configurar serviço `postgres` no Compose (volume persistente)
- [ ] Configurar serviço `pgadmin` no Compose (acesso dev)
- [ ] Configurar serviço `api` no Compose
- [ ] Configurar serviço `web` no Compose
- [ ] Criar `Dockerfile` para o backend (multi-stage: build + runtime)
- [ ] Criar `Dockerfile` para o frontend (multi-stage: build + nginx)
- [ ] Criar `.dockerignore` para backend e frontend
- [ ] Testar `docker-compose up` e verificar que todos os serviços sobem
- [ ] Criar script `dev.sh` para iniciar ambiente de desenvolvimento

### Variáveis de Ambiente

- [ ] Criar `.env.example` com todas as variáveis necessárias documentadas
- [ ] Criar `.env.dev` para desenvolvimento (não versionar)
- [ ] Definir variáveis: `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `PORT`, `NODE_ENV`, `CORS_ORIGIN`
- [ ] Configurar validação de variáveis de ambiente no startup da API (`zod` ou `envalid`)

---

## Fase 1 — Arquitetura Base

> Objetivo: fundação sólida de código antes das funcionalidades.

### Backend — Setup Inicial

- [ ] Inicializar projeto Node.js com TypeScript (`apps/api`)
- [ ] Configurar `tsconfig.json` (strict mode, paths aliases `@/`)
- [ ] Instalar dependências: `express`, `cors`, `helmet`, `morgan`, `dotenv`, `zod`
- [ ] Instalar devDependencies: `typescript`, `ts-node-dev`, `@types/express`, `@types/node`
- [ ] Configurar ESLint + Prettier para o backend
- [ ] Criar script `dev` com `ts-node-dev` (hot-reload)
- [ ] Criar script `build` e `start` para produção

### Backend — Estrutura de Pastas (Clean Architecture adaptada)

```
apps/api/src/
├── config/           ← variáveis de ambiente, constantes
├── database/         ← cliente Prisma, seeds, migrations
├── modules/          ← cada módulo do ERP
│   └── auth/
│       ├── auth.controller.ts
│       ├── auth.service.ts
│       ├── auth.repository.ts
│       ├── auth.routes.ts
│       ├── auth.dto.ts
│       └── auth.schema.ts
├── shared/
│   ├── middlewares/
│   ├── errors/
│   ├── utils/
│   └── types/
├── app.ts            ← configuração do Express
└── server.ts         ← entry point
```

- [ ] Criar estrutura de pastas do backend
- [ ] Criar `app.ts` com middlewares globais (cors, helmet, morgan, json parser)
- [ ] Criar `server.ts` com inicialização do servidor
- [ ] Criar rota de health check `GET /health`

### Backend — Tratamento de Erros

- [ ] Criar classe `AppError` (erro controlado da aplicação)
- [ ] Criar classes específicas: `NotFoundError`, `ValidationError`, `UnauthorizedError`, `ForbiddenError`, `ConflictError`
- [ ] Criar middleware `errorHandler` global (captura todos os erros)
- [ ] Criar middleware `notFound` para rotas inexistentes
- [ ] Padronizar formato de resposta de erro: `{ error: { code, message, details? } }`
- [ ] Padronizar formato de resposta de sucesso: `{ data: ..., meta?: { page, total } }`

### Backend — Prisma ORM

- [ ] Instalar Prisma: `prisma`, `@prisma/client`
- [ ] Executar `npx prisma init` e configurar `schema.prisma`
- [ ] Configurar provider `postgresql`
- [ ] Criar cliente Prisma singleton (`database/prisma.ts`)
- [ ] Configurar `prisma generate` no script de build
- [ ] Criar pasta `database/migrations/` (gerenciada pelo Prisma)
- [ ] Criar pasta `database/seeds/` com seed inicial (usuário admin)

### Backend — Middlewares Compartilhados

- [ ] Criar middleware `authenticate` (valida JWT, injeta `req.user`)
- [ ] Criar middleware `authorize(roles[])` (verifica permissões)
- [ ] Criar middleware `validate(schema)` (valida body/query/params com Zod)
- [ ] Criar middleware `paginate` (extrai `page` e `limit` da query)
- [ ] Criar middleware `requestLogger` (loga todas as requisições)
- [ ] Criar middleware `rateLimiter` para rotas de autenticação

### Backend — Utilitários

- [ ] Criar utilitário de paginação (`buildPaginationMeta`, `buildPaginationQuery`)
- [ ] Criar utilitário de hash de senha (`bcrypt`)
- [ ] Criar utilitário de geração e validação de JWT
- [ ] Criar utilitário de formatação de datas (`date-fns`)
- [ ] Criar utilitário de geração de códigos únicos (pedidos, lotes, etc.)
- [ ] Criar utilitário de logger estruturado (`winston` ou `pino`)

### Frontend — Setup Inicial

- [ ] Inicializar projeto Vite + Vue 3 + TypeScript (`apps/web`)
- [ ] Configurar `tsconfig.json` com path aliases (`@/`)
- [ ] Configurar `vite.config.ts` com alias e proxy para API
- [ ] Instalar e configurar TailwindCSS + `autoprefixer`
- [ ] Instalar Vue Router 4 e configurar `router/index.ts`
- [ ] Instalar Pinia e configurar `stores/index.ts`
- [ ] Instalar `axios` e criar instância configurada (`services/api.ts`)
- [ ] Configurar interceptor de request (adiciona JWT ao header)
- [ ] Configurar interceptor de response (trata erros globais, refresh token)
- [ ] Instalar ESLint + Prettier para o frontend
- [ ] Configurar `@vueuse/core` (composables utilitários)

### Frontend — Estrutura de Pastas

```
apps/web/src/
├── assets/           ← imagens, fontes
├── components/
│   ├── ui/           ← componentes base (Button, Input, Modal...)
│   └── shared/       ← componentes de negócio reutilizáveis
├── composables/      ← lógica reutilizável (useTable, useForm, useApi...)
├── layouts/
│   ├── AuthLayout.vue
│   └── AppLayout.vue
├── modules/          ← espelha os módulos do backend
│   └── auth/
│       ├── views/
│       ├── components/
│       └── store/
├── router/
├── services/         ← chamadas à API organizadas por módulo
├── stores/           ← Pinia stores globais
├── styles/           ← CSS global, variáveis Tailwind
└── types/            ← tipos TypeScript
```

- [ ] Criar estrutura de pastas do frontend

### Frontend — Layout Principal

- [ ] Criar `AuthLayout.vue` (tela limpa para login/cadastro)
- [ ] Criar `AppLayout.vue` (sidebar + navbar + área de conteúdo)
- [ ] Criar `Sidebar.vue` com links de navegação e ícones
- [ ] Criar `Navbar.vue` com breadcrumb, nome do usuário, botão logout
- [ ] Criar `Breadcrumb.vue` gerado automaticamente pela rota
- [ ] Criar sistema de tema claro/escuro (toggle + persistência no localStorage)
- [ ] Criar página `NotFound.vue` (404)
- [ ] Criar página `Forbidden.vue` (403)

### Frontend — Componentes UI Base

- [ ] `Button.vue` (variantes: primary, secondary, danger, ghost; tamanhos; loading state)
- [ ] `Input.vue` (com label, erro, ícone, máscara)
- [ ] `Select.vue` (com busca, opções agrupadas)
- [ ] `Textarea.vue`
- [ ] `Checkbox.vue` e `Radio.vue`
- [ ] `Badge.vue` (status coloridos)
- [ ] `Modal.vue` (com slot de header, body, footer; tamanhos)
- [ ] `Drawer.vue` (painel lateral deslizante)
- [ ] `Tooltip.vue`
- [ ] `Toast.vue` / sistema de notificações (`useToast`)
- [ ] `Spinner.vue` / `LoadingOverlay.vue`
- [ ] `EmptyState.vue` (quando lista está vazia)
- [ ] `ConfirmDialog.vue` (confirmação de exclusão)
- [ ] `Card.vue`
- [ ] `Divider.vue`
- [ ] `Avatar.vue`

### Frontend — Componentes de Dados

- [ ] `DataTable.vue` (colunas configuráveis, loading, paginação integrada, seleção de linhas)
- [ ] `Pagination.vue` (anterior/próximo, páginas, itens por página)
- [ ] `SearchInput.vue` (com debounce)
- [ ] `FilterBar.vue` (filtros colapsáveis)
- [ ] `SortableHeader.vue` (ordenação por coluna)
- [ ] `FormSection.vue` (agrupa campos do formulário com título)
- [ ] `PageHeader.vue` (título + breadcrumb + ações)

### Frontend — Composables Base

- [ ] `useApi(endpoint)` — wrapper para chamadas HTTP com loading/error
- [ ] `useTable(fetchFn)` — gerencia paginação, filtros, ordenação
- [ ] `useForm(schema)` — gerencia estado, validação e submit de formulários
- [ ] `useConfirm()` — abre ConfirmDialog e retorna Promise
- [ ] `useToast()` — exibe notificações
- [ ] `useAuth()` — acesso ao estado de autenticação
- [ ] `usePermission(permission)` — verifica se usuário tem permissão

### Pacote Shared (tipos compartilhados)

- [ ] Criar pacote `packages/shared` com tipos TypeScript
- [ ] Exportar interfaces de DTOs compartilhados entre frontend e backend
- [ ] Exportar enums compartilhados (`Role`, `Status`, `TipoMovimentacao`, etc.)
- [ ] Configurar como workspace package no monorepo

---

## Fase 2 — Autenticação

> Objetivo: sistema de login seguro com controle de sessão.

### Backend — Auth

- [ ] Criar entidade `Usuario` no schema Prisma (id, nome, email, senha, role, ativo, timestamps)
- [ ] Criar migration inicial
- [ ] Criar `AuthRepository` (busca por email, busca por id)
- [ ] Criar `AuthService` com métodos: `login`, `logout`, `refreshToken`, `me`
- [ ] Criar `AuthController` com handlers HTTP
- [ ] Criar rotas: `POST /auth/login`, `POST /auth/logout`, `POST /auth/refresh`, `GET /auth/me`
- [ ] Implementar geração de `accessToken` (expiração curta: 15min)
- [ ] Implementar geração de `refreshToken` (expiração longa: 7 dias)
- [ ] Salvar `refreshToken` no banco (tabela `RefreshToken` com userId, token, expiresAt, revogado)
- [ ] Criar migration para `RefreshToken`
- [ ] Implementar revogação de refresh token no logout
- [ ] Implementar limpeza de refresh tokens expirados
- [ ] Criar seed com usuário admin padrão
- [ ] Aplicar rate limiting no `POST /auth/login` (máx 10 tentativas/min por IP)
- [ ] Logar tentativas de login (sucesso e falha)

### Frontend — Auth

- [ ] Criar `authStore` (Pinia) com: `user`, `accessToken`, `isAuthenticated`, `isLoading`
- [ ] Criar actions: `login(email, password)`, `logout()`, `refreshToken()`, `fetchMe()`
- [ ] Persistir `accessToken` em memória (não localStorage por segurança)
- [ ] Persistir `refreshToken` em `httpOnly cookie` (backend deve setar)
- [ ] Criar `LoginView.vue` com formulário validado
- [ ] Criar guard de rota `requiresAuth` (redireciona para login se não autenticado)
- [ ] Criar guard de rota `requiresGuest` (redireciona para dashboard se já logado)
- [ ] Implementar renovação automática de token no interceptor do Axios
- [ ] Implementar fila de requests durante refresh (evita múltiplos refreshes simultâneos)
- [ ] Criar página de `ForgotPassword.vue` (estrutura, integração futura)
- [ ] Tratar expiração de sessão: exibir modal "Sessão expirada, faça login novamente"

---

## Fase 3 — Cadastros Essenciais

> Objetivo: cadastrar as entidades base que os demais módulos dependem.

### Backend — Padrão de Módulo CRUD

Para cada módulo abaixo, seguir o padrão:
- `module.schema.ts` — schemas Zod de validação
- `module.dto.ts` — tipos de entrada/saída
- `module.repository.ts` — acesso ao banco (Prisma)
- `module.service.ts` — regras de negócio
- `module.controller.ts` — handlers HTTP
- `module.routes.ts` — definição de rotas

### Empresa

- [ ] Criar entidade `Empresa` (id, razaoSocial, nomeFantasia, cnpj, ie, telefone, email, logo, ativo, timestamps)
- [ ] Criar migration
- [ ] Implementar CRUD completo (`GET /empresas`, `POST`, `PUT /:id`, `DELETE /:id`, `GET /:id`)
- [ ] Validar CNPJ único
- [ ] Upload de logo (armazenamento local ou S3 futuramente)

### Filial

- [ ] Criar entidade `Filial` (id, empresaId, nome, cnpj, ie, endereco, telefone, ativo, timestamps)
- [ ] Criar migration
- [ ] Implementar CRUD completo
- [ ] Associar filial à empresa
- [ ] Validar que usuário pertence à empresa correta

### Usuários e Permissões

- [ ] Criar entidades `Perfil` / `Role` (id, nome, descricao)
- [ ] Criar entidade `Permissao` (id, chave, descricao, modulo)
- [ ] Criar tabela pivô `PerfilPermissao`
- [ ] Criar tabela pivô `UsuarioPerfil`
- [ ] Implementar seed com perfis padrão: `ADMIN`, `GERENTE`, `OPERADOR`, `FINANCEIRO`
- [ ] Implementar seed com permissões por módulo (ex: `clientes:criar`, `clientes:editar`, etc.)
- [ ] Criar CRUD de usuários (`GET /usuarios`, `POST`, `PUT /:id`, `DELETE /:id`)
- [ ] Criar endpoint para alterar senha do próprio usuário
- [ ] Criar CRUD de perfis com associação de permissões
- [ ] Atualizar middleware `authorize` para verificar permissões do banco
- [ ] Proteger todos os endpoints com `authenticate` e `authorize`

### Clientes

- [ ] Criar entidade `Cliente` (id, tipo: PF/PJ, nome/razaoSocial, cpf/cnpj, ie, rg, email, telefone, celular, ativo, timestamps)
- [ ] Criar entidade `EnderecoCliente` (id, clienteId, cep, logradouro, numero, complemento, bairro, cidade, estado, principal)
- [ ] Criar entidade `ContatoCliente` (id, clienteId, nome, cargo, email, telefone)
- [ ] Criar migrations
- [ ] Implementar CRUD completo de clientes
- [ ] Implementar CRUD de endereços e contatos (nested)
- [ ] Busca por nome, CPF/CNPJ, cidade
- [ ] Busca de CEP automática (ViaCEP)
- [ ] Importação de clientes via CSV (estrutura futura)

### Fornecedores

- [ ] Criar entidade `Fornecedor` (estrutura similar a Cliente + categoria: arroz/embalagem/serviço/outros)
- [ ] Criar entidade `EnderecoFornecedor`
- [ ] Criar entidade `ContatoFornecedor`
- [ ] Criar migrations
- [ ] Implementar CRUD completo
- [ ] Campo `prazoEntregaDias` e `observacoes`

### Unidades de Medida

- [ ] Criar entidade `UnidadeMedida` (id, nome, sigla, tipo: PESO/VOLUME/UNIDADE/COMPRIMENTO, ativo)
- [ ] Criar migration
- [ ] Implementar CRUD
- [ ] Criar seed com unidades padrão: KG, TON, SC (saco), UN, M, L, G

### Embalagens

- [ ] Criar entidade `Embalagem` (id, descricao, capacidade, unidadeMedidaId, material, ativo, timestamps)
- [ ] Criar migration
- [ ] Implementar CRUD
- [ ] Exemplos: "Saco 50kg", "Saco 25kg", "Caixa 10kg"

### Produtos

- [ ] Criar entidade `Produto` (id, codigo, nome, descricao, tipo: MATERIA_PRIMA/PRODUTO_ACABADO/EMBALAGEM/INSUMO, unidadeMedidaId, embalagemId, pesoLiquido, pesoBruto, estoqueMinimo, estoqueMaximo, ativo, timestamps)
- [ ] Criar entidade `CategoriaProduto` (id, nome, descricao)
- [ ] Criar migration
- [ ] Implementar CRUD completo de produtos
- [ ] Implementar CRUD de categorias
- [ ] Geração automática de código de produto
- [ ] Upload de imagem do produto
- [ ] Campos específicos para arroz: variedade, tipo (longo fino, agulhinha, etc.), classificação
- [ ] Busca por código, nome, categoria

### Frontend — Cadastros

Para cada entidade acima, criar:

- [ ] `ListView.vue` com DataTable, filtros e paginação
- [ ] `FormView.vue` (criação e edição no mesmo componente)
- [ ] `DetailView.vue` (visualização completa)
- [ ] Service de API correspondente (`clienteService.ts`, etc.)
- [ ] Store Pinia se necessário para cache local
- [ ] Rotas no Vue Router com lazy loading
- [ ] Links no Sidebar agrupados por seção

---

## Fase 4 — Estoque e Lotes

> Objetivo: controle completo de estoque com rastreabilidade por lote.

### Backend — Estoque

- [ ] Criar entidade `Estoque` (id, produtoId, filialId, saldo, unidadeMedidaId, updatedAt)
- [ ] Criar entidade `Lote` (id, codigo, produtoId, fornecedorId, dataEntrada, dataVencimento, quantidadeInicial, saldoAtual, status: ATIVO/ESGOTADO/BLOQUEADO, observacoes, timestamps)
- [ ] Criar entidade `MovimentacaoEstoque` (id, tipo: ENTRADA/SAIDA/TRANSFERENCIA/AJUSTE/PERDA, produtoId, loteId, filialId, quantidade, saldoAnterior, saldoApos, documentoOrigem, documentoOrigemId, responsavelId, observacoes, timestamps)
- [ ] Criar migrations
- [ ] Criar `EstoqueService` com métodos: `entrar`, `sair`, `transferir`, `ajustar`, `getSaldo`, `getSaldoPorLote`
- [ ] Garantir atomicidade nas movimentações (transaction do Prisma)
- [ ] Não permitir saldo negativo (validação no service)
- [ ] Criar endpoints: `GET /estoque`, `GET /estoque/:produtoId`, `GET /estoque/saldo/:produtoId/filial/:filialId`
- [ ] Criar endpoints de movimentação: `POST /movimentacoes`, `GET /movimentacoes`, `GET /movimentacoes/:id`
- [ ] Criar endpoint de ajuste de estoque (com justificativa obrigatória)
- [ ] Criar endpoint de transferência entre filiais
- [ ] Criar endpoint de consulta de extrato por produto/lote

### Lotes

- [ ] Geração automática de código de lote (ex: `LOT-2025-0001`)
- [ ] CRUD completo de lotes
- [ ] Endpoints: `GET /lotes`, `POST /lotes`, `PUT /lotes/:id`, `GET /lotes/:id`
- [ ] Filtros: produto, fornecedor, data de entrada, status
- [ ] Rastreabilidade: `GET /lotes/:id/movimentacoes` (todo histórico do lote)
- [ ] Alertas de lotes próximos ao vencimento (query de consulta)
- [ ] Bloqueio de lote (impede saídas)

### Frontend — Estoque

- [ ] `EstoqueView.vue` — posição atual por produto/filial com filtros
- [ ] `MovimentacoesView.vue` — histórico de movimentações com filtros avançados
- [ ] `AjusteEstoqueModal.vue` — modal para ajuste manual com justificativa
- [ ] `TransferenciaModal.vue` — transferência entre filiais
- [ ] `LotesView.vue` — lista de lotes com status e saldo
- [ ] `LoteDetailView.vue` — histórico completo do lote
- [ ] Cards de resumo: total em estoque, abaixo do mínimo, lotes vencendo
- [ ] Alerta visual para produtos abaixo do estoque mínimo

---

## Fase 5 — Compras

> Objetivo: registrar entradas de matéria-prima e insumos.

### Backend — Compras

- [ ] Criar entidade `PedidoCompra` (id, numero, fornecedorId, filialId, status: RASCUNHO/CONFIRMADO/RECEBIDO/CANCELADO, dataEmissao, dataPrevistaEntrega, observacoes, totalBruto, totalDesconto, totalLiquido, timestamps)
- [ ] Criar entidade `ItemPedidoCompra` (id, pedidoCompraId, produtoId, quantidade, unidadeMedidaId, precoUnitario, desconto, total)
- [ ] Criar entidade `RecebimentoCompra` (id, pedidoCompraId, dataRecebimento, notaFiscal, responsavelId, observacoes)
- [ ] Criar entidade `ItemRecebimentoCompra` (id, recebimentoId, itemPedidoId, produtoId, loteId, quantidadeRecebida, quantidadeConferida)
- [ ] Criar migrations
- [ ] Implementar CRUD de pedidos de compra
- [ ] Cálculo automático de totais ao salvar/atualizar itens
- [ ] Fluxo de status: `RASCUNHO → CONFIRMADO → RECEBIDO/CANCELADO`
- [ ] Ao receber compra: criar lote automaticamente + gerar movimentação de ENTRADA no estoque
- [ ] Validar que quantidade recebida não excede quantidade pedida
- [ ] Número sequencial de pedido (ex: `PC-2025-0001`)
- [ ] Endpoints: CRUD completo + `POST /pedidos-compra/:id/confirmar` + `POST /pedidos-compra/:id/receber`

### Frontend — Compras

- [ ] `PedidosCompraListView.vue`
- [ ] `PedidoCompraFormView.vue` (com linha de itens dinâmica)
- [ ] `RecebimentoCompraView.vue` (conferência e recebimento)
- [ ] `PedidoCompraDetailView.vue`
- [ ] Status coloridos com fluxo visual

---

## Fase 6 — Produção e Beneficiamento

> Objetivo: registrar o processo produtivo de beneficiamento de arroz.

### Backend — Produção

- [ ] Criar entidade `OrdemProducao` (id, numero, tipo: BENEFICIAMENTO/REPROCESSO, status: ABERTA/EM_ANDAMENTO/ENCERRADA/CANCELADA, dataAbertura, dataPrevisao, dataEncerramento, filialId, responsavelId, observacoes, timestamps)
- [ ] Criar entidade `ItemConsumoOP` (id, ordemProducaoId, produtoId, loteId, quantidadePrevista, quantidadeConsumida) — matérias-primas consumidas
- [ ] Criar entidade `ItemProducaoOP` (id, ordemProducaoId, produtoId, loteId, quantidadePrevista, quantidadeProducida) — produtos gerados
- [ ] Criar entidade `ApontamentoProducao` (id, ordemProducaoId, dataHora, tipo: INICIO/PARADA/RETOMADA/ENCERRAMENTO, responsavelId, observacoes) — controle de tempo de máquina
- [ ] Criar entidade `PerdasProducao` (id, ordemProducaoId, tipo: QUIRERA/IMPUREZA/UMIDADE/OUTROS, quantidade, percentual)
- [ ] Criar migrations
- [ ] Implementar CRUD de ordens de produção
- [ ] Número sequencial de OP (ex: `OP-2025-0001`)
- [ ] Fluxo de status: `ABERTA → EM_ANDAMENTO → ENCERRADA/CANCELADA`
- [ ] Ao encerrar OP: consumir estoque de matérias-primas (SAIDA) + gerar estoque de produtos (ENTRADA) + registrar perdas
- [ ] Calcular rendimento: `(quantidade produzida / quantidade consumida) * 100`
- [ ] Calcular percentual de perda por tipo
- [ ] Gerar lote de produto automaticamente ao encerrar OP (com rastreabilidade para lotes de MP consumidos)
- [ ] Endpoints: CRUD + `POST /ordens-producao/:id/iniciar` + `POST /ordens-producao/:id/encerrar`
- [ ] `GET /ordens-producao/:id/rastreabilidade` — árvore completa de rastreabilidade

### Beneficiamento de Arroz — Campos Específicos

- [ ] Adicionar campos de qualidade à OP: `umidadeEntrada`, `umidadeSaida`, `rendimentoInteiro`, `rendimentoQuebrado`, `percentualImpureza`
- [ ] Criar entidade `ClassificacaoArroz` (id, ordemProducaoId, loteId, granulometria, cor, odor, umidade, impureza, renda, resultado: APROVADO/REPROVADO)
- [ ] Criar endpoints para registrar classificação
- [ ] Bloquear lote reprovado automaticamente

### Frontend — Produção

- [ ] `OrdensProducaoListView.vue`
- [ ] `OrdemProducaoFormView.vue` (com consumos e produções previstas)
- [ ] `OrdemProducaoDetailView.vue` (acompanhamento em tempo real)
- [ ] `ApontamentoModal.vue` (registrar início/parada/encerramento)
- [ ] `ClassificacaoModal.vue` (registrar classificação do arroz)
- [ ] Dashboard de produção: OPs abertas, em andamento, rendimento médio

---

## Fase 7 — Vendas e Expedição

> Objetivo: emitir pedidos de venda, romaneio e controlar expedição.

### Backend — Vendas

- [ ] Criar entidade `PedidoVenda` (id, numero, clienteId, filialId, status: RASCUNHO/CONFIRMADO/SEPARANDO/EXPEDIDO/CANCELADO, dataEmissao, dataPrevisaoEntrega, condicaoPagamento, observacoes, totalBruto, totalDesconto, totalLiquido, timestamps)
- [ ] Criar entidade `ItemPedidoVenda` (id, pedidoVendaId, produtoId, loteId, quantidade, unidadeMedidaId, precoUnitario, desconto, total)
- [ ] Criar entidade `Romaneio` (id, numero, pedidoVendaId, filialId, dataRomaneio, motorista, placa, observacoes, status: ABERTO/FECHADO)
- [ ] Criar entidade `ItemRomaneio` (id, romaneioId, produtoId, loteId, quantidadeSeparada, quantidadeExpedida, embalagem)
- [ ] Criar entidade `Expedicao` (id, romaneioId, dataExpedicao, responsavelId, observacoes)
- [ ] Criar migrations
- [ ] Número sequencial de pedido de venda (ex: `PV-2025-0001`) e romaneio (ex: `ROM-2025-0001`)
- [ ] Fluxo: `RASCUNHO → CONFIRMADO → SEPARANDO → EXPEDIDO`
- [ ] Verificar disponibilidade de estoque ao confirmar pedido
- [ ] Reservar estoque ao confirmar (campo `reservado` no estoque)
- [ ] Dar baixa no estoque ao expedir (SAIDA + libera reserva)
- [ ] Endpoints CRUD + `POST /pedidos-venda/:id/confirmar` + `POST /pedidos-venda/:id/separar` + `POST /pedidos-venda/:id/expedir`
- [ ] `GET /pedidos-venda/:id/imprimir` — gerar PDF do pedido

### Frontend — Vendas

- [ ] `PedidosVendaListView.vue`
- [ ] `PedidoVendaFormView.vue` (com seleção de produto/lote e verificação de estoque)
- [ ] `PedidoVendaDetailView.vue`
- [ ] `RomaneioFormView.vue`
- [ ] `RomaneioDetailView.vue` (para conferência e impressão)
- [ ] `ExpedicaoView.vue`
- [ ] Preview de impressão do romaneio

---

## Fase 8 — Financeiro

> Objetivo: controle de contas a pagar, receber e fluxo de caixa.

### Backend — Financeiro

- [ ] Criar entidade `ContaReceber` (id, numero, clienteId, pedidoVendaId?, descricao, valor, dataEmissao, dataVencimento, dataPagamento, status: PENDENTE/PARCIAL/PAGO/VENCIDO/CANCELADO, formaPagamento, observacoes, timestamps)
- [ ] Criar entidade `ContaPagar` (id, numero, fornecedorId, pedidoCompraId?, descricao, valor, dataEmissao, dataVencimento, dataPagamento, status, formaPagamento, observacoes, timestamps)
- [ ] Criar entidade `Parcela` (id, contaReceberOuPagarId, numero, valor, dataVencimento, dataPagamento, status)
- [ ] Criar entidade `CentroCusto` (id, nome, descricao, tipo: RECEITA/DESPESA, ativo)
- [ ] Criar entidade `LancamentoFinanceiro` (id, tipo: RECEITA/DESPESA, descricao, valor, dataPagamento, centroCustoId, contaId, categoriaId, observacoes)
- [ ] Criar migrations
- [ ] Gerar contas a receber automaticamente ao expedir pedido de venda
- [ ] Gerar contas a pagar automaticamente ao receber pedido de compra
- [ ] Registrar baixa de pagamento (parcial ou total)
- [ ] Calcular juros/multa por atraso
- [ ] Query de fluxo de caixa por período
- [ ] Query de inadimplência (contas vencidas)
- [ ] Endpoints: CRUD de contas + `POST /contas-receber/:id/pagar` + `POST /contas-pagar/:id/pagar`

### Frontend — Financeiro

- [ ] `ContasReceberView.vue` (com filtro por status, vencimento, cliente)
- [ ] `ContasPagarView.vue` (com filtro por status, vencimento, fornecedor)
- [ ] `BaixaPagamentoModal.vue` (registrar pagamento com forma de pagamento)
- [ ] `FluxoCaixaView.vue` (entradas e saídas por período, saldo projetado)
- [ ] Cards: total a receber, total a pagar, saldo do mês, inadimplência

---

## Fase 9 — Dashboard e Relatórios MVP

> Objetivo: visão geral do negócio em tempo real.

### Backend — Dashboard

- [ ] `GET /dashboard/resumo` — cards principais (vendas do mês, compras, estoque crítico, financeiro)
- [ ] `GET /dashboard/producao` — OPs abertas, rendimento médio
- [ ] `GET /dashboard/estoque/alertas` — produtos abaixo do mínimo, lotes vencendo

### Backend — Relatórios

- [ ] `GET /relatorios/estoque/posicao` — posição atual do estoque (com filtros)
- [ ] `GET /relatorios/estoque/movimentacoes` — extrato de movimentações
- [ ] `GET /relatorios/vendas/periodo` — vendas por período/cliente/produto
- [ ] `GET /relatorios/compras/periodo` — compras por período/fornecedor/produto
- [ ] `GET /relatorios/producao/rendimento` — rendimento por OP/período
- [ ] `GET /relatorios/financeiro/dre-simplificado` — receitas vs despesas
- [ ] Exportação de relatórios para CSV e PDF

### Frontend — Dashboard e Relatórios

- [ ] `DashboardView.vue` com cards, gráficos e alertas
- [ ] Instalar e configurar biblioteca de gráficos (`Chart.js` com `vue-chartjs`)
- [ ] Gráfico de vendas por mês (linha)
- [ ] Gráfico de produção por mês (barra)
- [ ] Gráfico de fluxo de caixa (área)
- [ ] `RelatoriosView.vue` com seleção de relatório e filtros
- [ ] Tabela de resultado com exportação

---

## MVP — Definição e Critérios

> O MVP está completo quando uma empresa consegue operar o dia a dia sem papel.

### O que está no MVP

| Módulo | Funcionalidades |
|---|---|
| Autenticação | Login, logout, refresh token, controle de sessão |
| Empresa/Filial | Cadastro básico, configuração inicial |
| Usuários | CRUD com perfis (Admin, Gerente, Operador) |
| Clientes | CRUD completo com endereços |
| Fornecedores | CRUD completo |
| Produtos | CRUD com tipos e categorias |
| Embalagens | CRUD |
| Unidades de Medida | CRUD + seed |
| Estoque | Posição atual, movimentações, ajustes |
| Lotes | Criação, rastreabilidade básica |
| Compras | Pedido → Recebimento → Entrada em estoque |
| Produção | OP → Consumo de MP → Produção → Saída/Entrada estoque |
| Vendas | Pedido → Romaneio → Expedição → Baixa estoque |
| Financeiro | Contas a pagar/receber, fluxo de caixa básico |
| Dashboard | Cards resumo + alertas críticos |
| Relatórios | Estoque, vendas, compras, produção (básico) |

### O que NÃO está no MVP (pós-MVP)

- Integração NF-e / SEFAZ
- Multi-tenancy avançado
- App mobile
- Integração bancária
- BI avançado
- Testes automatizados completos
- CI/CD
- Gestão de qualidade avançada

### Critérios de aceite do MVP

- [ ] Usuário consegue fazer login e acessar o sistema
- [ ] Usuário consegue cadastrar produtos, clientes e fornecedores
- [ ] Usuário consegue registrar compra de matéria-prima e ver estoque atualizado
- [ ] Usuário consegue abrir OP, registrar consumo/produção e ver estoque atualizado
- [ ] Usuário consegue criar pedido de venda, expedir e ver estoque baixado
- [ ] Usuário consegue registrar pagamentos e ver fluxo de caixa
- [ ] Dashboard exibe informações corretas e atualizadas
- [ ] Sistema funciona em ambiente Docker (produção)

---

## v1.1 — Qualidade e Estabilidade

> Após o MVP validado com usuários reais.

### Testes

- [ ] Configurar Vitest no backend
- [ ] Escrever testes unitários para todos os Services
- [ ] Escrever testes de integração para rotas principais (supertest)
- [ ] Configurar Vitest no frontend
- [ ] Escrever testes unitários para composables e stores
- [ ] Configurar Playwright para testes E2E
- [ ] Escrever testes E2E dos fluxos críticos (login, venda, compra, produção)
- [ ] Adicionar cobertura de código mínima (70%)

### CI/CD

- [ ] Configurar GitHub Actions
- [ ] Pipeline: lint → testes → build → deploy
- [ ] Configurar deploy automático para ambiente de staging
- [ ] Configurar deploy manual para produção (aprovação)
- [ ] Configurar Dependabot para atualizações de dependências

### Observabilidade

- [ ] Configurar logger estruturado com níveis (debug/info/warn/error)
- [ ] Configurar correlação de requests (request ID no header)
- [ ] Implementar métricas de performance (tempo de resposta por endpoint)
- [ ] Configurar health check com status dos subsistemas (banco, redis)
- [ ] Configurar alertas de erro por email (ou integração Slack)

### Documentação

- [ ] Escrever `README.md` completo (instalação, configuração, uso)
- [ ] Documentar API com Swagger/OpenAPI (`swagger-ui-express`)
- [ ] Documentar arquitetura e decisões técnicas
- [ ] Criar guia de contribuição (`CONTRIBUTING.md`)
- [ ] Criar `CHANGELOG.md`

### UX/UI

- [ ] Revisão completa de responsividade (tablets e monitores grandes)
- [ ] Implementar atalhos de teclado nas tabelas e formulários
- [ ] Melhorar feedback visual de loading e erros
- [ ] Revisar acessibilidade (ARIA labels, contraste, navegação por teclado)
- [ ] Implementar busca global (ctrl+K)

---

## v1.2 — Rastreabilidade e Auditoria

### Rastreabilidade

- [ ] `GET /rastreabilidade/lote/:id` — árvore completa: origem → produção → destino
- [ ] `GET /rastreabilidade/produto/:id/historico` — toda movimentação do produto
- [ ] Interface visual de rastreabilidade (árvore ou linha do tempo)
- [ ] QR Code por lote (para etiquetas)
- [ ] Impressão de etiqueta de lote

### Auditoria

- [ ] Criar tabela `AuditLog` (usuario, acao, entidade, entidadeId, dadosAntes, dadosDepois, ip, timestamp)
- [ ] Criar migration
- [ ] Implementar middleware de auditoria automática para CUD (create/update/delete)
- [ ] `GET /auditoria` com filtros (usuário, entidade, período)
- [ ] Interface de visualização de logs de auditoria

### Notificações

- [ ] Sistema de notificações internas (sino no navbar)
- [ ] Criar entidade `Notificacao`
- [ ] Notificar: estoque abaixo do mínimo, lote vencendo, conta vencida
- [ ] Marcar como lida / limpar notificações

---

## v1.3 — Fiscal e Integração NF-e

### NF-e (Nota Fiscal Eletrônica)

- [ ] Pesquisar biblioteca Node.js para NF-e (ex: `node-nfe`)
- [ ] Cadastrar certificado digital A1 (upload seguro)
- [ ] Configurar ambiente: homologação e produção SEFAZ
- [ ] Emitir NF-e a partir do pedido de venda
- [ ] Cancelar NF-e
- [ ] Consultar status NF-e
- [ ] Armazenar XML da NF-e no banco
- [ ] Download de XML e DANFE (PDF) pela interface
- [ ] Gerenciar série e numeração de NF-e por empresa/filial

### NF-e de Entrada

- [ ] Importar XML de NF-e de entrada (de fornecedores)
- [ ] Criar recebimento de compra automaticamente a partir do XML
- [ ] Conciliar NF-e importada com pedido de compra

### Tributário Básico

- [ ] Cadastro de NCM (Nomenclatura Comum do Mercosul)
- [ ] Cadastro de CFOP
- [ ] Configuração de alíquotas por produto e estado (ICMS, PIS, COFINS)
- [ ] Cálculo automático de impostos no pedido de venda

---

## v2.0 — Módulos Avançados

### Gestão de Qualidade

- [ ] Procedimentos de inspeção de recebimento
- [ ] Check-list de qualidade por produto
- [ ] Não conformidades (registro, tratativa, encerramento)
- [ ] Certificado de análise por lote
- [ ] Histórico de qualidade por fornecedor

### Planejamento de Produção

- [ ] Planejamento mensal/semanal de produção
- [ ] Cálculo de necessidade de matéria-prima (MRP básico)
- [ ] Calendário de produção
- [ ] Integração com estoque disponível vs demanda de pedidos

### Contratos

- [ ] Contratos com clientes (preço fixo por período)
- [ ] Contratos com fornecedores
- [ ] Alertas de vencimento de contrato

### Portal do Cliente (básico)

- [ ] Login separado para clientes
- [ ] Consultar pedidos próprios
- [ ] Emitir 2ª via de nota fiscal
- [ ] Histórico de compras

### Integração Bancária

- [ ] Importar extrato bancário (OFX)
- [ ] Conciliação bancária automática
- [ ] Integração PIX (cobrança)

### Gestão de Frota (se aplicável)

- [ ] Cadastro de veículos
- [ ] Registro de abastecimento
- [ ] Manutenção preventiva/corretiva
- [ ] Controle de motoristas e CNH

---

## v3.0 — Inteligência e Automação

### BI e Analytics

- [ ] Integração com ferramenta de BI (Metabase ou similar)
- [ ] Relatórios customizáveis pelo usuário
- [ ] Exportação para Excel avançada
- [ ] Gráficos interativos com drill-down

### Automações

- [ ] Regras de reposição automática de estoque (compra automática)
- [ ] Precificação dinâmica por custo de produção
- [ ] Envio automático de NF-e por email ao cliente
- [ ] Boletos automáticos (integração Pagar.me ou similar)

### App Mobile

- [ ] Aplicativo React Native (ou Vue Native) para operadores
- [ ] Leitor de QR Code para rastreabilidade
- [ ] Consulta de estoque e lotes em campo
- [ ] Apontamento de produção mobile

### Multi-tenancy SaaS (se pivot)

- [ ] Isolar dados por tenant (schema por empresa)
- [ ] Planos de assinatura
- [ ] Onboarding automatizado
- [ ] Painel admin do SaaS

---

## Entidades do Banco de Dados

> Mapeamento das entidades que existirão no sistema (não é schema, é planejamento).

### Identidade e Acesso
- `Usuario` — quem acessa o sistema
- `Perfil` — grupo de permissões (Admin, Gerente, Operador, Financeiro)
- `Permissao` — ação granular (clientes:criar, estoque:ajustar)
- `RefreshToken` — tokens de sessão

### Organização
- `Empresa` — empresa principal
- `Filial` — unidade operacional da empresa

### Terceiros
- `Cliente` — compradores
- `Fornecedor` — vendedores de MP e insumos
- `EnderecoCliente` / `EnderecoFornecedor`
- `ContatoCliente` / `ContatoFornecedor`

### Produtos e Embalagens
- `Produto` — item comercializado ou consumido
- `CategoriaProduto`
- `Embalagem` — tipo de embalagem do produto
- `UnidadeMedida`

### Estoque e Lotes
- `Estoque` — saldo atual por produto/filial
- `Lote` — rastreabilidade de entrada e produção
- `MovimentacaoEstoque` — todo débito/crédito no estoque

### Compras
- `PedidoCompra`
- `ItemPedidoCompra`
- `RecebimentoCompra`
- `ItemRecebimentoCompra`

### Produção
- `OrdemProducao`
- `ItemConsumoOP` — MP consumida
- `ItemProducaoOP` — produto gerado
- `ApontamentoProducao`
- `PerdasProducao`
- `ClassificacaoArroz`

### Vendas e Expedição
- `PedidoVenda`
- `ItemPedidoVenda`
- `Romaneio`
- `ItemRomaneio`
- `Expedicao`

### Financeiro
- `ContaReceber`
- `ContaPagar`
- `Parcela`
- `CentroCusto`
- `LancamentoFinanceiro`

### Fiscal (v1.3)
- `NotaFiscal`
- `ItemNotaFiscal`
- `NCM`
- `CFOP`
- `ConfiguracaoFiscal`

### Sistema
- `AuditLog` — rastreio de alterações
- `Notificacao` — alertas internos
- `ConfiguracaoSistema` — parâmetros gerais

---

## Padrões e Convenções

> Seguir estes padrões em todo o projeto.

### Nomenclatura

- [ ] Arquivos TypeScript: `camelCase.ts` para utilitários, `PascalCase.vue` para componentes
- [ ] Endpoints REST em português usando kebab-case: `/pedidos-venda`, `/ordens-producao`
- [ ] Tabelas Prisma em PascalCase singular: `PedidoVenda`, `OrdemProducao`
- [ ] Colunas em camelCase: `dataEmissao`, `totalLiquido`
- [ ] Enums em SCREAMING_SNAKE_CASE: `EM_ANDAMENTO`, `PRODUTO_ACABADO`
- [ ] Variáveis de ambiente em SCREAMING_SNAKE_CASE: `DATABASE_URL`

### Git

- [ ] Commits seguindo Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`
- [ ] Uma funcionalidade por branch
- [ ] PR obrigatório para merge em `main`
- [ ] Review antes de merge (mesmo que seja auto-review)

### API

- [ ] Sempre retornar `{ data: ... }` em sucesso e `{ error: { code, message } }` em erro
- [ ] Usar HTTP status codes corretos (200, 201, 400, 401, 403, 404, 409, 422, 500)
- [ ] Paginação padrão: `?page=1&limit=20` → resposta `{ data: [], meta: { page, limit, total, totalPages } }`
- [ ] Datas sempre em ISO 8601 (UTC)
- [ ] IDs como UUIDs (Prisma `@default(uuid())`)

### Segurança

- [ ] Nunca expor senha nos responses
- [ ] Nunca logar dados sensíveis
- [ ] Validar todos os inputs com Zod no backend
- [ ] Sanitizar inputs para prevenir injeção
- [ ] Headers de segurança via Helmet
- [ ] CORS restrito ao domínio do frontend

---

*Última atualização: Junho 2025*
*Versão do roadmap: 1.0*
