# Links

[Live Demo](https://links.robbe.tech)

## Overview

**Links** is a web application for organizing, sharing, and managing collections of links and documents, designed with education and collaborative environments in mind. Built with [Next.js](https://nextjs.org) and [TypeScript](https://www.typescriptlang.org/), it leverages [Supabase](https://supabase.com/) for authentication and database services.

## Features

- **Course & Item Management**: Organize links and resources into courses and categories.
- **User Authentication**: Secure login, signup, password reset, and account deletion via Supabase.
- **Role-Based Access**: Differentiate between users and roles (e.g., teachers, enrolled students).
- **Fast Search & Filtering**: Quickly find resources and links within collections.
- **Responsive UI**: Modern design using Geist fonts and Vercel's best practices.
- **Vercel Analytics**: Built-in analytics for usage tracking.
- **Auto-deployment**: Ready for instant deployment to [Vercel](https://vercel.com).

## Getting Started

To run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Project Structure

- `app/`: Next.js app directory structure.
  - `components/ui/`: UI components.
  - `utils/supabase/`: Supabase integration, authentication, and schema.
  - `(authenticated)/course/`: Course-specific pages and logic.
- `middleware.ts`: Handles authentication session via Supabase.
- `next.config.ts`: Next.js configuration including custom rewrites.

## Authentication

The app uses Supabase for authentication. Main actions include:
- **Sign Up / Sign In**
- **Password Reset**
- **Account Deletion**
- **Role-based Access Control**

See `app/utils/supabase/auth_actions.ts` for implementation details.

## Database Schema

Main tables:
- `course`: Courses containing collections of items.
- `item`: Individual resources or links.
- `enrolment`: Tracks which users are enrolled in which courses.
- `user`: User accounts with role assignment.
- `userRole` & `docType`: Support for role management and document typing.

See `app/utils/supabase/supabase.ts` for full schema and relationships.

## Deployment

Deploy instantly to Vercel:

[Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)

Or see [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more options.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

---

**Author**: [Robbe-something](https://github.com/Robbe-something)
