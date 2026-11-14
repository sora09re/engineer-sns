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
- Hono（API サーバー） / Drizzle ORM
- Supabase (PostgreSQL, Auth, Storage, RLS)

# 構成

pnpm workspace のモノレポ（docs/adr/0002 参照）。

| ディレクトリ      | 内容                                                               |
| ----------------- | ------------------------------------------------------------------ |
| `apps/web`        | SPA（React + Vite）                                                |
| `apps/api`        | API サーバー（Hono）。本番は Vercel Functions で `/api/*` を受ける |
| `packages/shared` | FE と BE で共有するドメイン型                                      |
| `api/`            | Vercel Functions の入口（`apps/api` を公開するだけ）               |
| `supabase/`       | マイグレーション・シード・ローカルの Supabase の設定               |
| `e2e/`            | E2E / VRT（Playwright）                                            |

# ローカル開発

1. GitHub OAuth App を作成し、コールバック URL に `http://127.0.0.1:54321/auth/v1/callback` を設定する
2. `supabase/.env` に `SUPABASE_AUTH_EXTERNAL_GITHUB_CLIENT_ID` と `SUPABASE_AUTH_EXTERNAL_GITHUB_SECRET` を書く
3. `pnpm exec supabase gen signing-key --algorithm ES256 > supabase/signing_keys.json` で JWT の署名鍵を作る（初回のみ。中身は `[ ... ]` の配列にする）
4. `pnpm exec supabase start` でローカルの Supabase を起動する（マイグレーションとシードが適用される）
5. `apps/web/.env.example` と `apps/api/.env.example` をそれぞれ `.env.local` にコピーし、`supabase status` に表示される値を設定する
6. `pnpm dev` で web（http://localhost:5173）と API（http://localhost:8787）を起動する。web の `/api` は API に転送される

```sh
pnpm check      # format / lint
pnpm typecheck  # 型チェック（全パッケージ）
pnpm test       # 単体テスト。API のテストは apps/api/.env.local の DATABASE_URL（ローカルの DB のみ）に対して、テストごとにロールバックして動く
```

スキーマを変えたら `pnpm db:types` で `apps/web/src/api/database.types.ts` を再生成し、`apps/api/src/db/schema.ts` も合わせて直す。生成に失敗したときはファイルを変更しない。追加の引数は `supabase gen types` に渡される（例: `pnpm db:types --workdir <dir>`）。

# E2E / VRT

ローカルの Supabase を起動した状態で実行する（Playwright）。web と API は毎回このチェックアウトのものを、開発用とは別のポート（web 5179、API 8788）で起動するので、`pnpm dev` を動かしたままでもよい。そのポートがほかで使われていると、エラーで止まる。

```sh
pnpm exec playwright install chromium  # 初回のみ
pnpm e2e         # 動きの確認。合否の判定に使う
pnpm vrt         # 見た目の確認。e2e/vrt/__screenshots__ と比べる
pnpm vrt:update  # 見た目の差分を確認したうえで、基準のスクリーンショットを更新する
```

- テスト用のアカウント（`e2e-*@example.com` / `vrt-*@example.com`）は実行のたびに作り直す。VRT は固定のデータ（`e2e/support/vrt-fixtures.ts`）だけを撮る
- service role key は `supabase status` から取る。別のディレクトリから起動した Supabase を使うときは `E2E_SUPABASE_WORKDIR=<dir>` を付けるか、`E2E_SUPABASE_SERVICE_ROLE_KEY` で直接渡す
- ほかのローカル Supabase などで Docker の負荷が高いと、テストが止まることがある。使っていないものは止めてから実行する
- スクリーンショットはフォントの描画が OS で変わるので、基準は macOS で作っている
