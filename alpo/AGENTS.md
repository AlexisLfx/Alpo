# Repository Guidelines

## Project Structure & Module Organization

`app/` contains Next.js App Router pages and API routes; `components/` holds reusable React UI. Shared detection, OCR, WhatsApp, blockchain, and type definitions live in `lib/`. `vision/` contains standalone Python screen capture and OCR utilities, `contracts/` contains the Solidity evidence contract, and `scripts/` contains deployment and WhatsApp helpers. Styles are in `app/globals.css` and Tailwind configuration.

## Build, Test, and Development Commands

- `npm ci` installs dependencies from the lockfile.
- `npm run dev` starts the local Next.js development server.
- `npm run build` builds the production application; `npm start` serves that build.
- `npm run lint` invokes Next.js linting; the repository does not include an ESLint configuration, so initial setup may be prompted.
- `npm run whatsapp:login` connects a WhatsApp session using a QR code.

## Coding Style & Naming Conventions

Follow the surrounding file's style: TypeScript and React generally use two-space indentation, single quotes, and no semicolons. Use PascalCase for components and their files, camelCase for functions and variables, and the `@/` alias for root-relative imports. TypeScript runs in strict mode. Python utilities use four-space indentation and snake_case.

## Testing Guidelines

There is no configured automated test suite or coverage threshold. Validate changes with `npm run build` and exercise affected pages or API routes locally. `scripts/test-whatsapp.mjs` is a live integration helper that sends a message to its hard-coded recipient; inspect and configure it before running. Add focused tests when introducing a test framework or significant logic.

## Commit & Pull Request Guidelines

Git history is unavailable in this checkout, so no existing commit convention can be verified. Use concise, imperative commit subjects. Pull requests should explain the change and validation, link relevant issues, and include screenshots for visible UI changes.

## Configuration & Security

Copy `.env.local.example` to `.env.local` and fill in only the services needed. Keep private keys, API keys, and `.baileys_auth/` credentials out of commits. The deployment script targets Monad Testnet and updates `.env.local`; review its settings before running it. Python OCR scripts require their external dependencies and may need a local Tesseract path adjustment.
