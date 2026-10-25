# Dependency security maintenance

The project retains Firebase 12 and Tailwind CSS 3 while replacing vulnerable
transitive dependencies using scoped npm `overrides` in `package.json`.
Install with `vorbere run setup` (`npm ci`) to reproduce the lockfile.

| Consumer | Override | Reason |
| --- | --- | --- |
| `@firebase/firestore` | `@grpc/grpc-js` 1.14.6 | Replaces its vulnerable `~1.9.0` dependency with a patched release in the same major. |
| `tailwindcss` | `postcss-selector-parser` 7.1.6 | Fixes selector parsing CPU exhaustion while retaining Tailwind 3. |
| `postcss-nested` under `tailwindcss` | `postcss-selector-parser` 7.1.6 | Fixes the same vulnerability in nested selector processing. |

The parser overrides cross the upstream parser major constraint. They are
intentional compatibility exceptions, rather than upstream-supported dependency
ranges. The gRPC override also exceeds Firestore's declared minor constraint.
Keep their scope limited to these consumers; do not replace unrelated dependencies.

## Validation workflow

After changing or removing an override:

1. Run `npm install` to synchronize the manifest and lockfile.
2. Run `vorbere run setup` to verify a clean lockfile installation.
3. Run `vorbere run check`, `vorbere run test`, and `vorbere run build`.
4. Run `npm audit` and investigate every remaining finding.

`src/utils/__tests__/dependencyCompatibility.test.js` exercises nested selectors,
Tailwind dark/focus/responsive variants, and a local unary RPC using the gRPC
instance resolved by Firestore. The security change also compared all generated
production CSS with the pre-change build and required byte-for-byte equality.
Tailwind's content scan excludes `__tests__` directories so compatibility fixtures
do not add unused utilities to production CSS.
The application currently imports Firebase App and Auth, not Firestore.
The RPC smoke test does not establish full Firestore or TLS compatibility; if
Firestore usage is added, validate its real operations before shipping that feature.

Remove an override when its consuming package declares a patched dependency
range and a clean installation, audit, and the above checks pass without it.
Until then, review the pinned versions during dependency maintenance. An audit
with zero findings describes known advisories at that time, not a guarantee that
the application has no security risks.
