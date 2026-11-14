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
