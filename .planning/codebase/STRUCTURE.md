# Codebase Structure

**Analysis Date:** 2025-03-03

## Directory Layout

```
[project-root]/
├── public/             # Static assets (favicons, robots.txt)
├── src/                # Application source code
│   ├── assets/         # Images, logos, and global static files
│   ├── components/     # React components
│   │   └── ui/         # Reusable UI primitives (shadcn/ui)
│   ├── context/        # React Context providers for global state
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions and core business logic
│   ├── pages/          # Route-level page components
│   └── test/           # Test setup and utilities
├── package.json        # Dependencies and scripts
├── tailwind.config.ts  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

## Directory Purposes

**src/assets:**
- Purpose: Stores non-code assets used in the UI.
- Contains: PNG/JPG images, SVGs.
- Key files: `org-sentinel-logo.jpeg`.

**src/components:**
- Purpose: Application-specific React components and the UI library.
- Contains: Layout components (`Navbar.tsx`, `Footer.tsx`), feature components, and Atomic UI primitives in `ui/`.
- Key files: `Navbar.tsx`, `ProtectedRoute.tsx`.

**src/context:**
- Purpose: Centralized state management using React Context.
- Contains: Providers and custom hooks for accessing global state.
- Key files: `AuthContext.tsx`, `IntegrationContext.tsx`, `SimulationContext.tsx`.

**src/lib:**
- Purpose: Pure logic, mock data, and utilities.
- Contains: Simulation engine, mock API data, and styling utilities.
- Key files: `simulationEngine.ts`, `mockApiData.ts`, `utils.ts`.

**src/pages:**
- Purpose: Components corresponding to application routes.
- Contains: High-level page layouts and data orchestration.
- Key files: `Landing.tsx`, `Simulate.tsx`, `Integrations.tsx`, `DashboardDemo.tsx`.

## Key File Locations

**Entry Points:**
- `src/main.tsx`: React DOM mounting point.
- `src/App.tsx`: Main application wrapper, provider setup, and router.

**Configuration:**
- `tailwind.config.ts`: Visual design system configuration.
- `components.json`: shadcn/ui configuration.
- `vite.config.ts`: Build and development server settings.

**Core Logic:**
- `src/lib/simulationEngine.ts`: Logic for risk scoring and simulation processing.

**Testing:**
- `src/test/setup.ts`: Vitest global setup.
- `src/test/example.test.ts`: Sample test file.

## Naming Conventions

**Files:**
- React Components: PascalCase (`MyComponent.tsx`).
- Hooks: camelCase starting with "use" (`useMyHook.ts`).
- Utilities/Logic: camelCase (`simulationEngine.ts`).

**Directories:**
- Feature folders: kebab-case or lowercase.

## Where to Add New Code

**New Feature:**
- Primary code: Create a new page in `src/pages/` and any feature-specific components in `src/components/`.
- Tests: Add a `.test.ts` file in `src/test/` or alongside the component.

**New Component/Module:**
- Implementation: Add to `src/components/` (if general) or `src/components/ui/` (if it's a new primitive).

**Utilities:**
- Shared helpers: Add to `src/lib/utils.ts` or a new file in `src/lib/`.

## Special Directories

**src/components/ui:**
- Purpose: Contains low-level, highly reusable components based on Radix UI.
- Generated: Partially (via shadcn/ui CLI).
- Committed: Yes.

---

*Structure analysis: 2025-03-03*
