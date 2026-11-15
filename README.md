# アプリケーション概要

コードスニペットを投稿することができるエンジニア向けSNSアプリ<br>
https://engineer-sns.vercel.app/

【ログイン情報 (採用担当者用)】<br>
ユーザー名：Engineer-1234<br>
パスワード：EngineerTestUser1234

# 機能一覧

- ユーザー認証(Supabase Auth / GitHub)
- プロフィール作成/編集
- 投稿
- 投稿へのコメント
- 投稿への"いいね"
- 検索(ユーザー,投稿)
- ユーザーのフォロー

# 使用技術 / ツール

- React + Vite (Vite+)
- TanStack Router / TanStack Query
- TypeScript
- Mantine
- Supabase (PostgreSQL, Auth, Storage, RLS)

# ローカル開発

1. GitHub OAuth App を作成し、コールバック URL に `http://127.0.0.1:54321/auth/v1/callback` を設定する
2. `supabase/.env` に `SUPABASE_AUTH_EXTERNAL_GITHUB_CLIENT_ID` と `SUPABASE_AUTH_EXTERNAL_GITHUB_SECRET` を書く
3. `pnpm exec supabase start` でローカルの Supabase を起動する（マイグレーションとシードが適用される）
4. `.env.example` を `.env.local` にコピーし、`supabase status` に表示される URL と publishable key を設定する
5. `pnpm dev` で http://localhost:5173 を開く

スキーマを変えたら `pnpm db:types` で `src/api/database.types.ts` を再生成する。生成に失敗したときはファイルを変更しない。追加の引数は `supabase gen types` に渡される（例: `pnpm db:types --workdir <dir>`）。

# E2E / VRT

ローカルの Supabase を起動した状態で実行する（Playwright。開発サーバーが動いていなければ自動で起動する）。

```sh
pnpm exec playwright install chromium  # 初回のみ
pnpm e2e         # 動きの確認。合否の判定に使う
pnpm vrt         # 見た目の確認。e2e/vrt/__screenshots__ と比べる
pnpm vrt:update  # 見た目の差分を確認したうえで、基準のスクリーンショットを更新する
```

- テスト用のアカウント（`e2e-*@example.com` / `vrt-*@example.com`）は実行のたびに作り直す。VRT は固定のデータ（`e2e/support/vrt-fixtures.ts`）だけを撮る
- service role key は `supabase status` から取る。別のディレクトリから起動した Supabase を使うときは `E2E_SUPABASE_WORKDIR=<dir>` を付ける
- ほかのローカル Supabase などで Docker の負荷が高いと、テストが止まることがある。使っていないものは止めてから実行する
- スクリーンショットはフォントの描画が OS で変わるので、基準は macOS で作っている
