# sandbox-pages

react + vite 構成の遊び場です。GitHub Flowで運用します。

## 使い方

- 初回セットアップ: `npm install`
- ローカル実行: `npm run dev`
- テスト: `npm run test`
- フォーマット: `npm run lint`
- 依存脆弱性チェック: `npm audit`

タスク一覧は `npm run` で確認できます。

### Firebase 認証の設定

- `.env.example` を参考に `.env` を作成し、Firebase プロジェクトの `VITE_FIREBASE_API_KEY` と `VITE_FIREBASE_AUTH_DOMAIN` を設定してください。
- `.env` は `.gitignore` 済みです。秘匿情報はリポジトリに含めないでください。

## 構成

Dev Container を使う場合は `.devcontainer/` を利用してください。
