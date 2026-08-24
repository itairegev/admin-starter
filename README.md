# Admin Starter

A clone-to-start admin boilerplate: a warm-beige + blue design system (tokens +
core components, light/dark, RTL-ready) pre-wired with Clerk session and user
management inside a working admin shell.

**Stack:** Next.js (App Router) · TypeScript strict · CSS Modules · Clerk · pnpm.
No Tailwind, no component library, no database.

## Quick start

```bash
pnpm install
cp .env.example .env.local   # then fill in your Clerk keys
pnpm dev
```

Visit `http://localhost:3000` → you are redirected to `/sign-in` → after
signing in you land on the dashboard.

### Clerk setup (one-time per project)

1. Create an application at <https://dashboard.clerk.com>.
2. Copy the **publishable key** and **secret key** into `.env.local`.
3. **Enable Organizations** (Configure → Organizations) — the Members page is
   built on Clerk organizations: members, invitations, and roles all live in
   Clerk, so the starter needs no database.
4. Enable the sign-in strategies you want (email+password is the simplest).

Gotchas worth knowing on a fresh Clerk instance:
- Invitation emails only send on paid plans / configured email; on a dev
  instance, copy the invite link from the Clerk dashboard instead.
- If you change the dev port, no Clerk change is needed for localhost, but
  production domains must be added in Clerk → Domains.
- The `/admin/members` page shows a "create organization" prompt until the
  signed-in user belongs to one.

## What's inside

```
app/
  layout.tsx               ClerkProvider + Noto Sans / Noto Sans Hebrew fonts
  globals.css              imports the design tokens + base styles
  sign-in/  sign-up/       Clerk auth pages, themed to the design system
  admin/
    layout.tsx             ToastProvider + AdminShell (auth-protected)
    page.tsx               Dashboard: stat cards + sortable table (mock data)
    settings/              Component showcase: Tabs, Inputs, Modal, Toasts
    members/               Clerk org members: invite / role change / remove
middleware.ts              clerkMiddleware — everything protected except auth pages
src/
  design-system/
    tokens.css             ALL design tokens (light + dark themes)
    components/            Button, Input, Select, Card, Table, Modal,
                           Tabs, Tag, Toast, PageHeader
  shell/
    AdminShell.tsx         Fixed sidebar (collapsible) + header layout
    Header.tsx             Theme toggle, RTL toggle, OrganizationSwitcher, UserButton
    Sidebar.tsx            Nav items — edit NAV_ITEMS to add pages
```

## Design tokens

Everything themable is a CSS variable in `src/design-system/tokens.css`.
Light is the default; dark overrides live under `[data-theme='dark']`.

| Token | Value (light) | Used for |
|---|---|---|
| `--color-primary` | `#4d6cf5` | Buttons, links, active nav |
| `--color-background` | `#f8f7f3` | Page background (warm beige) |
| `--color-card` | `#ffffff` | Cards, tables, header, modals |
| `--color-border` | `#eceadf` | All borders |
| `--color-foreground` | `#131313` | Primary text |
| `--radius-md` / `--radius-lg` | `8px` / `10px` | Inputs+buttons / cards |
| `--tag-{blue,teal,green,lilac,orange,pink}-*` | 6-color tag system | `<Tag color=...>` |
| `--space-1..16` | 4px…64px scale | All spacing |
| `--font-sans` | Noto Sans + Noto Sans Hebrew | Everything |

To rebrand a new project: change `--color-primary*` (and optionally the beige
neutrals) in `tokens.css`, swap the fonts in `app/layout.tsx`, and set the
`brand` prop on `AdminShell`.

## Components

All components are exported from `@/src/design-system/components`:

| Component | Notes |
|---|---|
| `Button` | variants: `primary` `default` `ghost` `danger`; sizes `sm` `md` `lg`; `block` |
| `Input` | label / error / hint built in |
| `Select` | styled native select — no dropdown library |
| `Card` | optional `title` + `extra` header slot; `hoverable` |
| `Table<T>` | typed columns, opt-in sorting via `sortValue`, built-in empty state |
| `Modal` | Escape + overlay-click close, footer slot |
| `Tabs` | underline style |
| `Tag` | 6 colors, `outlined` variant |
| `ToastProvider` / `useToast` | `toast('success', 'Saved')` — variants: success, error, warning, info |
| `PageHeader` | title / subtitle / description + actions row |

## Theming & RTL

- **Theme:** `data-theme="light" | "dark"` on `<html>`. The header has a
  toggle (persisted to `localStorage`).
- **RTL:** set `dir="rtl"` on `<html>` — the entire shell uses CSS logical
  properties, so the sidebar, paddings, and toasts flip automatically. The
  header also has an LTR/RTL toggle for testing.

## Starting a new project from this template

1. Copy the repo (or `git clone` + remove `.git`).
2. `pnpm install`, create a Clerk app, fill `.env.local`.
3. Rename: `package.json` name, `brand`/`title` in `app/admin/layout.tsx`,
   `<title>` metadata in `app/layout.tsx`.
4. Replace the dashboard's mock data and add real pages (add nav items in
   `src/shell/Sidebar.tsx`).

## Verification commands

```bash
pnpm build        # includes type + lint checks
pnpm typecheck    # tsc --noEmit
pnpm lint
```
