# Typing Engine – Agent Instructions

## Repository Overview

- Core library for creating typing apps/games.
- Universal TypeScript targeting any JavaScript runtime (Node.js, Browser, Bun, React Native).
- ES Modules only (latest ESM).

## Source Layout

- Source code: `lib/`
- Bundled output: `dist/`
- Tests: colocated with sources, `*.test.ts`

## Development Environment

- Node.js v24 (can execute `.ts` directly; no `ts-node`/`tsx` needed).
- Package manager: `pnpm`.
- Test runner: Node.js built-in test utilities (runs `.ts` tests).
- Bundler: `ts-down`.

## Language Support

- Officially supported languages: Japanese, English.
- Other languages are supported via language packs.

## Language Policy

- All source code comments, README, Issues, and PRs must be written in English.

## Development Principles

- Start small and follow YAGNI: implement only what is required now.
- Keep code DRY: factor repeated logic into appropriately sized functions.
- One file per function or class (types are allowed).
- After implementation, run `pnpm fix`, `pnpm typecheck`, and `pnpm test`.
