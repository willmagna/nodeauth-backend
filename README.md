# Backend Authentication Server

This backend template can be used as a **standalone authentication server** or as a **starting point for a full backend server**.

### 🔐 Authentication features included:

- JWT-based authentication
- Direct user registration
- User registration via invitation (email signup)
- Refresh tokens
- Password recovery with 2FA (optional)
- Global and per-user rate limiting (Redis-based)
- Authentication middleware via static API Token (useful when running as a standalone auth server)
- Error handling and validation
- Pino logger (high-performance logging)

---

## 🏗️ Technologies

- Node.js
- TypeScript
- MongoDB
- Redis
- Docker Compose

---

## 🚀 Local Development

1. Clone the project:

```bash
git clone git@github.com:willmagna/nodeauth-backend.git
cd nodeauth-backend

```

2. Install dependencies:

```bash

yarn install

```

3. Setup environment variables:

```bash

cp .env.example .env

```

4. Run docker compose

```bash

sudo docker compose up -d

```

5. Run the development server:

```bash

yarn dev

```
