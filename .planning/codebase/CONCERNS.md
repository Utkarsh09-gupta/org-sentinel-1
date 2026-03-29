# Codebase Concerns

**Analysis Date:** 2024-03-20

## Tech Debt

**Simulated Backend and Infrastructure:**
- Issue: The entire backend functionality, including data ingestion, integration status, and real-time events, is currently simulated in the frontend.
- Files: `src/context/IntegrationContext.tsx`, `src/lib/mockApiData.ts`, `src/pages/Simulate.tsx`
- Impact: Transitions to a real production environment will require a complete rewrite of the data fetching and state management logic. The current architecture tightly couples the UI with mock data generators.
- Fix approach: Abstract data fetching into a dedicated service layer or use `@tanstack/react-query` to manage server state, replacing `setTimeout` and `Math.random()` with actual API calls.

**Main-Thread Heavy Simulation:**
- Issue: The risk simulation engine runs entirely on the main thread and uses multiple O(N) passes to calculate risks and build the graph.
- Files: `src/lib/simulationEngine.ts`
- Impact: With real-world datasets (thousands of access entries), the simulation will likely block the main thread, causing the UI to freeze or become unresponsive.
- Fix approach: Move the simulation engine to a Web Worker or, ideally, perform the calculation on the backend and return the results via API.

**Frontend-Only Authentication:**
- Issue: Authentication is currently managed purely in-memory/sessionStorage without server-side validation or secure token handling.
- Files: `src/context/AuthContext.tsx`, `src/components/ProtectedRoute.tsx`
- Impact: Security is purely cosmetic; there's no actual protection of data or resources from unauthorized access beyond simple UI redirects.
- Fix approach: Implement a robust OAuth2/JWT-based authentication flow with proper backend validation and secure cookie management.

## Performance Bottlenecks

**Graph Visualization Scalability:**
- Problem: The access graph in the dashboard uses a manual, non-dynamic layout algorithm that won't scale with more than a dozen nodes.
- Files: `src/pages/DashboardDemo.tsx` (function `layoutNodes`)
- Cause: Hardcoded positioning and simple trigonometric distributions are used instead of a robust force-directed graph library.
- Improvement path: Replace the custom SVG layout with a dedicated library like `react-force-graph` or `d3-force` for better performance and readability with larger datasets.

**Large UI Component Complexity:**
- Problem: Some UI components are excessively large, which can lead to maintainability issues and minor rendering overhead.
- Files: `src/components/ui/sidebar.tsx` (584 lines)
- Cause: Standard shadcn/ui boilerplate includes many sub-components in a single file.
- Improvement path: Decompose the sidebar into smaller, more focused sub-components if customization becomes complex.

## Security Considerations

**Data Privacy in Simulation:**
- Risk: Sensitive access logs and identity data are processed in the browser. In a multi-tenant environment, this increases the risk of data leakage if the client state is compromised.
- Files: `src/lib/simulationEngine.ts`, `src/context/SimulationContext.tsx`
- Current mitigation: None (data is currently mock only).
- Recommendations: Process sensitive simulations on the server and only send the aggregated risk results and necessary graph metadata to the client.

**Lack of CSRF/XSS Protections:**
- Risk: As the app is currently a frontend-only prototype, standard web security headers and protections (CSRF tokens, Content Security Policy) are not yet implemented.
- Files: `index.html`, `vite.config.ts`
- Recommendations: Implement a strict CSP and ensure the backend (when built) uses standard security middlewares.

## Fragile Areas

**Integration Data Mapping:**
- Files: `src/context/IntegrationContext.tsx`, `src/lib/simulationEngine.ts`
- Why fragile: The "Simulation Engine" expects a very specific `AccessEntry` format which is currently manually mapped from mock data. Adding new integration types (e.g., Jira, Slack) will likely require changes to the core engine.
- Safe modification: Define a strict schema for access entries using Zod and implement adapters for each new integration type.

## Test Coverage Gaps

**Untested Core Logic:**
- What's not tested: The `simulationEngine` logic (risk scoring, rule application, and graph building) has zero test coverage despite being the core value proposition.
- Files: `src/lib/simulationEngine.ts`
- Risk: Future changes to risk rules or scoring logic could introduce regressions that go unnoticed, leading to incorrect risk assessments.
- Priority: High

**Missing Integration Tests:**
- What's not tested: The interaction between `IntegrationContext`, `SimulationContext`, and the `Simulate` page.
- Files: `src/pages/Simulate.tsx`, `src/context/IntegrationContext.tsx`
- Risk: The complex "fetch and run" flow in the simulation UI is prone to state-related bugs.
- Priority: Medium

---

*Concerns audit: 2024-03-20*
