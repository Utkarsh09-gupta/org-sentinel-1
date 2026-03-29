# Testing Patterns

**Analysis Date:** 2026-03-29

## Test Framework

**Runner:**
- Vitest 3.2.4
- Config: `vitest.config.ts`

**Assertion Library:**
- Vitest built-in `expect`
- `@testing-library/jest-dom` (via `src/test/setup.ts`)

**Run Commands:**
```bash
npm test              # Run all tests once
npm run test:watch     # Run tests in watch mode
```

## Test File Organization

**Location:**
- Tests can be co-located or placed in `src/test/` (e.g., `src/test/example.test.ts`).

**Naming:**
- Files matching `src/**/*.{test,spec}.{ts,tsx}` as specified in `vitest.config.ts`.

## Test Structure

**Suite Organization:**
Standard `describe`, `it`, and `expect` blocks provided globally by Vitest configuration.

```typescript
import { describe, it, expect } from "vitest";

describe("example suite", () => {
  it("should perform a passing assertion", () => {
    expect(true).toBe(true);
  });
});
```

**Patterns:**
- `setup.ts`: Global test setup (located at `src/test/setup.ts`) handles environment-wide mocks like `window.matchMedia`.

## Mocking

**Framework:** Vitest built-ins (`vi`).

**What to Mock:**
- Browser APIs not supported by `jsdom` (e.g., `matchMedia` in `src/test/setup.ts`).
- External API calls in complex integration tests (none currently present).

**What NOT to Mock:**
- Pure logic (e.g., `src/lib/simulationEngine.ts` should be tested with real input data).

## Fixtures and Factories

**Test Data:**
Mock data is centralized for both development and testing.

**Location:**
- `src/lib/mockApiData.ts`: Contains functions like `fetchMockAccessEntries` providing data for the simulation engine and UI components.

## Coverage

**Requirements:** None explicitly enforced in `vitest.config.ts` or `package.json`.

**View Coverage:**
```bash
# Add coverage package if needed (not in current devDependencies)
# vitest run --coverage
```

## Test Types

**Unit Tests:**
- Used for pure logic and utility functions. Example: `src/test/example.test.ts`.

**Integration Tests:**
- React component testing using `@testing-library/react` and `jsdom`.

## Common Patterns

**Async Testing:**
- Standard Vitest async patterns (`async`/`await` within `it` blocks).

**Error Testing:**
- Using `expect(...).toThrow()` for synchronous errors or `expect(...).rejects.toThrow()` for async ones.

---

*Testing analysis: 2026-03-29*
