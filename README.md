# sandbox-pages

A React and Vite playground maintained with GitHub Flow.

## Quick start

- Install dependencies: `vorbere run setup`
- Start development: `vorbere run dev`
- Run tests: `vorbere run test`
- Check code: `vorbere run check`

Run `npm run` to list available scripts.

### Firebase authentication

- Copy `.env.example` to `.env` and configure `VITE_FIREBASE_API_KEY` and `VITE_FIREBASE_AUTH_DOMAIN` for your Firebase project.
- `.env` is ignored by Git. Do not commit secrets.

## Development

The development container configuration is in `.devcontainer/`.
See [dependency security maintenance](docs/dependency-security.md) before changing security overrides.
