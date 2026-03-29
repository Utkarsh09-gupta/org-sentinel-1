# Coding Conventions

**Analysis Date:** 2026-03-29

## Naming Patterns

**Files:**
- Components/Pages/Context: PascalCase (e.g., `src/components/Navbar.tsx`, `src/pages/Simulate.tsx`, `src/context/AuthContext.tsx`).
- Shadcn UI Components: kebab-case (e.g., `src/components/ui/button.tsx`, `src/components/ui/alert-dialog.tsx`).
- Hooks: kebab-case with `use-` prefix (e.g., `src/hooks/use-toast.ts`, `src/hooks/use-mobile.tsx`).
- Logic/Utilities/Data: camelCase (e.g., `src/lib/simulationEngine.ts`, `src/lib/mockApiData.ts`).

**Functions:**
- React Components: PascalCase (e.g., `const Navbar = () => { ... }`).
- Hooks: camelCase with `use` prefix (e.g., `export function useIsMobile() { ... }`).
- General functions: camelCase (e.g., `function applyRules(...) { ... }`).

**Variables:**
- General variables: camelCase (e.g., `const [mobileOpen, setMobileOpen] = useState(false);`).
- Constants: SCREAMING_SNAKE_CASE (e.g., `const MOBILE_BREAKPOINT = 768;` in `src/hooks/use-mobile.tsx`).

**Types:**
- Interfaces and Types: PascalCase (e.g., `interface State`, `type ToasterToast`).

## Code Style

**Formatting:**
- Controlled by ESLint and presumably Prettier (though config file not found, style is consistent).
- Uses 2-space indentation.
- Semicolons are used.

**Linting:**
- Tool: ESLint 9.32.0.
- Config: `eslint.config.js`.
- Key Rules:
  - `react-hooks/recommended`.
  - `@typescript-eslint/recommended`.
  - `@typescript-eslint/no-unused-vars`: "off" (explicitly disabled in `eslint.config.js`).

## Import Organization

**Order:**
1. React and standard library imports (e.g., `import { useState } from "react";`).
2. Third-party library imports (e.g., `import { motion } from "framer-motion";`).
3. Internal module imports using `@/` alias (e.g., `import { useAuth } from "@/context/AuthContext";`).
4. Asset and style imports (e.g., `import logo from "@/assets/org-sentinel-logo.jpeg";`).

**Path Aliases:**
- `@/` maps to `src/` as defined in `tsconfig.json` and `vite.config.ts`.

## Error Handling

**Patterns:**
- User-facing errors: Handled via the `toast` function from `src/hooks/use-toast.ts`.
- Logic errors: Basic `try-catch` or conditional checks (e.g., `if (entries.length === 0) { ... }` in `src/pages/Simulate.tsx`).

## Logging

**Framework:** Standard `console` (not prominently used in production code).

## Comments

**When to Comment:**
- Minimal commenting observed. Comments used for clarifying complex logic or "Side effects" warnings (e.g., in `src/hooks/use-toast.ts`).

**JSDoc/TSDoc:**
- Not strictly enforced; primarily used for defining types and interfaces.

## Function Design

**Size:** Components and functions are kept relatively small and focused.

**Parameters:** Prefer object destructuring for props in React components.

**Return Values:** React components return JSX/TSX. Hooks return objects or values.

## Module Design

**Exports:**
- Components: Prefer `export default` at the end of the file.
- Hooks/Utils: Prefer named exports (e.g., `export const useToast = ...`).

**Barrel Files:**
- Not extensively used, but `src/hooks/use-toast.ts` acts as a local barrel for toast-related functionality.

---

*Convention analysis: 2026-03-29*
