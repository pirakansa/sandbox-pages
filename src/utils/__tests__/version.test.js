import { afterEach, describe, expect, it } from 'vitest';
import { getAppVersion } from '../version.js';

describe('getAppVersion', () => {
  const originalGlobalVersion = globalThis.__APP_VERSION__;
  const originalProcessVersion = process.env.APP_VERSION;

  afterEach(() => {
    if (typeof originalGlobalVersion === 'undefined') {
      delete globalThis.__APP_VERSION__;
    } else {
      globalThis.__APP_VERSION__ = originalGlobalVersion;
    }

    if (typeof originalProcessVersion === 'undefined') {
      delete process.env.APP_VERSION;
    } else {
      process.env.APP_VERSION = originalProcessVersion;
    }
  });

  it('returns the global version when defined', () => {
    globalThis.__APP_VERSION__ = '1.2.3';
    expect(getAppVersion()).toBe('1.2.3');
  });

  it('falls back to process.env when global version is missing', () => {
    delete globalThis.__APP_VERSION__;
    process.env.APP_VERSION = '4.5.6';
    expect(getAppVersion()).toBe('4.5.6');
  });

  it('returns a non-empty build version when no overrides are present', () => {
    delete globalThis.__APP_VERSION__;
    delete process.env.APP_VERSION;
    const version = getAppVersion();
    expect(typeof version).toBe('string');
    expect(version.length).toBeGreaterThan(0);
  });
});
