---
name: project-setup
description: Use this skill for environment setup, npm-based build/test/lint/dev commands, and local cleanup tasks. Do not use it for git workflow, release policy, or repository governance decisions.
---

# Project Setup Skill

Use this skill for environment setup, local execution, and basic project tasks.

## Setup Steps

* Recommended environment: VS Code Dev Container or GitHub Codespaces (`.devcontainer/`).
* On first run, execute `npm install` at repository root.
* Use `npm` as the task runner.

## Build and Run Commands

* Build: `npm run build`
* Lint: `npm run lint`
* Test: `npm run test`
* Dev server: `npm run dev`
* Cleanup build artifacts: `rm -rf ./dist/`
