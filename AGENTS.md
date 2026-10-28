# Repository Guidelines

## Project Structure & Module Organization

The application lives in `alpo/`, a Next.js 14 App Router project using React, strict TypeScript, and Tailwind CSS.

- `app/`: pages, layouts, global styles, and API handlers (`api/analyze` and `api/register`).
- `components/`: reusable UI components such as `AudioUploader.tsx`.
- `lib/`: risk detection, evidence hashing, shared types, WhatsApp integration, and Monad blockchain access.
- `contracts/ALPOEvidence.sol`: evidence-storage smart contract.
- `scripts/`: deployment and WhatsApp utilities.

There is no dedicated tests or static-assets directory. Icons are embedded in components. Treat `.next/`, `node_modules/`, and `tsconfig.tsbuildinfo` as generated output; edit the extracted application rather than `alpo.zip`.

## Build, Test, and Development Commands

Run commands from `alpo/` (`cd alpo`):

- `npm ci`: install dependencies from the lockfile.
- `npm run dev`: start the local development server.
- `npm run build`: produce a production build.
- `npm start`: serve the production build.
- `npx tsc --noEmit`: check TypeScript types.
- `npm run whatsapp:login`: authenticate WhatsApp through the QR-code flow.

`npm run lint` invokes `next lint`, but this snapshot has no ESLint configuration or declared ESLint dependency; configure these before treating lint as an automated check.

## Coding Style & Naming Conventions

Follow existing TypeScript style: two-space indentation, single quotes, and omitted semicolons. Use PascalCase for components and types, camelCase for functions and variables, and Next.js filenames such as `page.tsx` and `route.ts`. Prefer `@/` imports for shared modules. Preserve Spanish user-facing copy and use Tailwind utilities for component styling. No formatter is configured.

## Testing Guidelines

No automated test framework, test script, or coverage threshold is configured. Validate changes with type checking, a production build, and relevant browser flows, including audio upload, recording, results, and error handling. Record manual verification in the PR.

`scripts/test-whatsapp.mjs` sends a real message to a hardcoded recipient; inspect and deliberately configure it before use. `DEMO_MODE` replaces transcription only: blockchain registration and WhatsApp alerts still run.

## Commit & Pull Request Guidelines

Git metadata is absent from this snapshot, so commit conventions cannot be verified. Use concise imperative subjects. PRs should describe behavior changes, verification results, related issues, and configuration changes; include screenshots for UI changes.

## Configuration & Secrets

Use `.env.local.example` as the configuration reference. Keep `.env.local`, private keys, and `.baileys_auth/` credentials untracked. Keep service credentials in server-side code.
