# AGENTS.md

Guía para agentes que trabajen en este repositorio.

## Visión general

**Eventra** es un monorepo (**npm workspaces**) con dos paquetes independientes:

- **`packages/foundry`** — Contrato inteligente en Solidity y sus tests, gestionado con **Foundry/Forge**.
- **`packages/nextjs`** — Frontend en **Next.js (App Router)** con la funcionalidad de **login / register** y **creación de eventos**.

> Nota: el frontend **no interactúa con la blockchain**. La autenticación y los eventos se guardan en `localStorage` (sin backend, sin wagmi/RainbowKit/viem). Los dos paquetes son independientes entre sí.

## Comandos (desde la raíz)

```bash
npm install             # Instalar dependencias de ambos paquetes (npm workspaces)

# Contrato (Foundry)
npm run compile         # forge compile
npm test                # forge test
npm run chain           # Levantar anvil (cadena local)
npm run deploy          # Desplegar (requiere crear un script script/Deploy.s.sol)

# Frontend (Next.js)
npm start               # next dev -> http://localhost:3000
npm run next:build      # Build de producción
npm run next:check-types # tsc --noEmit

# Calidad
npm run lint            # Lint de ambos paquetes
npm run format          # Format de ambos paquetes
```

> Los scripts de la raíz delegan en los paquetes con `npm run <script> -w @eventra/<paquete>`.

## Smart contract (`packages/foundry`)

- Contratos: `packages/foundry/contracts/` (contrato principal: `EventraContract.sol`).
- Tests: `packages/foundry/test/` (`EventraContract.t.sol`).
- Config: `packages/foundry/foundry.toml`; librerías en `lib/` (forge-std, OpenZeppelin).
- Scripts: `packages/foundry/script/` contiene helpers (`DeployHelpers.s.sol`, `VerifyAll.s.sol`).
  - **No existe** todavía un `script/Deploy.s.sol` que despliegue `EventraContract`; `forge test` y `forge compile` funcionan, pero para `npm run deploy` hay que crear ese script primero.

## Frontend (`packages/nextjs`)

- Páginas (App Router) en `app/`: `page.tsx` (home), `login/`, `register/`, `events/create/`.
- Autenticación: `utils/eventra/auth.ts` (registro/login/sesión sobre `localStorage`).
- Eventos: `utils/eventra/events.ts`.
- Hook de sesión: `hooks/eventra/useEventraSession.ts`.
- Estilos: **Tailwind CSS v4** (sin DaisyUI). Estilos globales en `styles/globals.css`.
- Alias de import: usar `~~/` (configurado en `tsconfig.json`), p. ej. `import { loginUser } from "~~/utils/eventra/auth"`.

## Convenciones

- TypeScript: preferir `type` sobre `interface`; evitar tipados explícitos cuando se pueden inferir.
- Páginas Next como `const X: NextPage = () => { ... }` con `export default`.
- Comentarios solo cuando aporten información.
