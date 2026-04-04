# Smart Secure EVM Backend

Production-ready backend for a Smart Secure Electronic Voting Machine platform.

## Stack

- Node.js + Express
- PostgreSQL + Prisma ORM
- JWT auth + bcrypt
- Zod validation
- Helmet, CORS, Morgan, rate limiting

## Setup

1. Copy environment file:
   - `cp .env.example .env` (or create `.env` manually on Windows)
2. Install dependencies:
   - `npm install`
3. Generate Prisma client and run migrations:
   - `npx prisma generate`
   - `npx prisma migrate dev --name init`
4. Seed sample data:
   - `npm run seed`
5. Start app:
   - `npm run dev`

## API Base

- `http://localhost:5000/api`

## Default Seeded Admin

- Email: `admin@evm.com`
- Password: `Admin@123`

Change these credentials immediately in production.
