/**
 * Cache Storage API が利用可能か判定します。
 */
export function canClearSiteCaches() {
  return typeof window !== 'undefined'
    && Boolean(window.caches);
}

/**
 * PWA 用のサービスワーカーに対して更新を促します。
 */
async function updateServiceWorkers() {
  if (typeof window === 'undefined') {
    return 0;
  }

  const registrationsGetter = window.navigator?.serviceWorker?.getRegistrations;
  if (!registrationsGetter) {
    return 0;
  }

  try {
    const registrations = await registrationsGetter.call(window.navigator.serviceWorker);
    await Promise.allSettled(
      registrations.map((registration) => (
        registration.update ? registration.update() : undefined
      )),
    );
    return registrations.length;
  } catch {
    return 0;
  }
}

/**
 * ブラウザに保持されている当該サイトの Cache Storage を削除します。
 * 削除件数と対象キャッシュ数を返します。
 */
export async function clearSiteCaches() {
  if (!canClearSiteCaches()) {
    throw new Error('ブラウザが Cache Storage API に対応していません。');
  }

  const cacheNames = await window.caches.keys();
  const deletionResults = await Promise.all(
    cacheNames.map((cacheName) => window.caches.delete(cacheName)),
  );
  const deletedCount = deletionResults.filter(Boolean).length;

  const updatedRegistrations = await updateServiceWorkers();

  return {
    total: cacheNames.length,
    deleted: deletedCount,
    updatedRegistrations,
  };
}
