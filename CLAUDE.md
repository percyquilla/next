# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server (Turbopack by default, outputs to .next/dev)
npm run build    # Production build (Turbopack by default)
npm run start    # Start production server
npm run lint     # Run ESLint directly (not `next lint` — that was removed in v16)
```

To use Webpack instead of Turbopack: `next dev --webpack` / `next build --webpack`.

## Architecture

This is a **Next.js 16** App Router project with React 19.2 and **Material UI (MUI) v9**.

- `app/` — App Router root. All routes are file-system based.
- `app/layout.tsx` — Root layout: wraps the app with `AppRouterCacheProvider` (emotion SSR) and `ThemeProvider`. Includes `InitColorSchemeScript` for flicker-free dark mode.
- `app/page.tsx` — Home page (`/`).
- `app/globals.css` — CSS baseline + Inter font import. No Tailwind.
- `theme/theme-provider.tsx` — MUI `ThemeProvider` with `CssBaseline` and CSS Variables config.
- `theme/index.ts` — Barrel export for the theme module.
- `next.config.ts` — Typed config using `NextConfig` from `"next"`.
- `eslint.config.mjs` — ESLint flat config (v10-style); no `.eslintrc.*`.
- `public/` — Static assets served from `/`.
- Path alias `@/*` maps to the project root.

## MUI Setup

MUI is integrated via `@mui/material-nextjs` for correct SSR emotion caching:

```tsx
// app/layout.tsx (server component)
<AppRouterCacheProvider options={{ key: 'css' }}>   // emotion SSR cache
  <ThemeProvider>                                    // from theme/
    {children}
  </ThemeProvider>
</AppRouterCacheProvider>
```

- `InitColorSchemeScript` must appear inside `<body>` before the providers to avoid dark mode flash.
- `suppressHydrationWarning` on `<html>` is required because MUI writes `data-color-scheme` on the server.
- The theme uses `cssVariables` + `colorSchemes` (MUI CSS Variables API) to support light/dark mode without JavaScript re-render.
- `ThemeProvider` is a `'use client'` component; `AppRouterCacheProvider` is a server-safe wrapper.

## Next.js 16 Breaking Changes

**Read `node_modules/next/dist/docs/` for the authoritative reference before writing code.**

Key changes from v15 that affect everyday coding:

### Async Request APIs (fully enforced)
`cookies()`, `headers()`, `draftMode()`, `params`, and `searchParams` are **async only** — synchronous access was removed. Always `await` them:

```ts
// page.tsx
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
}
```

Run `npx next typegen` to generate `PageProps`, `LayoutProps`, `RouteContext` helpers.

### `middleware` → `proxy`
The `middleware.ts` file and `middleware` export are deprecated. Rename to `proxy.ts` with a `proxy` named export. The `edge` runtime is **not** supported in `proxy` (it runs Node.js only).

### Caching APIs
- `revalidateTag` now requires a second `cacheLife` argument: `revalidateTag('posts', 'max')`
- `cacheLife` and `cacheTag` are stable — drop the `unstable_` prefix
- `updateTag` is new (Server Actions only): expires and immediately refreshes cache for read-your-writes semantics
- `refresh()` from `next/cache` refreshes the client router from a Server Action
- PPR is now opt-in via `cacheComponents: true` in `next.config.ts` (not `experimental.ppr`)

### Removed APIs
- `next lint` CLI command — use `eslint` directly
- `serverRuntimeConfig` / `publicRuntimeConfig` — use `process.env` and `NEXT_PUBLIC_` prefix
- `next/legacy/image` — use `next/image`
- `images.domains` — use `images.remotePatterns`
- AMP support (`next/amp`, `useAmp`)
- `experimental.dynamicIO` / `experimental.useCache` — replaced by `cacheComponents`
- `next build` no longer runs the linter automatically

### Other v16 Changes
- Turbopack is the **default** bundler for both `next dev` and `next build`
- `turbopack` config moved from `experimental.turbopack` to top-level `turbopack`
- Parallel route slots require explicit `default.js` files (build fails without them)
- `next dev` outputs to `.next/dev` (separate from `next build` output)
- Local images with query strings require `images.localPatterns.search` config
- `images.minimumCacheTTL` default changed from 60s to 4 hours
- `images.qualities` default is now `[75]` only
- `skipMiddlewareUrlNormalize` renamed to `skipProxyUrlNormalize`

## Server vs Client Components

All layouts and pages are **Server Components by default**. Add `'use client'` only when you need state, event handlers, lifecycle hooks, or browser APIs. Keep `'use client'` boundaries as narrow as possible to minimize JS bundle size.

Use `import 'server-only'` in files that must never run on the client.

Environment variables without `NEXT_PUBLIC_` prefix are not exposed to the client bundle.

## Deployment — Google Cloud Run

La app está desplegada en **Cloud Run**. Las variables de entorno **no** se leen del `.env.local` en producción; se configuran directamente en el servicio.

### Variables de entorno requeridas

| Variable | Descripción |
|----------|-------------|
| `WHATSAPP_PHONE_NUMBER_ID` | ID del número de WhatsApp Business (solo dígitos) |
| `WHATSAPP_ACCESS_TOKEN` | Token de acceso de Meta (System User Token permanente) |
| `WHATSAPP_VERIFY_TOKEN` | Token secreto elegido por ti para verificar el webhook |

### Configurar variables (Google Cloud Console)

1. [console.cloud.google.com/run](https://console.cloud.google.com/run) → seleccionar el servicio
2. **Editar y desplegar nueva revisión** → pestaña **Variables y secretos**
3. Sección **Variables de entorno** → **Agregar variable**
4. **Implementar**

### Configurar variables (CLI)

```bash
gcloud run services update TU_SERVICIO \
  --region TU_REGION \
  --set-env-vars "WHATSAPP_PHONE_NUMBER_ID=123456,WHATSAPP_ACCESS_TOKEN=EAAB..."
```

### Configurar con Secret Manager (recomendado para tokens)

```bash
# Crear el secreto
echo -n "EAAB..." | gcloud secrets create WHATSAPP_ACCESS_TOKEN --data-file=-

# Vincular al servicio
gcloud run services update TU_SERVICIO \
  --region TU_REGION \
  --set-secrets "WHATSAPP_ACCESS_TOKEN=WHATSAPP_ACCESS_TOKEN:latest"
```

### WhatsApp API y Webhook

**Archivos clave:**
- `actions/whatsapp.ts` — Server Action que envía mensajes con axios y guarda en el store
- `lib/message-store.ts` — Store en memoria (singleton global); persiste dentro de la instancia, se reinicia en cold start
- `app/api/webhook/whatsapp/route.ts` — Webhook de Meta (GET verificación + POST eventos)
- `app/api/messages/route.ts` — Endpoint de polling `GET /api/messages?phone=...`
- `sections/person/whatsapp-chat.tsx` — UI de chat con burbujas y polling cada 3 s

**Endpoint Meta:** `POST https://graph.facebook.com/v25.0/{PHONE_NUMBER_ID}/messages`

**Credenciales:** developers.facebook.com → tu app → WhatsApp → API Setup

**Número del destinatario:** debe estar en formato E.164 (ej. `+51987654321`)

### Configurar Webhook en Meta

1. **developers.facebook.com** → tu app → **WhatsApp** → **Configuration**
2. En **Webhooks** → **Edit**:
   - **Callback URL:** `https://tu-dominio.run.app/api/webhook/whatsapp`
   - **Verify token:** valor de `WHATSAPP_VERIFY_TOKEN`
3. **Verify and save**
4. Suscribirse al campo: `messages`

**Flujo de estados:** `sending` → `sent` (✓) → `delivered` (✓✓) → `read` (✓✓ azul)

El webhook actualiza el store al recibir cada evento; el chat lo refleja en el siguiente ciclo de polling (3 s).
