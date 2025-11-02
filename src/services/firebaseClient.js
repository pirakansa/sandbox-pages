import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase設定を環境変数から読み込み、存在しない場合は初期化を止める。
const firebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN
};

if (!firebaseConfig.apiKey || !firebaseConfig.authDomain) {
  throw new Error(
    'Firebase config is missing. Define VITE_FIREBASE_API_KEY and VITE_FIREBASE_AUTH_DOMAIN in your environment.'
  );
}

const existingApps = getApps();
const firebaseApp = existingApps.length > 0
  ? existingApps[0]
  : initializeApp(firebaseConfig);

// 単一インスタンスのAuthを共有し、重複初期化を避ける。
const auth = getAuth(firebaseApp);

export { auth, firebaseApp, firebaseConfig };
