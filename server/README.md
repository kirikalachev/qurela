# Qurela Server - Notes Management Platform

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your credentials
```

3. Generate Prisma client:
```bash
npm run prisma:generate
```

4. Run database migrations:
```bash
npm run prisma:migrate
```

5. Start development server:
```bash
npm run dev
```

## API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | Public | Create account |
| POST | /api/auth/login | Public | Get tokens |
| POST | /api/auth/refresh | Public | Refresh token |
| POST | /api/auth/logout | Auth | Logout |
| GET | /api/notes | Auth | List own notes |
| POST | /api/notes | Auth | Create note |
| PUT | /api/notes/:id | Auth | Update note |
| DELETE | /api/notes/:id | Auth | Delete note |
| GET | /api/admin/users | Admin | List users |
| GET | /api/admin/notes | Admin | List all notes |
| GET | /api/admin/stats | Admin | Dashboard stats |

## Docker

```bash
docker compose up -d
```