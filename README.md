# BACKEND AUTHENTICATION SERVER

This backend template can be use as a stand authentication server or it can be used as a template for a full backend server.

Authentication feature pre-built in

- JWT authentication based
- Direct user registration
- User registration by invitation email signup
- Refresh tokens
- 2FA Password recovery flow
- Error handling & validation
- Pino logger
- Rate limiter
- Global rate limiter
- Authentication middleware by static API Token (applied when standalone auth server)

## Technologies

- NodeJS
- Typescript
- MongoDB
- Redis
- Docker compose

## Local Deploy

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
