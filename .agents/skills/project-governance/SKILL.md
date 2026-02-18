---
name: project-governance
description: Use this skill for security/data handling, documentation policy, dependency update expectations, release process, and changelog rules. Do not use it for file placement or day-to-day coding style decisions.
---

# Project Governance Skill

Use this skill for security handling, documentation updates, dependencies, and release operations.

## Security and Data Handling

* Never commit secrets or confidential information.
* Never log personal or authentication data.
* Use fictitious URLs/passwords in tests.
* Obtain user approval before accessing external networks.

## Documentation Policy

* `README.md` should cover overview, usage, install, build, and test entry points.
* Add detailed designs under `docs/` as needed.
* Update docs together with code changes, or state "No documentation changes" in PR.
* Ensure command examples actually work.

## Dependency Management

* Add dependencies with `npm install <module>`.
* Keep `package.json` and `package-lock.json` in sync.
* For dependency updates, note module and reason in PR.
* Check with `npm audit` when needed.

## Release Process

* Use SemVer.
* Tag releases with `git tag vX.Y.Z`.
* Verify release output using the project's documented build and test commands.
* If the project uses a `CHANGELOG.md`, update it; otherwise ensure the chosen release-notes documentation (for example, GitHub Releases or a docs page) is updated.

## Changelog / Release Notes Policy

* When maintaining a `CHANGELOG.md`, follow Keep a Changelog sections: Added / Changed / Fixed / Deprecated / Removed / Security.
* Write in English.
* Prefer user-impact language; mark breaking changes clearly with migration steps.
* Add PR/Issue references when possible.
* Workflow (applies to `CHANGELOG.md` or the project’s primary release-notes mechanism):
  1. Add entries under `Unreleased` (or the equivalent section) in feature PRs.
  2. Set version/date in the release PR.
  3. After tagging, copy or move the relevant section into the final release notes (e.g., `CHANGELOG.md`, GitHub Releases, or equivalent).
