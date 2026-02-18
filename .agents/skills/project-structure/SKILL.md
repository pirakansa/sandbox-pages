---
name: project-structure
description: Use this skill when deciding file placement, architecture boundaries, coding standards, and test-location rules for this repository. Do not use it for release or PR process decisions.
---

# Project Structure Skill

Use this skill when placing files, implementing features, or validating code quality.

## Project Layout

```text
.
├─ src/<name>.html
├─ src/<name>.jsx
├─ src/assets/
│  └─ images/
├─ src/utils/
│  ├─ Global.scss
│  ├─ Theme.js
│  └─ responseUtils.js
├─ src/pages/<name>/
│  ├─ App.jsx
│  └─ <name>.module.scss
├─ src/components/
│  ├─ atom/
│  └─ block/
├─ src/services/
│  ├─ api.js
│  └─ models/
├─ public/
├─ dist/
├─ package.json
└─ docs/
```

## Placement Rules

* Shared logic goes in `src/utils/` or `src/services/`.
* Shared UI goes in `src/components/` (`atom/` for primitives, `block/` for composed components).
* Page-specific code stays in `src/pages/<name>/`.
* Keep `src/<name>.jsx` for bootstrap/entry wiring only.
* API/auth/data models belong in `src/services/`.
* Static/global assets belong in `src/assets/`; public static files go in `public/`.
* Co-locate tests with source (for example `__tests__/*.test.js`).
* Avoid unnecessary new top-level directories.

## Coding Standards

* Run `npm run lint` and keep it warning-free.
* Do not silently discard errors; prefer `console.error` for user-facing errors.
* Extract magic numbers and hard-coded URLs into named constants.
* Avoid large unrelated refactors.
* Required comments:
  * File header
  * Function header

## Testing and Verification

* Unit tests: `npm run test`
* Keep `README.md` usage examples and `test` fixtures in sync when behavior changes.
* Vulnerability scan: `npm audit`
