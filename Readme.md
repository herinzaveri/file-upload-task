# File Upload & Metadata Processing Microservice

## Overview
A secure Node.js backend microservice for authenticated file uploads, metadata storage, and asynchronous file processing. Built with Express, PostgreSQL, BullMQ (Redis), and JWT authentication.

---

## Features
- **JWT Authentication**: Secure login and protected endpoints.
- **File Upload API**: Upload files with optional metadata (title, description).
- **Async Processing**: Background job (BullMQ) processes files and updates status.
- **Status Tracking**: Query file status and extracted data.
- **PostgreSQL**: Stores users, files, and job metadata.
- **Dockerized**: Easy local setup with Docker Compose.

---

## Getting Started

### Prerequisites
- Node.js >= 18
- Docker & Docker Compose

### Setup
1. **Clone the repo**
2. **Create a `.env` file** (see example below)
3. **Start services**
   ```sh
   docker-compose up
   ```
4. **Install dependencies**
   ```sh
   npm install
   ```
5. **Run migrations**
   ```sh
   node scripts/run-migrations.js
   ```
6. **Start the app**
   ```sh
   npm start
   ```

---

## API Documentation

### Auth
- **POST /auth/login**
  - Body: `{ "email": "admin@example.com", "password": "password123" }`
  - Returns: `{ token: <JWT> }`

### File Upload
- **POST /upload**
  - Headers: `Authorization: Bearer <token>`
  - Form Data: `file` (file), `title` (string, optional), `description` (string, optional)
  - Returns: `{ id, filename, path, mimetype, size, status }`

### File Status
- **GET /files/:id**
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ id, filename, title, description, status, extractedData, uploaded_at }`

---

## Design Choices
- **Express.js** for REST API simplicity.
- **Sequelize** for migrations, but raw queries for flexibility.
- **BullMQ** with ioredis for robust background job processing.
- **JWT** for stateless authentication.
- **Docker Compose** for easy local dev (Postgres, Redis).
- **Uploads** stored on local disk (`/uploads`).

---

## Example .env
```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=filedb
DB_USER=root
DB_PASS=root
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
```

---

## Known Limitations / Assumptions
- Passwords are stored in plaintext for demo.
- No user registration endpoint (default user seeded via migration).
- No file type validation or virus scanning.
- No pagination or rate limiting (can be added).
- Only the uploading user can access their files.

---

## Migrations
- Run with: `node scripts/run-migrations.js`
- Tracked in `migrations_executed` table to avoid re-running.

---

## Running with Docker
- Build and run all services:
  ```sh
  docker-compose up --build
  ```
- The app will be available on `http://localhost:3000`

---

## Example Auth Flow
1. `POST /auth/login` → Get JWT
2. `POST /upload` (with JWT, file, metadata)
3. Background job processes file
4. `GET /files/:id` (with JWT) → See status & extracted data

---

## License
MIT
