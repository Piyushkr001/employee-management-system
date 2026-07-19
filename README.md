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
- Explicit backend field rejection for forbidden modifications
- Standardized API responses and error handling

## Getting Started
1. Clone the repository
2. Run `bun install`
3. Setup PostgreSQL database and update `.env` in `apps/api`
4. Run `bun db:push` in `apps/api`
5. Run `bun db:seed` in `apps/api` to create the default super admin
6. Run `bun dev` in the root directory to start both web and api servers

## Documentation
- [API Documentation](./API.md)
- [RBAC & Permissions](./RBAC.md)
