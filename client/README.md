# Qurela Client - Notes Management Platform Frontend

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.local.example .env.local
# Edit .env.local if needed (default points to localhost:3001)
```

3. Start development server:
```bash
npm run dev
```

## Tech Stack

- Next.js 14 (App Router)
- Tailwind CSS
- Axios for API calls
- React Context for auth state

## Pages

| Route | Description | Access |
|-------|-------------|--------|
| / | Redirects to login | Public |
| /login | Login page | Public |
| /register | Registration page | Public |
| /dashboard | User dashboard | Auth |
| /notes | List all notes | Auth |
| /notes/new | Create note | Auth |
| /notes/:id | View note | Auth |
| /notes/:id/edit | Edit note | Auth |
| /admin | Admin panel | Admin only |

## API Integration

The frontend connects to the backend at `http://localhost:3001/api` by default.

Make sure the backend server is running before starting the frontend.

## Design

Vintage early 2000s aesthetic with:
- Windows XP-style colors
- Beveled buttons
- Gradient panels
- Soft shadows