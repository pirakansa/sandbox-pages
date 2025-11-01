import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { canClearSiteCaches, clearSiteCaches } from '../cacheControl.js';

describe('cacheControl', () => {
  const cachesDescriptor = Object.getOwnPropertyDescriptor(window, 'caches');
  const serviceWorkerDescriptor = Object.getOwnPropertyDescriptor(window.navigator, 'serviceWorker');

  afterEach(() => {
    vi.restoreAllMocks();

    if (cachesDescriptor) {
      Object.defineProperty(window, 'caches', cachesDescriptor);
    } else {
      delete window.caches;
    }

    if (serviceWorkerDescriptor) {
      Object.defineProperty(window.navigator, 'serviceWorker', serviceWorkerDescriptor);
    } else {
      delete window.navigator.serviceWorker;
    }
  });

  describe('canClearSiteCaches', () => {
    it('returns false when Cache Storage API is unavailable', () => {
      delete window.caches;
      expect(canClearSiteCaches()).toBe(false);
    });

    it('returns true when Cache Storage API is available', () => {
      Object.defineProperty(window, 'caches', {
        configurable: true,
        value: {},
      });
      expect(canClearSiteCaches()).toBe(true);
    });
  });

  describe('clearSiteCaches', () => {
    let keysMock;
    let deleteMock;
    let updateMock;

    beforeEach(() => {
      keysMock = vi.fn().mockResolvedValue(['cache-a', 'cache-b']);
      deleteMock = vi.fn().mockResolvedValue(true);
      updateMock = vi.fn().mockResolvedValue();

      Object.defineProperty(window, 'caches', {
        configurable: true,
        value: {
          keys: keysMock,
          delete: deleteMock,
        },
      });

      Object.defineProperty(window.navigator, 'serviceWorker', {
        configurable: true,
        value: {
          getRegistrations: vi.fn().mockResolvedValue([{ update: updateMock }]),
        },
      });
    });

    it('throws an error when caches are not supported', async () => {
      delete window.caches;
      await expect(clearSiteCaches()).rejects.toThrow('ブラウザが Cache Storage API に対応していません。');
    });

    it('removes caches and triggers service worker updates', async () => {
      const result = await clearSiteCaches();

      expect(keysMock).toHaveBeenCalledTimes(1);
      expect(deleteMock).toHaveBeenCalledTimes(2);
      expect(result.total).toBe(2);
      expect(result.deleted).toBe(2);
      expect(result.updatedRegistrations).toBe(1);
      expect(window.navigator.serviceWorker.getRegistrations).toHaveBeenCalledTimes(1);
      expect(updateMock).toHaveBeenCalledTimes(1);
    });

    it('handles empty cache sets gracefully', async () => {
      keysMock.mockResolvedValueOnce([]);
      const result = await clearSiteCaches();
      expect(result.total).toBe(0);
      expect(result.deleted).toBe(0);
    });
  });
});
