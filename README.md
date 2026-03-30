<p align="center">
    <b>Select Language:</b><br>
    <a href="README.md">🇺🇸 English</a> |
    <a href="README.sp.md">🇪🇸 Español</a>
</p>

---

<p align="center">
  <h1 align="center">💸 LUKA Frontend — Digital Wallet App</h1>
  <p align="center">Angular 19 mobile-first PWA for the LUKA fintech platform</p>
</p>

---

## What is this?

This is the frontend application for LUKA — a digital wallet platform inspired by Yape and Revolut. Built with Angular 19 using standalone components, it connects to the [LUKA Backend](https://github.com/joshua-arnao/luka) REST API.

The app is designed mobile-first with a dark theme, making it feel like a native fintech app on any device.

---

## Features

- **Authentication** — Register and login with JWT token management
- **Dashboard** — Real-time balance, recent transactions and savings goals overview
- **Send money** — Two-step transfer flow with contact search by email
- **Transaction history** — Full history with sent/received indicators
- **Savings goals** — Create goals with automatic saving rules (percentage, round-up, scheduled)
- **Notifications** — Real-time event notifications with mark as read
- **Responsive** — Mobile-first design that works on any screen size

---

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Angular | 19 | Frontend framework |
| TypeScript | 5.x | Language |
| RxJS | 7.x | Reactive programming |
| Angular Router | 19 | Client-side navigation |
| Angular HttpClient | 19 | API communication |
| SCSS | — | Styling with CSS variables |

---

## Architecture

```
src/app/
    ├── core/
    │   ├── guards/         → AuthGuard — protects authenticated routes
    │   ├── interceptors/   → AuthInterceptor — attaches JWT to every request
    │   ├── models/         → TypeScript interfaces matching backend DTOs
    │   └── services/       → API services (auth, wallet, transaction, saving, notification)
    ├── pages/
    │   ├── login/          → Login screen
    │   ├── register/       → Registration screen
    │   ├── dashboard/      → Main screen with balance and overview
    │   ├── transactions/   → Transfer money and history
    │   ├── savings/        → Savings goals management
    │   └── notifications/  → Notification center
    └── shared/
        └── components/     → Reusable UI components
```

### Key architectural decisions

**Standalone components** — Angular 19 standalone components eliminate the need for NgModules, making each component fully self-contained and easier to lazy-load.

**Lazy loading** — Every page is lazy-loaded via the router, reducing initial bundle size:

```typescript
{
  path: 'dashboard',
  loadComponent: () => import('./pages/dashboard/dashboard.component')
    .then(m => m.DashboardComponent),
  canActivate: [authGuard]
}
```

**JWT interceptor** — A functional interceptor automatically attaches the Bearer token to every outgoing HTTP request, so services never need to handle authentication manually:

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken();
  if (token) {
    return next(req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) }));
  }
  return next(req);
};
```

**Route guard** — `authGuard` protects all authenticated routes and redirects unauthenticated users to login.

**CSS variables for theming** — All colors are defined as CSS custom properties in `styles.scss`, making it trivial to change the entire theme from one place:

```scss
:root {
  --luka-bg:           #0a0a0f;
  --luka-accent:       #7C3AED;
  --luka-green:        #10B981;
  --luka-red:          #EF4444;
  // ...
}
```

---

## Design System

LUKA uses a custom dark design system inspired by Revolut. All design tokens live in `src/styles/tokens.scss`.

### Color palette

| Token | Value | Usage |
|-------|-------|-------|
| `--luka-bg` | `#0a0a0f` | Page background |
| `--luka-surface` | `#13131a` | Surface elements |
| `--luka-card` | `#1a1a24` | Cards and panels |
| `--luka-accent` | `#7C3AED` | Primary actions |
| `--luka-accent-light` | `#8B5CF6` | Hover states |
| `--luka-green` | `#10B981` | Income, success |
| `--luka-red` | `#EF4444` | Expenses, errors |
| `--luka-yellow` | `#F59E0B` | Savings, warnings |
| `--luka-blue` | `#3B82F6` | Info, notifications |
| `--luka-text` | `#F9FAFB` | Primary text |
| `--luka-muted` | `#6B7280` | Secondary text |

---

## Running Locally

### Prerequisites

- Node.js 20+
- Angular CLI 19

### Steps

**1. Clone the repository**
```bash
git clone https://github.com/joshua-arnao/luka-frontend.git
cd luka-frontend
```

**2. Install dependencies**
```bash
npm install
```

**3. Make sure the backend is running**

The app connects to `http://localhost:8080/api` by default. See the [LUKA Backend](https://github.com/joshua-arnao/luka) repository to set it up.

**4. Start the development server**
```bash
ng serve
```

**5. Open the app**
```
http://localhost:4200
```

---

## Environment Configuration

The API base URL is configured in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

For production, update `src/environments/environment.prod.ts` with your deployed backend URL.

---

## User Flow

```
Register → Login → Dashboard
                      ↓
              ┌───────┼───────┐
              ↓       ↓       ↓
         Send money  Savings  Notifications
              ↓       ↓
         History   Create goal + rule
```

### Send money flow (2 steps)
1. Enter recipient email → system finds their wallet
2. Enter amount → confirm and send

### Create savings goal flow
1. Enter goal name, description and target amount
2. Choose saving rule — Percentage / Round-up / Scheduled
3. Configure rule parameters
4. Goal created with automatic saving rule active

---

## What I Learned Building This

- **Angular 19 standalone components** — modern Angular without NgModules
- **Functional interceptors** — the new Angular HTTP interceptor pattern
- **Route-based lazy loading** — optimizing bundle size
- **JWT token management** — storing and sending tokens securely
- **Reactive forms with RxJS** — handling async API calls with observables
- **Mobile-first CSS** — designing for small screens first
- **CSS custom properties** — building a maintainable design system

---

## Related

- [LUKA Backend](https://github.com/joshua-arnao/luka) — Spring Boot REST API

---

## Author

**Joshua Arnao**
Autodidact developer passionate about fintech and clean architecture.
