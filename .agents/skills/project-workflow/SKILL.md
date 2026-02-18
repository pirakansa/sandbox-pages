---
name: project-workflow
description: Use this skill for branch strategy, commit message conventions, CI gate checks, and pull-request content requirements. Do not use it for dependency, security, or changelog policy details.
---

# Project Workflow Skill

Use this skill for branching, commits, PR preparation, and CI readiness.

## CI Requirements

GitHub Actions (`.github/workflows/static.yml`) runs:

* `npm run lint`
* `npm run test`
* `npm run build`

Run these locally before opening a PR.

## Branch Workflow (GitHub Flow)

* Base branch: `main`
* Feature branch: `feature/<topic>`
* Hotfix branch: `hotfix/<issue>`
* Direct commits to `main` are forbidden.
* Merge only after CI passes and reviewers are assigned.

## Commit Message Policy

Follow Conventional Commits:

```text
type(scope?): description
```

* `type`: feat / fix / docs / style / refactor / test / chore
* `description`: concise English
* Body (English): one-sentence WHY + per-file HOW list

Example:

```text
- src/config/appConfig.ts: Add error handling when JSON parsing fails
- src/api/request.ts: Strengthen HTTP timeout configuration
```

## PR Policy

* Include **Motivation / Design / Tests / Risks** in English.
* Keep one semantic change per commit when possible.
* Separate generated code from manual changes where practical.
