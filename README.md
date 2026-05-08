# Seller Products — Fullstack Product Management Dashboard

A fullstack product management system (Seller Dashboard) built with **React 18** and **Express.js**, featuring JWT authentication, file upload, layered backend architecture, and a modern Ant Design UI.

> This project demonstrates production-grade patterns: separation of concerns, centralized error handling, security hardening, and standardized API contracts.

Swagger API Docs record:
https://drive.google.com/file/d/1QR9sNzz_CnJCWnAAoU1TyCGo8srADOOz/view?usp=drive_link

Vitest + Supertest integration tests report file:
https://drive.google.com/file/d/1X30grHADev7XEzhrm2gHOpdwTH2qNrKZ/view?usp=sharing

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite 5, Ant Design 5 |
| **Backend** | Node.js, Express 4, Sequelize 6 |
| **Database** | MySQL 8 |
| **Auth** | JWT (jsonwebtoken), bcryptjs |
| **Security** | Helmet, express-rate-limit, scoped CORS |
| **Runtime** | Bun (compatible with Node.js/npm) |

---

## Architecture Overview

```
seller_products/          (Monorepo Root)
│
├── be/                   (Backend API — Port 5000)
│   ├── config/           Database connection (env-based)
│   ├── controllers/      Thin request handlers
│   ├── middlewares/       Auth guard, global error handler
│   ├── models/           Sequelize model definitions
│   ├── routes/           Express route declarations
│   ├── services/         Business logic layer
│   ├── utils/            Standardized API response helpers
│   ├── validators/       Input validation middleware
│   ├── index.js          App entry point
│   └── seeder.js         Database seed script
│
├── seller_products/      (Frontend App — Port 5173)
│   └── src/
│       ├── api/          Centralized Axios instance
│       ├── components/   UI components (layout, common, feature)
│       ├── context/      React Context (AuthContext)
│       ├── hooks/        Custom hooks (useProducts)
│       ├── pages/        Route-level page components
│       ├── App.jsx       Root component with routing
│       └── main.jsx      Entry point
│
├── .gitignore
├── .prettierrc
└── README.md
```

### Backend Layered Architecture

```
Request → Route → [Auth Middleware] → [Validator] → Controller → Service → Model → DB
                                                                    ↓
                                                          API Response Utility
                                                                    ↓
                                          Global Error Handler (catches unhandled errors)
```

Each layer has a single responsibility:
- **Routes** declare endpoints and attach middleware.
- **Middlewares** handle cross-cutting concerns (auth verification, rate limiting).
- **Validators** reject malformed input before it reaches business logic.
- **Controllers** are thin handlers that delegate to services and format responses.
- **Services** contain business logic and database operations.
- **Utils** provide standardized response formatting (`{ success, message, data }`).

---

## Features

### Authentication & Security
- **JWT-based authentication** — Login returns a signed token (24h expiry); protected routes verify via Bearer header.
- **bcrypt password hashing** — Passwords are salted and hashed before storage (cost factor 10).
- **Helmet** — Sets secure HTTP headers (XSS protection, content sniffing prevention, etc.).
- **Rate limiting** — Auth endpoints are limited to 50 requests per 15-minute window.
- **Scoped CORS** — Only the configured frontend origin is allowed (no wildcard `*`).

### Product Management (CRUD)
- **Create** — Upload product with image (JPG/PNG, max 2MB). File is stored via MD5-based naming to prevent collisions.
- **Read** — Paginated product listing (`GET /products?page=1&limit=10`). Supports server-side pagination with total count and page metadata.
- **Update** — Modify product name via `PATCH /products/:id` (requires auth).
- **Delete** — Remove product via `DELETE /products/:id` with frontend confirmation modal (requires auth).

### Frontend UX
- **AuthContext** — Global auth state with token persistence. Auto-validates token on app load via `/auth/me`.
- **Axios interceptors** — JWT auto-attached to requests; 401 responses trigger automatic logout and redirect.
- **Protected routes** — Unauthenticated users are redirected to `/login`.
- **Loading & empty states** — Spinner during data fetch, empty illustration when no products exist.
- **Toast notifications** — Success/error feedback via Ant Design `message` API.
- **Delete confirmation** — Modal dialog before destructive actions.
- **404 page** — Graceful handling of unknown routes.

---

## API Endpoints

All responses follow a standardized format:
```json
{ "success": true, "message": "...", "data": { ... } }
```

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | No | Register a new user |
| `POST` | `/auth/login` | No | Login, returns JWT token |
| `GET` | `/auth/me` | Yes | Get current authenticated user |

### Products

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/products?page=1&limit=10` | No | List products (paginated) |
| `GET` | `/products/:id` | No | Get single product by ID |
| `POST` | `/products` | Yes | Create product (multipart/form-data) |
| `PATCH` | `/products/:id` | Yes | Update product name |
| `DELETE` | `/products/:id` | Yes | Delete product |

---

## Getting Started

### Prerequisites
- **Node.js** ≥ 18 (or **Bun** ≥ 1.0)
- **MySQL** running (via XAMPP, Laragon, or standalone service)

### 1. Clone & Install

```bash
# Backend
cd be
bun install        # or: npm install

# Frontend
cd ../seller_products
bun install        # or: npm install
```

### 2. Configure Environment

```bash
# Copy the template and adjust values if needed
cp be/.env.example be/.env
```

Default `.env` values work with a standard local MySQL setup (`root` / no password).

### 3. Setup Database

Create an empty database named `upload_db`:

```bash
mysql -u root -e "CREATE DATABASE IF NOT EXISTS upload_db;"
```

### 4. Seed Data

```bash
cd be
bun run seed
```

This creates the `product` and `user` tables, inserts sample products, and creates a default user.

### 5. Run

Open two terminals:

```bash
# Terminal 1 — Backend
cd be
bun start          # → http://localhost:5000

# Terminal 2 — Frontend
cd seller_products
bun run dev        # → http://localhost:5173
```

### Default Credentials

| Username | Password |
|----------|----------|
| `admin` | `admin123` |

---

## Challenges

Building a product management dashboard for small-to-medium sellers presents several real-world challenges:

1. **Unstructured Product Catalogs** — Many small sellers manage their inventory through spreadsheets, chat messages, or even paper notes. There is no centralized, visual catalog to organize products alongside their images and metadata.

2. **Lack of Access Control** — When multiple people access a shared product list (owner, staff, admin), there is no way to distinguish who can view versus who can modify or delete data. Without proper authentication, anyone with the URL can make destructive changes.

3. **Error-Prone Manual Processes** — Adding products with images typically involves separate steps: uploading an image to a hosting service, copying the URL, and pasting it into a form or database. Each step is a point of failure.

4. **No Feedback on Failures** — Many simple CRUD tools fail silently. A seller uploads a 5MB image and nothing happens — no error, no explanation, no guidance. This erodes trust and wastes time.

5. **Environment Lock-In** — Systems built with hardcoded database credentials and server URLs cannot be moved between development, staging, and production without changing source code. This makes deployment fragile and collaboration difficult.

## Solutions

This project directly addresses each challenge above:

1. **Centralized Visual Dashboard** — Products are displayed as image cards in a responsive grid layout. Sellers can see their entire catalog at a glance, add new items with a single form, and remove products with one click. Server-side pagination ensures the interface stays fast even as the catalog grows.

2. **JWT-Based Authentication** — Every mutating operation (create, update, delete) requires a valid token issued upon login. Passwords are hashed with bcrypt before storage, tokens expire after 24 hours, and auth routes are rate-limited to prevent brute-force attacks. Viewing products remains public — only modifications are protected.

3. **Unified Upload Flow** — The "Add Product" form handles everything in a single submission: the seller types a name, selects an image, sees an instant preview, and clicks save. The backend validates the file type (JPG/PNG only) and size (≤ 2MB), generates a collision-free filename via MD5 hashing, and stores both the file and database record atomically.

4. **End-to-End Error Feedback** — Every API response follows a standardized format (`{ success, message, data }`). Backend validation errors (wrong file type, missing name, oversized image) are returned as clear messages. The frontend displays these as toast notifications, and a global error handler ensures no request ever fails silently.

5. **Environment-Driven Configuration** — All credentials, ports, and URLs are externalized to `.env` files. The backend reads from `process.env` with sensible defaults; the frontend reads from Vite's `import.meta.env` via a single centralized Axios instance. Moving between environments requires changing one file — zero source code modifications.

---

## Environment Variables

### Backend (`be/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_NAME` | `upload_db` | MySQL database name |
| `DB_USER` | `root` | MySQL username |
| `DB_PASS` | _(empty)_ | MySQL password |
| `DB_HOST` | `localhost` | MySQL host |
| `DB_PORT` | `3306` | MySQL port |
| `PORT` | `5000` | Express server port |
| `JWT_SECRET` | — | Secret key for signing JWT tokens |
| `NODE_ENV` | `development` | Environment mode |
| `FRONTEND_URL` | `http://localhost:5173` | Allowed CORS origin |

### Frontend (`seller_products/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:5000` | Backend API base URL |
