# App Stability Infrastructure

## Status: ✅ IMPLEMENTED

All stability infrastructure has been added to prevent crashes, handle offline states, and centralize module configuration.

---

## New Infrastructure

### 1. ErrorBoundary (`src/components/ErrorBoundary.tsx`)
- **Catches all React errors** and prevents white screens
- Child-friendly error UI with "Try Again" and "Go Home" buttons
- Shows technical details in development mode only
- Wraps the entire app at the root level

### 2. AppShell (`src/components/AppShell.tsx`)
- **Orchestration layer** that handles:
  - Auth state initialization (proper listener order)
  - Loading states during hydration
  - Offline detection with fallback UI
  - Error states with recovery options
- Exports `useAppState()` hook for components

### 3. Module Registry (`src/config/modules.ts`)
- **Centralized module configuration** with:
  - `enabled` - Feature flag for each module
  - `awardsTokens` - Only Reading, Math, Writing = true
  - `requiresAuth` - For future auth-gated features
  - `parentOnly` - For parent-only modules
  - `order` - Navigation ordering
- Helper functions: `getEnabledModules()`, `doesModuleAwardTokens()`, etc.

### 4. Updated App.tsx
- ErrorBoundary wraps everything
- AppShell wraps routes
- QueryClient configured with retry and staleTime

---

## Architecture Improvements

| Before | After |
|--------|-------|
| Crash = white screen | Crash = friendly error UI |
| No loading state | Clear loading spinner |
| Offline = broken | Offline = detected + fallback |
| Token logic scattered | Token logic centralized in registry |
| Module config duplicated | Single source of truth in registry |

---

## Files Created/Modified

| File | Action |
|------|--------|
| `src/components/ErrorBoundary.tsx` | **Created** - React error boundary |
| `src/components/AppShell.tsx` | **Created** - App orchestration layer |
| `src/config/modules.ts` | **Created** - Module registry |
| `src/App.tsx` | **Modified** - Wrapped with ErrorBoundary + AppShell |
| `src/pages/Index.tsx` | **Modified** - Uses module registry for tokens |

---

## Usage

### Check if module awards tokens:
```typescript
import { doesModuleAwardTokens } from '@/config/modules';

if (doesModuleAwardTokens('reading')) {
  // Award tokens
}
```

### Access app state from any component:
```typescript
import { useAppState } from '@/components/AppShell';

const { user, isAuthenticated, isLoading } = useAppState();
```

### Get all enabled modules:
```typescript
import { getEnabledModules } from '@/config/modules';

const modules = getEnabledModules();
```
