# External Integrations

**Analysis Date:** 2025-02-14

## APIs & External Services

**Development Tools:**
- Lovable (GPT Engineer) - Used for component tagging during development.
  - SDK/Client: `lovable-tagger`

**Simulated Services (Logical Integrations):**
- Azure Active Directory - Simulated identity source for roles and users.
  - Implementation: `src/context/IntegrationContext.tsx`
- Okta - Simulated identity source for roles and users.
  - Implementation: `src/context/IntegrationContext.tsx`
- Google Workspace - Simulated identity source for roles and users.
  - Implementation: `src/context/IntegrationContext.tsx`
- AWS CloudTrail - Simulated cloud audit logs.
  - Implementation: `src/context/IntegrationContext.tsx`
- GCP Audit Logs - Simulated cloud audit logs.
  - Implementation: `src/context/IntegrationContext.tsx`
- HRIS Systems - Simulated source for employee and department data.
  - Implementation: `src/context/IntegrationContext.tsx`
- Note: Current implementation uses `src/lib/mockApiData.ts` and `src/context/IntegrationContext.tsx` to simulate these integrations.

## Data Storage

**Databases:**
- None (Local state only)
  - Current data is hardcoded/mocked in `src/lib/mockApiData.ts`

**File Storage:**
- None (Local filesystem assets only)

**Caching:**
- TanStack Query (local client-side cache only)
  - Configured in `src/App.tsx`

## Authentication & Identity

**Auth Provider:**
- Custom (Simulated)
  - Implementation: `src/context/AuthContext.tsx`
  - Persistence: `sessionStorage` (`org_sentinel_session`)

## Monitoring & Observability

**Error Tracking:**
- None detected

**Logs:**
- Browser console and custom simulated events in `src/context/IntegrationContext.tsx`.

## CI/CD & Deployment

**Hosting:**
- Not explicitly defined in codebase (Standard Vite SPA)

**CI Pipeline:**
- None detected

## Environment Configuration

**Required env vars:**
- None identified as mandatory for current simulation mode.

**Secrets location:**
- Not applicable (Mocked implementation)

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

---

*Integration audit: 2025-02-14*
