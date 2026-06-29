# MTV ERP — Development Roadmap

> Web ERP system for a rice processing industry.
> Developed in stages by a single developer.
> Check items off as you progress.

---

## Index

- [Phase 0 — Project Setup](#phase-0--project-setup)
- [Phase 1 — Base Architecture](#phase-1--base-architecture)
- [Phase 2 — Authentication](#phase-2--authentication)
- [Phase 3 — Core Registrations](#phase-3--core-registrations)
- [Phase 4 — Inventory & Batches](#phase-4--inventory--batches)
- [Phase 5 — Purchasing](#phase-5--purchasing)
- [Phase 6 — Production & Processing](#phase-6--production--processing)
- [Phase 7 — Sales & Shipping](#phase-7--sales--shipping)
- [Phase 8 — Financial](#phase-8--financial)
- [Phase 9 — Dashboard & MVP Reports](#phase-9--dashboard--mvp-reports)
- [MVP — Definition & Criteria](#mvp--definition--criteria)
- [v1.1 — Quality & Stability](#v11--quality--stability)
- [v1.2 — Traceability & Audit](#v12--traceability--audit)
- [v1.3 — Tax & NF-e Integration](#v13--tax--nf-e-integration)
- [v2.0 — Advanced Modules](#v20--advanced-modules)
- [v3.0 — Intelligence & Automation](#v30--intelligence--automation)
- [Database Entities](#database-entities)
- [Standards & Conventions](#standards--conventions)

---

## Phase 0 — Project Setup

> Goal: fully working environment before writing any business logic.

### Repository & Version Control

- [x] Create GitHub repository (`MTV-ERP-TEST`)
- [x] Create proper `.gitignore` (Node, Vue, `.env`, `dist/`, `node_modules/`)
- [x] Define branch strategy (`main` = production, `develop` = development, `feature/*`)
- [x] Create initial commit with base folder structure
- [x] Configure `main` branch protection on GitHub

### Monorepo Folder Structure

```
mtv-erp/
├── apps/
│   ├── web/          ← Vue 3 frontend
│   └── api/          ← Express backend
├── packages/
│   └── shared/       ← shared types and DTOs
├── docker/
├── docker-compose.yml
├── docker-compose.dev.yml
├── .env.example
└── TODO.md
```

- [x] Create monorepo folder structure
- [x] Create root `README.md` with project overview

### Docker & Environment

- [ ] Create `docker-compose.yml` for production
- [x] Create `docker-compose.dev.yml` for development (with hot-reload)
- [x] Configure `postgres` service in Compose (persistent volume)
- [x] Configure `pgadmin` service in Compose (dev access)
- [ ] Configure `api` service in Compose
- [ ] Configure `web` service in Compose
- [ ] Create backend `Dockerfile` (multi-stage: build + runtime)
- [ ] Create frontend `Dockerfile` (multi-stage: build + nginx)
- [ ] Create `.dockerignore` for backend and frontend
- [ ] Test `docker-compose up` and verify all services start
- [ ] Create `dev.sh` script to start development environment

### Environment Variables

- [ ] Create `.env.example` with all required variables documented
- [ ] Create `.env.dev` for development (do not version)
- [ ] Define variables: `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `PORT`, `NODE_ENV`, `CORS_ORIGIN`
- [ ] Configure environment variable validation on API startup (`zod` or `envalid`)

---

## Phase 1 — Base Architecture

> Goal: solid code foundation before any features.

### Backend — Initial Setup

- [x] Initialize Node.js project with TypeScript (`apps/api`)
- [x] Configure `tsconfig.json` (strict mode, path aliases `@/`)
- [x] Install dependencies: `express`, `cors`, `helmet`, `morgan`, `dotenv`, `zod`
- [x] Install devDependencies: `typescript`, `ts-node-dev`, `@types/express`, `@types/node`
- [x] Configure ESLint + Prettier for backend
- [x] Create `dev` script with `ts-node-dev` (hot-reload)
- [x] Create `build` and `start` scripts for production

### Backend — Folder Structure (adapted Clean Architecture)

```
apps/api/src/
├── config/           ← environment variables, constants
├── database/         ← Prisma client, seeds, migrations
├── modules/          ← each ERP module
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
├── app.ts            ← Express configuration
└── server.ts         ← entry point
```

- [x] Create backend folder structure
- [x] Create `app.ts` with global middlewares (cors, helmet, morgan, json parser)
- [x] Create `server.ts` with server initialization
- [x] Create health check route `GET /health`

### Backend — Error Handling

- [ ] Create `AppError` class (controlled application error)
- [ ] Create specific classes: `NotFoundError`, `ValidationError`, `UnauthorizedError`, `ForbiddenError`, `ConflictError`
- [ ] Create global `errorHandler` middleware (catches all errors)
- [ ] Create `notFound` middleware for unknown routes
- [ ] Standardize error response format: `{ error: { code, message, details? } }`
- [ ] Standardize success response format: `{ data: ..., meta?: { page, total } }`

### Backend — Prisma ORM

- [x] Install Prisma: `prisma`, `@prisma/client`
- [x] Run `npx prisma init` and configure `schema.prisma`
- [x] Configure `postgresql` provider
- [x] Create Prisma singleton client (`database/prisma.ts`)
- [ ] Configure `prisma generate` in build script
- [ ] Create `database/migrations/` folder (managed by Prisma)
- [ ] Create `database/seeds/` folder with initial seed (admin user)

### Backend — Shared Middlewares

- [ ] Create `authenticate` middleware (validates JWT, injects `req.user`)
- [ ] Create `authorize(roles[])` middleware (checks permissions)
- [ ] Create `validate(schema)` middleware (validates body/query/params with Zod)
- [ ] Create `paginate` middleware (extracts `page` and `limit` from query)
- [ ] Create `requestLogger` middleware (logs all requests)
- [ ] Create `rateLimiter` middleware for authentication routes

### Backend — Utilities

- [ ] Create pagination utility (`buildPaginationMeta`, `buildPaginationQuery`)
- [ ] Create password hashing utility (`bcrypt`)
- [ ] Create JWT generation and validation utility
- [ ] Create date formatting utility (`date-fns`)
- [ ] Create unique code generation utility (orders, batches, etc.)
- [ ] Create structured logger utility (`winston` or `pino`)

### Frontend — Initial Setup

- [ ] Initialize Vite + Vue 3 + TypeScript project (`apps/web`)
- [ ] Configure `tsconfig.json` with path aliases (`@/`)
- [ ] Configure `vite.config.ts` with alias and API proxy
- [ ] Install and configure TailwindCSS + `autoprefixer`
- [ ] Install Vue Router 4 and configure `router/index.ts`
- [ ] Install Pinia and configure `stores/index.ts`
- [ ] Install `axios` and create configured instance (`services/api.ts`)
- [ ] Configure request interceptor (adds JWT to header)
- [ ] Configure response interceptor (handles global errors, refresh token)
- [ ] Install ESLint + Prettier for frontend
- [ ] Configure `@vueuse/core` (utility composables)

### Frontend — Folder Structure

```
apps/web/src/
├── assets/           ← images, fonts
├── components/
│   ├── ui/           ← base components (Button, Input, Modal...)
│   └── shared/       ← reusable business components
├── composables/      ← reusable logic (useTable, useForm, useApi...)
├── layouts/
│   ├── AuthLayout.vue
│   └── AppLayout.vue
├── modules/          ← mirrors backend modules
│   └── auth/
│       ├── views/
│       ├── components/
│       └── store/
├── router/
├── services/         ← API calls organized by module
├── stores/           ← global Pinia stores
├── styles/           ← global CSS, Tailwind variables
└── types/            ← TypeScript types
```

- [ ] Create frontend folder structure

### Frontend — Main Layout

- [ ] Create `AuthLayout.vue` (clean screen for login/registration)
- [ ] Create `AppLayout.vue` (sidebar + navbar + content area)
- [ ] Create `Sidebar.vue` with navigation links and icons
- [ ] Create `Navbar.vue` with breadcrumb, username, logout button
- [ ] Create `Breadcrumb.vue` auto-generated from route
- [ ] Create light/dark theme system (toggle + localStorage persistence)
- [ ] Create `NotFound.vue` page (404)
- [ ] Create `Forbidden.vue` page (403)

### Frontend — Base UI Components

- [ ] `Button.vue` (variants: primary, secondary, danger, ghost; sizes; loading state)
- [ ] `Input.vue` (with label, error, icon, mask)
- [ ] `Select.vue` (with search, grouped options)
- [ ] `Textarea.vue`
- [ ] `Checkbox.vue` and `Radio.vue`
- [ ] `Badge.vue` (colored statuses)
- [ ] `Modal.vue` (with header, body, footer slots; sizes)
- [ ] `Drawer.vue` (sliding side panel)
- [ ] `Tooltip.vue`
- [ ] `Toast.vue` / notification system (`useToast`)
- [ ] `Spinner.vue` / `LoadingOverlay.vue`
- [ ] `EmptyState.vue` (when list is empty)
- [ ] `ConfirmDialog.vue` (delete confirmation)
- [ ] `Card.vue`
- [ ] `Divider.vue`
- [ ] `Avatar.vue`

### Frontend — Data Components

- [ ] `DataTable.vue` (configurable columns, loading, integrated pagination, row selection)
- [ ] `Pagination.vue` (previous/next, pages, items per page)
- [ ] `SearchInput.vue` (with debounce)
- [ ] `FilterBar.vue` (collapsible filters)
- [ ] `SortableHeader.vue` (column sorting)
- [ ] `FormSection.vue` (groups form fields with title)
- [ ] `PageHeader.vue` (title + breadcrumb + actions)

### Frontend — Base Composables

- [ ] `useApi(endpoint)` — HTTP call wrapper with loading/error
- [ ] `useTable(fetchFn)` — manages pagination, filters, sorting
- [ ] `useForm(schema)` — manages state, validation and form submit
- [ ] `useConfirm()` — opens ConfirmDialog and returns Promise
- [ ] `useToast()` — displays notifications
- [ ] `useAuth()` — access to authentication state
- [ ] `usePermission(permission)` — checks if user has permission

### Shared Package (shared types)

- [ ] Create `packages/shared` package with TypeScript types
- [ ] Export shared DTO interfaces between frontend and backend
- [ ] Export shared enums (`Role`, `Status`, `MovementType`, etc.)
- [ ] Configure as workspace package in monorepo

---

## Phase 2 — Authentication

> Goal: secure login system with session control.

### Backend — Auth

- [ ] Create `User` entity in Prisma schema (id, name, email, password, role, active, timestamps)
- [ ] Create initial migration
- [ ] Create `AuthRepository` (find by email, find by id)
- [ ] Create `AuthService` with methods: `login`, `logout`, `refreshToken`, `me`
- [ ] Create `AuthController` with HTTP handlers
- [ ] Create routes: `POST /auth/login`, `POST /auth/logout`, `POST /auth/refresh`, `GET /auth/me`
- [ ] Implement `accessToken` generation (short expiration: 15min)
- [ ] Implement `refreshToken` generation (long expiration: 7 days)
- [ ] Save `refreshToken` in database (`RefreshToken` table with userId, token, expiresAt, revoked)
- [ ] Create `RefreshToken` migration
- [ ] Implement refresh token revocation on logout
- [ ] Implement expired refresh token cleanup
- [ ] Create seed with default admin user
- [ ] Apply rate limiting to `POST /auth/login` (max 10 attempts/min per IP)
- [ ] Log login attempts (success and failure)

### Frontend — Auth

- [ ] Create `authStore` (Pinia) with: `user`, `accessToken`, `isAuthenticated`, `isLoading`
- [ ] Create actions: `login(email, password)`, `logout()`, `refreshToken()`, `fetchMe()`
- [ ] Persist `accessToken` in memory (not localStorage for security)
- [ ] Persist `refreshToken` in `httpOnly cookie` (backend must set)
- [ ] Create `LoginView.vue` with validated form
- [ ] Create `requiresAuth` route guard (redirects to login if not authenticated)
- [ ] Create `requiresGuest` route guard (redirects to dashboard if already logged in)
- [ ] Implement automatic token renewal in Axios interceptor
- [ ] Implement request queue during refresh (avoids multiple simultaneous refreshes)
- [ ] Create `ForgotPassword.vue` page (structure, future integration)
- [ ] Handle session expiration: display modal "Session expired, please log in again"

---

## Phase 3 — Core Registrations

> Goal: register the base entities that other modules depend on.

### Backend — CRUD Module Pattern

For each module below, follow the pattern:
- `module.schema.ts` — Zod validation schemas
- `module.dto.ts` — input/output types
- `module.repository.ts` — database access (Prisma)
- `module.service.ts` — business rules
- `module.controller.ts` — HTTP handlers
- `module.routes.ts` — route definitions

### Company

- [ ] Create `Company` entity (id, legalName, tradeName, taxId, stateReg, phone, email, logo, active, timestamps)
- [ ] Create migration
- [ ] Implement full CRUD (`GET /companies`, `POST`, `PUT /:id`, `DELETE /:id`, `GET /:id`)
- [ ] Validate unique tax ID
- [ ] Logo upload (local storage or S3 later)

### Branch

- [ ] Create `Branch` entity (id, companyId, name, taxId, stateReg, address, phone, active, timestamps)
- [ ] Create migration
- [ ] Implement full CRUD
- [ ] Associate branch with company
- [ ] Validate that user belongs to the correct company

### Users & Permissions

- [ ] Create `Role` entity (id, name, description)
- [ ] Create `Permission` entity (id, key, description, module)
- [ ] Create `RolePermission` pivot table
- [ ] Create `UserRole` pivot table
- [ ] Implement seed with default roles: `ADMIN`, `MANAGER`, `OPERATOR`, `FINANCIAL`
- [ ] Implement seed with permissions per module (e.g. `customers:create`, `customers:edit`, etc.)
- [ ] Implement user CRUD (`GET /users`, `POST`, `PUT /:id`, `DELETE /:id`)
- [ ] Create endpoint for changing own password
- [ ] Implement role CRUD with permission assignment
- [ ] Update `authorize` middleware to check permissions from database
- [ ] Protect all endpoints with `authenticate` and `authorize`

### Customers

- [ ] Create `Customer` entity (id, type: INDIVIDUAL/COMPANY, name/legalName, taxId, stateReg, email, phone, mobile, active, timestamps)
- [ ] Create `CustomerAddress` entity (id, customerId, zipCode, street, number, complement, neighborhood, city, state, primary)
- [ ] Create `CustomerContact` entity (id, customerId, name, role, email, phone)
- [ ] Create migrations
- [ ] Implement full CRUD for customers
- [ ] Implement CRUD for addresses and contacts (nested)
- [ ] Search by name, tax ID, city
- [ ] Auto zip code lookup (ViaCEP)
- [ ] CSV customer import (future structure)

### Suppliers

- [ ] Create `Supplier` entity (similar structure to Customer + category: rice/packaging/service/other)
- [ ] Create `SupplierAddress` entity
- [ ] Create `SupplierContact` entity
- [ ] Create migrations
- [ ] Implement full CRUD
- [ ] `leadTimeDays` and `notes` fields

### Units of Measure

- [ ] Create `UnitOfMeasure` entity (id, name, abbreviation, type: WEIGHT/VOLUME/UNIT/LENGTH, active)
- [ ] Create migration
- [ ] Implement CRUD
- [ ] Create seed with default units: KG, TON, BAG, UN, M, L, G

### Packaging

- [ ] Create `Packaging` entity (id, description, capacity, unitOfMeasureId, material, active, timestamps)
- [ ] Create migration
- [ ] Implement CRUD
- [ ] Examples: "50kg Bag", "25kg Bag", "10kg Box"

### Products

- [ ] Create `Product` entity (id, code, name, description, type: RAW_MATERIAL/FINISHED_GOOD/PACKAGING/SUPPLY, unitOfMeasureId, packagingId, netWeight, grossWeight, minStock, maxStock, active, timestamps)
- [ ] Create `ProductCategory` entity (id, name, description)
- [ ] Create migration
- [ ] Implement full product CRUD
- [ ] Implement category CRUD
- [ ] Automatic product code generation
- [ ] Product image upload
- [ ] Rice-specific fields: variety, type (long grain, etc.), classification
- [ ] Search by code, name, category

### Frontend — Registrations

For each entity above, create:

- [ ] `ListView.vue` with DataTable, filters and pagination
- [ ] `FormView.vue` (create and edit in the same component)
- [ ] `DetailView.vue` (full view)
- [ ] Corresponding API service (`customerService.ts`, etc.)
- [ ] Pinia store if needed for local cache
- [ ] Vue Router routes with lazy loading
- [ ] Sidebar links grouped by section

---

## Phase 4 — Inventory & Batches

> Goal: full inventory control with batch traceability.

### Backend — Inventory

- [ ] Create `Inventory` entity (id, productId, branchId, balance, unitOfMeasureId, updatedAt)
- [ ] Create `Batch` entity (id, code, productId, supplierId, entryDate, expirationDate, initialQuantity, currentBalance, status: ACTIVE/DEPLETED/BLOCKED, notes, timestamps)
- [ ] Create `InventoryMovement` entity (id, type: ENTRY/EXIT/TRANSFER/ADJUSTMENT/LOSS, productId, batchId, branchId, quantity, previousBalance, newBalance, sourceDocument, sourceDocumentId, responsibleId, notes, timestamps)
- [ ] Create migrations
- [ ] Create `InventoryService` with methods: `entry`, `exit`, `transfer`, `adjust`, `getBalance`, `getBalanceByBatch`
- [ ] Guarantee atomicity in movements (Prisma transaction)
- [ ] Prevent negative balance (validation in service)
- [ ] Create endpoints: `GET /inventory`, `GET /inventory/:productId`, `GET /inventory/balance/:productId/branch/:branchId`
- [ ] Create movement endpoints: `POST /movements`, `GET /movements`, `GET /movements/:id`
- [ ] Create inventory adjustment endpoint (with mandatory justification)
- [ ] Create inter-branch transfer endpoint
- [ ] Create statement query endpoint by product/batch

### Batches

- [ ] Automatic batch code generation (e.g. `BAT-2025-0001`)
- [ ] Full batch CRUD
- [ ] Endpoints: `GET /batches`, `POST /batches`, `PUT /batches/:id`, `GET /batches/:id`
- [ ] Filters: product, supplier, entry date, status
- [ ] Traceability: `GET /batches/:id/movements` (full batch history)
- [ ] Alerts for batches near expiration (query)
- [ ] Batch blocking (prevents exits)

### Frontend — Inventory

- [ ] `InventoryView.vue` — current position by product/branch with filters
- [ ] `MovementsView.vue` — movement history with advanced filters
- [ ] `InventoryAdjustmentModal.vue` — manual adjustment modal with justification
- [ ] `TransferModal.vue` — inter-branch transfer
- [ ] `BatchesView.vue` — batch list with status and balance
- [ ] `BatchDetailView.vue` — full batch history
- [ ] Summary cards: total in stock, below minimum, expiring batches
- [ ] Visual alert for products below minimum stock

---

## Phase 5 — Purchasing

> Goal: record raw material and supply entries.

### Backend — Purchasing

- [ ] Create `PurchaseOrder` entity (id, number, supplierId, branchId, status: DRAFT/CONFIRMED/RECEIVED/CANCELLED, issueDate, expectedDelivery, notes, grossTotal, discountTotal, netTotal, timestamps)
- [ ] Create `PurchaseOrderItem` entity (id, purchaseOrderId, productId, quantity, unitOfMeasureId, unitPrice, discount, total)
- [ ] Create `PurchaseReceipt` entity (id, purchaseOrderId, receiptDate, invoiceNumber, responsibleId, notes)
- [ ] Create `PurchaseReceiptItem` entity (id, receiptId, orderItemId, productId, batchId, receivedQuantity, checkedQuantity)
- [ ] Create migrations
- [ ] Implement purchase order CRUD
- [ ] Automatic total calculation when saving/updating items
- [ ] Status flow: `DRAFT → CONFIRMED → RECEIVED/CANCELLED`
- [ ] On receipt: automatically create batch + generate ENTRY inventory movement
- [ ] Validate that received quantity does not exceed ordered quantity
- [ ] Sequential order number (e.g. `PO-2025-0001`)
- [ ] Endpoints: full CRUD + `POST /purchase-orders/:id/confirm` + `POST /purchase-orders/:id/receive`

### Frontend — Purchasing

- [ ] `PurchaseOrdersListView.vue`
- [ ] `PurchaseOrderFormView.vue` (with dynamic item rows)
- [ ] `PurchaseReceiptView.vue` (check-in and receiving)
- [ ] `PurchaseOrderDetailView.vue`
- [ ] Colored statuses with visual flow

---

## Phase 6 — Production & Processing

> Goal: record the rice processing production flow.

### Backend — Production

- [ ] Create `ProductionOrder` entity (id, number, type: PROCESSING/REPROCESSING, status: OPEN/IN_PROGRESS/CLOSED/CANCELLED, openDate, expectedDate, closeDate, branchId, responsibleId, notes, timestamps)
- [ ] Create `ProductionOrderConsumption` entity (id, productionOrderId, productId, batchId, plannedQuantity, consumedQuantity) — consumed raw materials
- [ ] Create `ProductionOrderOutput` entity (id, productionOrderId, productId, batchId, plannedQuantity, producedQuantity) — generated products
- [ ] Create `ProductionEntry` entity (id, productionOrderId, dateTime, type: START/STOP/RESUME/CLOSE, responsibleId, notes) — machine time control
- [ ] Create `ProductionLoss` entity (id, productionOrderId, type: BROKEN/IMPURITY/MOISTURE/OTHER, quantity, percentage)
- [ ] Create migrations
- [ ] Implement production order CRUD
- [ ] Sequential PO number (e.g. `PO-2025-0001`)
- [ ] Status flow: `OPEN → IN_PROGRESS → CLOSED/CANCELLED`
- [ ] On close: consume raw material stock (EXIT) + generate product stock (ENTRY) + record losses
- [ ] Calculate yield: `(produced quantity / consumed quantity) * 100`
- [ ] Calculate loss percentage by type
- [ ] Automatically generate product batch on close (with traceability to consumed RM batches)
- [ ] Endpoints: CRUD + `POST /production-orders/:id/start` + `POST /production-orders/:id/close`
- [ ] `GET /production-orders/:id/traceability` — full traceability tree

### Rice Processing — Specific Fields

- [ ] Add quality fields to PO: `inputMoisture`, `outputMoisture`, `wholeGrainYield`, `brokenGrainYield`, `impurityPercentage`
- [ ] Create `RiceClassification` entity (id, productionOrderId, batchId, granulometry, color, odor, moisture, impurity, yield, result: APPROVED/REJECTED)
- [ ] Create endpoints to register classification
- [ ] Automatically block rejected batch

### Frontend — Production

- [ ] `ProductionOrdersListView.vue`
- [ ] `ProductionOrderFormView.vue` (with planned consumptions and outputs)
- [ ] `ProductionOrderDetailView.vue` (real-time tracking)
- [ ] `ProductionEntryModal.vue` (record start/stop/close)
- [ ] `ClassificationModal.vue` (record rice classification)
- [ ] Production dashboard: open POs, in progress, average yield

---

## Phase 7 — Sales & Shipping

> Goal: issue sales orders, shipping manifest and control dispatch.

### Backend — Sales

- [ ] Create `SalesOrder` entity (id, number, customerId, branchId, status: DRAFT/CONFIRMED/PICKING/SHIPPED/CANCELLED, issueDate, expectedDelivery, paymentTerms, notes, grossTotal, discountTotal, netTotal, timestamps)
- [ ] Create `SalesOrderItem` entity (id, salesOrderId, productId, batchId, quantity, unitOfMeasureId, unitPrice, discount, total)
- [ ] Create `ShippingManifest` entity (id, number, salesOrderId, branchId, manifestDate, driver, licensePlate, notes, status: OPEN/CLOSED)
- [ ] Create `ShippingManifestItem` entity (id, manifestId, productId, batchId, pickedQuantity, shippedQuantity, packaging)
- [ ] Create `Dispatch` entity (id, manifestId, dispatchDate, responsibleId, notes)
- [ ] Create migrations
- [ ] Sequential sales order number (e.g. `SO-2025-0001`) and manifest number (e.g. `MAN-2025-0001`)
- [ ] Flow: `DRAFT → CONFIRMED → PICKING → SHIPPED`
- [ ] Check stock availability when confirming order
- [ ] Reserve stock when confirming (reserved field in inventory)
- [ ] Deduct stock on dispatch (EXIT + release reservation)
- [ ] Endpoints: CRUD + `POST /sales-orders/:id/confirm` + `POST /sales-orders/:id/pick` + `POST /sales-orders/:id/ship`
- [ ] `GET /sales-orders/:id/print` — generate order PDF

### Frontend — Sales

- [ ] `SalesOrdersListView.vue`
- [ ] `SalesOrderFormView.vue` (with product/batch selection and stock check)
- [ ] `SalesOrderDetailView.vue`
- [ ] `ShippingManifestFormView.vue`
- [ ] `ShippingManifestDetailView.vue` (for checking and printing)
- [ ] `DispatchView.vue`
- [ ] Manifest print preview

---

## Phase 8 — Financial

> Goal: control accounts receivable, payable and cash flow.

### Backend — Financial

- [ ] Create `AccountReceivable` entity (id, number, customerId, salesOrderId?, description, amount, issueDate, dueDate, paymentDate, status: PENDING/PARTIAL/PAID/OVERDUE/CANCELLED, paymentMethod, notes, timestamps)
- [ ] Create `AccountPayable` entity (id, number, supplierId, purchaseOrderId?, description, amount, issueDate, dueDate, paymentDate, status, paymentMethod, notes, timestamps)
- [ ] Create `Installment` entity (id, accountId, number, amount, dueDate, paymentDate, status)
- [ ] Create `CostCenter` entity (id, name, description, type: REVENUE/EXPENSE, active)
- [ ] Create `FinancialEntry` entity (id, type: REVENUE/EXPENSE, description, amount, paymentDate, costCenterId, accountId, categoryId, notes)
- [ ] Create migrations
- [ ] Automatically generate accounts receivable when shipping sales order
- [ ] Automatically generate accounts payable when receiving purchase order
- [ ] Register payment (partial or full)
- [ ] Calculate late fees/interest
- [ ] Cash flow query by period
- [ ] Overdue query (overdue accounts)
- [ ] Endpoints: accounts CRUD + `POST /accounts-receivable/:id/pay` + `POST /accounts-payable/:id/pay`

### Frontend — Financial

- [ ] `AccountsReceivableView.vue` (filtered by status, due date, customer)
- [ ] `AccountsPayableView.vue` (filtered by status, due date, supplier)
- [ ] `PaymentModal.vue` (register payment with payment method)
- [ ] `CashFlowView.vue` (income and expenses by period, projected balance)
- [ ] Cards: total receivable, total payable, monthly balance, overdue

---

## Phase 9 — Dashboard & MVP Reports

> Goal: real-time business overview.

### Backend — Dashboard

- [ ] `GET /dashboard/summary` — main cards (monthly sales, purchases, critical stock, financial)
- [ ] `GET /dashboard/production` — open POs, average yield
- [ ] `GET /dashboard/inventory/alerts` — products below minimum, expiring batches

### Backend — Reports

- [ ] `GET /reports/inventory/position` — current inventory position (with filters)
- [ ] `GET /reports/inventory/movements` — movement statement
- [ ] `GET /reports/sales/period` — sales by period/customer/product
- [ ] `GET /reports/purchases/period` — purchases by period/supplier/product
- [ ] `GET /reports/production/yield` — yield by PO/period
- [ ] `GET /reports/financial/simplified-income-statement` — revenue vs expenses
- [ ] Report export to CSV and PDF

### Frontend — Dashboard & Reports

- [ ] `DashboardView.vue` with cards, charts and alerts
- [ ] Install and configure chart library (`Chart.js` with `vue-chartjs`)
- [ ] Monthly sales chart (line)
- [ ] Monthly production chart (bar)
- [ ] Cash flow chart (area)
- [ ] `ReportsView.vue` with report selection and filters
- [ ] Result table with export

---

## MVP — Definition & Criteria

> MVP is complete when a company can operate day-to-day without paper.

### What's in the MVP

| Module | Features |
|---|---|
| Authentication | Login, logout, refresh token, session control |
| Company/Branch | Basic registration, initial setup |
| Users | CRUD with roles (Admin, Manager, Operator) |
| Customers | Full CRUD with addresses |
| Suppliers | Full CRUD |
| Products | CRUD with types and categories |
| Packaging | CRUD |
| Units of Measure | CRUD + seed |
| Inventory | Current position, movements, adjustments |
| Batches | Creation, basic traceability |
| Purchasing | Order → Receipt → Inventory entry |
| Production | PO → RM consumption → Production → Stock in/out |
| Sales | Order → Manifest → Dispatch → Stock deduction |
| Financial | Accounts payable/receivable, basic cash flow |
| Dashboard | Summary cards + critical alerts |
| Reports | Inventory, sales, purchasing, production (basic) |

### What's NOT in the MVP (post-MVP)

- NF-e / SEFAZ integration
- Advanced multi-tenancy
- Mobile app
- Banking integration
- Advanced BI
- Complete automated tests
- CI/CD
- Advanced quality management

### MVP Acceptance Criteria

- [ ] User can log in and access the system
- [ ] User can register products, customers and suppliers
- [ ] User can record raw material purchase and see updated inventory
- [ ] User can open PO, record consumption/production and see updated inventory
- [ ] User can create sales order, dispatch and see inventory deducted
- [ ] User can register payments and view cash flow
- [ ] Dashboard displays correct and up-to-date information
- [ ] System runs in Docker environment (production)

---

## v1.1 — Quality & Stability

> After MVP validated with real users.

### Tests

- [ ] Configure Vitest in backend
- [ ] Write unit tests for all Services
- [ ] Write integration tests for main routes (supertest)
- [ ] Configure Vitest in frontend
- [ ] Write unit tests for composables and stores
- [ ] Configure Playwright for E2E tests
- [ ] Write E2E tests for critical flows (login, sale, purchase, production)
- [ ] Add minimum code coverage (70%)

### CI/CD

- [ ] Configure GitHub Actions
- [ ] Pipeline: lint → tests → build → deploy
- [ ] Configure automatic deploy to staging environment
- [ ] Configure manual deploy to production (approval required)
- [ ] Configure Dependabot for dependency updates

### Observability

- [ ] Configure structured logger with levels (debug/info/warn/error)
- [ ] Configure request correlation (request ID in header)
- [ ] Implement performance metrics (response time per endpoint)
- [ ] Configure health check with subsystem status (database, redis)
- [ ] Configure error alerts by email (or Slack integration)

### Documentation

- [ ] Write complete `README.md` (installation, configuration, usage)
- [ ] Document API with Swagger/OpenAPI (`swagger-ui-express`)
- [ ] Document architecture and technical decisions
- [ ] Create contribution guide (`CONTRIBUTING.md`)
- [ ] Create `CHANGELOG.md`

### UX/UI

- [ ] Full responsiveness review (tablets and large monitors)
- [ ] Implement keyboard shortcuts in tables and forms
- [ ] Improve loading and error visual feedback
- [ ] Review accessibility (ARIA labels, contrast, keyboard navigation)
- [ ] Implement global search (ctrl+K)

---

## v1.2 — Traceability & Audit

### Traceability

- [ ] `GET /traceability/batch/:id` — full tree: origin → production → destination
- [ ] `GET /traceability/product/:id/history` — all product movements
- [ ] Visual traceability interface (tree or timeline)
- [ ] QR Code per batch (for labels)
- [ ] Batch label printing

### Audit

- [ ] Create `AuditLog` table (user, action, entity, entityId, dataBefore, dataAfter, ip, timestamp)
- [ ] Create migration
- [ ] Implement automatic audit middleware for CUD (create/update/delete)
- [ ] `GET /audit` with filters (user, entity, period)
- [ ] Audit log viewing interface

### Notifications

- [ ] Internal notification system (bell in navbar)
- [ ] Create `Notification` entity
- [ ] Notify: stock below minimum, expiring batch, overdue account
- [ ] Mark as read / clear notifications

---

## v1.3 — Tax & NF-e Integration

### NF-e (Brazilian Electronic Invoice)

- [ ] Research Node.js NF-e library (e.g. `node-nfe`)
- [ ] Register A1 digital certificate (secure upload)
- [ ] Configure environment: SEFAZ homologation and production
- [ ] Issue NF-e from sales order
- [ ] Cancel NF-e
- [ ] Query NF-e status
- [ ] Store NF-e XML in database
- [ ] Download XML and DANFE (PDF) from interface
- [ ] Manage NF-e series and numbering by company/branch

### Inbound NF-e

- [ ] Import supplier NF-e XML
- [ ] Automatically create purchase receipt from XML
- [ ] Reconcile imported NF-e with purchase order

### Basic Tax

- [ ] NCM registration (Mercosur Common Nomenclature)
- [ ] CFOP registration
- [ ] Tax rate configuration by product and state (ICMS, PIS, COFINS)
- [ ] Automatic tax calculation in sales order

---

## v2.0 — Advanced Modules

### Quality Management

- [ ] Receiving inspection procedures
- [ ] Quality checklist by product
- [ ] Non-conformances (registration, treatment, closure)
- [ ] Certificate of analysis by batch
- [ ] Quality history by supplier

### Production Planning

- [ ] Monthly/weekly production planning
- [ ] Raw material requirement calculation (basic MRP)
- [ ] Production calendar
- [ ] Integration with available stock vs order demand

### Contracts

- [ ] Customer contracts (fixed price per period)
- [ ] Supplier contracts
- [ ] Contract expiration alerts

### Customer Portal (basic)

- [ ] Separate login for customers
- [ ] View own orders
- [ ] Download invoice copy
- [ ] Purchase history

### Banking Integration

- [ ] Import bank statement (OFX)
- [ ] Automatic bank reconciliation
- [ ] PIX integration (billing)

### Fleet Management (if applicable)

- [ ] Vehicle registration
- [ ] Fuel record
- [ ] Preventive/corrective maintenance
- [ ] Driver and license control

---

## v3.0 — Intelligence & Automation

### BI & Analytics

- [ ] BI tool integration (Metabase or similar)
- [ ] User-customizable reports
- [ ] Advanced Excel export
- [ ] Interactive charts with drill-down

### Automation

- [ ] Automatic stock replenishment rules (auto purchase)
- [ ] Dynamic pricing by production cost
- [ ] Automatic NF-e email to customer
- [ ] Automatic bank slips (Pagar.me or similar integration)

### Mobile App

- [ ] React Native app (or Vue Native) for operators
- [ ] QR Code reader for traceability
- [ ] Field inventory and batch queries
- [ ] Mobile production entries

### Multi-tenancy SaaS (if pivot)

- [ ] Isolate data per tenant (schema per company)
- [ ] Subscription plans
- [ ] Automated onboarding
- [ ] SaaS admin panel

---

## Database Entities

> Mapping of entities that will exist in the system (not a schema, just planning).

### Identity & Access
- `User` — who accesses the system
- `Role` — permission group (Admin, Manager, Operator, Financial)
- `Permission` — granular action (customers:create, inventory:adjust)
- `RefreshToken` — session tokens

### Organization
- `Company` — main company
- `Branch` — operational unit of the company

### Third Parties
- `Customer` — buyers
- `Supplier` — RM and supply sellers
- `CustomerAddress` / `SupplierAddress`
- `CustomerContact` / `SupplierContact`

### Products & Packaging
- `Product` — item sold or consumed
- `ProductCategory`
- `Packaging` — product packaging type
- `UnitOfMeasure`

### Inventory & Batches
- `Inventory` — current balance by product/branch
- `Batch` — entry and production traceability
- `InventoryMovement` — every debit/credit in inventory

### Purchasing
- `PurchaseOrder`
- `PurchaseOrderItem`
- `PurchaseReceipt`
- `PurchaseReceiptItem`

### Production
- `ProductionOrder`
- `ProductionOrderConsumption` — consumed RM
- `ProductionOrderOutput` — generated product
- `ProductionEntry`
- `ProductionLoss`
- `RiceClassification`

### Sales & Shipping
- `SalesOrder`
- `SalesOrderItem`
- `ShippingManifest`
- `ShippingManifestItem`
- `Dispatch`

### Financial
- `AccountReceivable`
- `AccountPayable`
- `Installment`
- `CostCenter`
- `FinancialEntry`

### Tax (v1.3)
- `Invoice`
- `InvoiceItem`
- `NCM`
- `CFOP`
- `TaxConfiguration`

### System
- `AuditLog` — change tracking
- `Notification` — internal alerts
- `SystemConfiguration` — general parameters

---

## Standards & Conventions

> Follow these standards throughout the project.

### Naming

- [ ] TypeScript files: `camelCase.ts` for utilities, `PascalCase.vue` for components
- [ ] REST endpoints in English using kebab-case: `/sales-orders`, `/production-orders`
- [ ] Prisma tables in singular PascalCase: `SalesOrder`, `ProductionOrder`
- [ ] Columns in camelCase: `issueDate`, `netTotal`
- [ ] Enums in SCREAMING_SNAKE_CASE: `IN_PROGRESS`, `FINISHED_GOOD`
- [ ] Environment variables in SCREAMING_SNAKE_CASE: `DATABASE_URL`

### Git

- [ ] Commits following Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`
- [ ] One feature per branch
- [ ] PR required for merge into `main`
- [ ] Review before merge (even if self-review)

### API

- [ ] Always return `{ data: ... }` on success and `{ error: { code, message } }` on error
- [ ] Use correct HTTP status codes (200, 201, 400, 401, 403, 404, 409, 422, 500)
- [ ] Default pagination: `?page=1&limit=20` → response `{ data: [], meta: { page, limit, total, totalPages } }`
- [ ] Dates always in ISO 8601 (UTC)
- [ ] IDs as UUIDs (Prisma `@default(uuid())`)

### Security

- [ ] Never expose password in responses
- [ ] Never log sensitive data
- [ ] Validate all inputs with Zod on backend
- [ ] Sanitize inputs to prevent injection
- [ ] Security headers via Helmet
- [ ] CORS restricted to frontend domain

---

*Last updated: June 2025*
*Roadmap version: 1.0*
