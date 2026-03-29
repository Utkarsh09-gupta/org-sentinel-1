# Technology Stack

**Analysis Date:** 2025-02-14

## Languages

**Primary:**
- TypeScript 5.8.3 - Main development language for application logic and components

**Secondary:**
- CSS (PostCSS) - Styling configuration and Tailwind integration
- HTML5 - Entry point and structure

## Runtime

**Environment:**
- Browser (Client-side Execution)
- Node.js (Build-time environment)

**Package Manager:**
- Bun / npm
- Lockfile: `bun.lock`, `bun.lockb`, and `package-lock.json` present

## Frameworks

**Core:**
- React 18.3.1 - UI Library
- Vite 5.4.19 - Build Tool and Dev Server
- React Router DOM 6.30.1 - Client-side Routing

**Testing:**
- Vitest 3.2.4 - Test Runner
- React Testing Library 16.0.0 - Component Testing
- JSDom 20.0.3 - Browser Simulation for tests

**Build/Dev:**
- @vitejs/plugin-react-swc 3.11.0 - Fast React Refresh using SWC
- Tailwind CSS 3.4.17 - Utility-first styling
- ESLint 9.32.0 - Linting
- Lovable Tagger 1.1.13 - Dev tool for component tagging

## Key Dependencies

**Critical:**
- @radix-ui/react-* - Accessible UI primitive components
- Framer Motion 12.35.1 - Animation library
- Lucide React 0.462.0 - Icon library
- Recharts 2.15.4 - Data visualization

**Infrastructure:**
- @tanstack/react-query 5.83.0 - Async state management (prepared for API integration)
- React Hook Form 7.61.1 - Form management
- Zod 3.25.76 - Schema validation

## Configuration

**Environment:**
- Configured via `.env` (Note: `.env` existence only, no contents read)
- Vite-based environment variable handling

**Build:**
- `vite.config.ts`: Main build configuration with path aliases and plugins
- `tsconfig.json`: TypeScript compiler settings including path mapping `@/*` to `src/*`
- `tailwind.config.ts`: Styling configuration
- `components.json`: Shadcn UI configuration

## Platform Requirements

**Development:**
- Node.js environment
- Bun or npm package manager

**Production:**
- Static site hosting (Vite build output)

---

*Stack analysis: 2025-02-14*
