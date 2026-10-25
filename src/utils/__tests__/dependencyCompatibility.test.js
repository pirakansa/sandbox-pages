// @vitest-environment node
/** Exercise dependency overrides through their consuming packages. */
import { createRequire } from 'node:module';
import { afterEach, describe, expect, it } from 'vitest';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';

const require = createRequire(import.meta.url);
const tailwindRequire = createRequire(require.resolve('tailwindcss'));
const nested = tailwindRequire('postcss-nested');
const firestoreRequire = createRequire(require.resolve('@firebase/firestore'));
const grpc = firestoreRequire('@grpc/grpc-js');
const LOCAL_ADDRESS = '127.0.0.1:0';
const RPC_TIMEOUT_MS = 2000;

/** Serialize the local test service's string payloads. */
const serialize = (value) => Buffer.from(value);
/** Deserialize the local test service's string payloads. */
const deserialize = (value) => value.toString();

describe('dependency override compatibility', () => {
  let server;
  let client;

  /** Close local RPC resources even when an assertion fails. */
  afterEach(() => {
    client?.close();
    server?.forceShutdown();
  });

  it('expands nested selectors and Tailwind dark, focus, and responsive utilities', async () => {
    const result = await postcss([
      nested(),
      tailwindcss({
        darkMode: 'class',
        content: [{ raw: 'flex dark:bg-slate-900 focus:ring-2 md:grid', extension: 'html' }],
      }),
    ]).process('.panel { &:hover, &:focus { color: red } } @tailwind utilities;', { from: undefined });

    expect(result.warnings()).toEqual([]);
    expect(result.css).toContain('.panel:hover, .panel:focus');
    expect(result.css).toContain('.flex');
    expect(result.css).toContain('display: flex');
    expect(result.css).toContain('.dark\\:bg-slate-900');
    expect(result.css).toContain('.focus\\:ring-2:focus');
    expect(result.css).toContain('@media (min-width: 768px)');
    expect(result.css).toContain('.md\\:grid');
  });

  it('supports a unary RPC using the gRPC version resolved by Firestore', async () => {
    const service = {
      echo: {
        path: '/compatibility.Echo/Echo',
        requestStream: false,
        responseStream: false,
        requestSerialize: serialize,
        requestDeserialize: deserialize,
        responseSerialize: serialize,
        responseDeserialize: deserialize,
      },
    };
    server = new grpc.Server();
    server.addService(service, { echo: (call, callback) => callback(null, call.request) });
    const port = await new Promise((resolve, reject) => {
      server.bindAsync(LOCAL_ADDRESS, grpc.ServerCredentials.createInsecure(), (error, boundPort) => {
        if (error) reject(error);
        else resolve(boundPort);
      });
    });
    const EchoClient = grpc.makeGenericClientConstructor(service, 'Echo');
    client = new EchoClient(`127.0.0.1:${port}`, grpc.credentials.createInsecure());
    const reply = await new Promise((resolve, reject) => {
      client.echo('compatibility check', { deadline: Date.now() + RPC_TIMEOUT_MS }, (error, value) => {
        if (error) reject(error);
        else resolve(value);
      });
    });
    expect(reply).toBe('compatibility check');
  });
});
