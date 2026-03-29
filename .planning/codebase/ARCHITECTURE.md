# Architecture

**Analysis Date:** 2025-03-03

## Pattern Overview

**Overall:** React Single Page Application (SPA) with a Provider-Consumer pattern for state management and a client-side logic engine for simulations.

**Key Characteristics:**
- **Context-Driven State:** Global application state (Auth, Integrations, Simulation) is managed through React Context providers located in `src/context/`.
- **Decoupled Business Logic:** Core simulation and risk analysis logic is isolated in a "logic layer" within `src/lib/`, independent of React components.
- **Component-Based UI:** Modular UI built with Atomic design principles, utilizing a collection of reusable base components in `src/components/ui/` (shadcn/ui).

## Layers

**UI Layer:**
- Purpose: Handles user interaction and data presentation.
- Location: `src/pages/` and `src/components/`
- Contains: React components, hooks for UI state, and styling.
- Depends on: Contexts, hooks, and UI primitives.
- Used by: End users.

**State Layer:**
- Purpose: Manages global application state and provides it to the UI.
- Location: `src/context/`
- Contains: React Context providers (`AuthContext.tsx`, `IntegrationContext.tsx`, `SimulationContext.tsx`).
- Depends on: Logic layer for data processing.
- Used by: UI components.

**Logic Layer:**
- Purpose: Processes data and executes core business rules (e.g., risk scoring).
- Location: `src/lib/`
- Contains: Simulation engine (`simulationEngine.ts`), mock data utilities (`mockApiData.ts`), and helper functions (`utils.ts`).
- Depends on: None (pure functions).
- Used by: Context providers and page components.

## Data Flow

**Simulation Flow:**

1. User inputs access entries or triggers a "Simulate" action in `src/pages/Simulate.tsx`.
2. The page component calls the `runSimulation` function from `src/lib/simulationEngine.ts`.
3. The logic engine processes the data against predefined rules and returns a `SimulationResult`.
4. The result is stored in `SimulationContext` via `setResult`.
5. The UI (Dashboard, Heatmap, etc.) re-renders to reflect the new state.

**State Management:**
- Global state is handled by Context Providers wrapped around the application in `src/App.tsx`.
- Authentication state is persisted in `sessionStorage` within `src/context/AuthContext.tsx`.
- UI-specific state (like form inputs) is handled locally within components using `useState` or `react-hook-form`.

## Key Abstractions

**Context Providers:**
- Purpose: Encapsulate related state and provide an interface for updates.
- Examples: `src/context/AuthContext.tsx`, `src/context/IntegrationContext.tsx`
- Pattern: Provider-Consumer using `useContext` hook.

**Simulation Engine:**
- Purpose: Pure functional core for risk analysis.
- Examples: `src/lib/simulationEngine.ts`
- Pattern: Strategy pattern for rule application.

## Entry Points

**Main Entry:**
- Location: `src/main.tsx`
- Triggers: Initial page load.
- Responsibilities: Mounts the React application to the DOM.

**App Root:**
- Location: `src/App.tsx`
- Triggers: Component mount.
- Responsibilities: Sets up the QueryClient, Context Providers, and defines application routing.

## Error Handling

**Strategy:** Declarative error handling through UI feedback.

**Patterns:**
- **Toasts:** User feedback for actions (e.g., login success/failure, connection status) using `src/components/ui/use-toast.ts` and `sonner`.
- **Validation:** Client-side form validation using `zod` and `react-hook-form`.
- **Not Found:** Catch-all route in `src/App.tsx` renders `src/pages/NotFound.tsx`.

## Cross-Cutting Concerns

**Logging:** Currently uses `console` for debugging (minimal).
**Validation:** Handled by `zod` schemas.
**Authentication:** Managed via `src/components/ProtectedRoute.tsx` which checks session state from `AuthContext`.

---

*Architecture analysis: 2025-03-03*
