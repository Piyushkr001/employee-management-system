# EmpNexa

EmpNexa is a full-stack Employee Management System built with a modern stack prioritizing security, role-based access control, and a rich user interface.

## Stack
- **Frontend**: Next.js App Router, Tailwind CSS, Shadcn UI, React Hook Form, Zod
- **Backend**: Express.js, TypeScript, Drizzle ORM, PostgreSQL
- **Shared**: Zod schemas, TypeScript types
- **Monorepo**: Bun workspaces

## Features
- Secure JWT-based authentication using HTTP-only cookies
- Role-based Access Control (Super Admin, HR Manager, Employee)
- Full Employee CRUD operations with advanced table filtering, sorting, and pagination
- Circular manager prevention and Last Active Super Admin protection
- Transaction-safe architecture protecting against concurrent updates and soft deletions
- Explicit backend field rejection for forbidden modifications
- Standardized API responses and error handling
- **Scope Note**: Direct-reportees APIs, Dashboard analytics, Organization hierarchy visuals, and dedicated manager-assignment APIs are intentionally omitted from this stabilization phase.

## Getting Started
1. Install Bun version `1.3.14`
2. Clone the repository and run `bun install`
3. Setup PostgreSQL database and update `.env` in `apps/api`
4. Run `bun db:migrate` in `apps/api` to apply schema changes
5. Ensure `ALLOW_DEMO_SEED=true` is set in `apps/api/.env` (This is a safety override to prevent accidental seeding in production). Safe database names for local development are `empnexa_dev`, `empnexa_test`, or `empnexa_local`.
6. Run `bun db:seed` in `apps/api` to create default demo accounts and the full ten-person seed hierarchy (running this command again will restore any soft-deleted demo accounts).
   - Super Admin: `admin@empnexa.com` / `Admin@123`
   - HR Manager: `hr@empnexa.com` / `HrManager@123`
   - Employee: `frontend@empnexa.com` / `Welcome@123`
6. Update `.env.test` in `apps/api` with `TEST_DATABASE_URL` (this database will be completely wiped during tests! Ensure `TEST_DATABASE_URL` explicitly contains 'test' in the DB name)
7. Run `bun run test:db` in `apps/api` to verify backend integrity
8. Run `bun dev` in the root directory to start both web and api servers
9. If deploying behind a reverse proxy (e.g. Nginx or Vercel), ensure `TRUST_PROXY=true` is set in `apps/api/.env`.

## Documentation
- [API Documentation](./API.md)
- [RBAC & Permissions](./RBAC.md)
