# Hono の API サーバーに分離し、認可をサーバー側に移す

ADR 0001 では API サーバーを置かず、クライアントから supabase-js で DB に直接アクセスし、Postgres の RLS で認可していた。今回、認可と業務ロジックを TypeScript で書けるようにし、将来は Supabase への依存を減らせるようにするため、Hono の API サーバー（`apps/api`）を置いて FE と BE を分ける。リポジトリは pnpm workspace のモノレポ（`apps/web`、`apps/api`、`packages/shared`）にする。

- **認証**は Supabase Auth（GitHub OAuth）のまま、ログインはフロントで行う。API にはアクセストークンを `Authorization: Bearer` で送り、API は JWKS（JWT signing keys、ES256）で検証して `sub` をアカウント ID とする。
- **認可**は API で行う。DB には Drizzle と postgres.js で直接つなぐ（本番は Supavisor のトランザクションモード）。
- **契約**は Hono RPC（`hc`）で型を共有する。フロントで API を呼べる場所は、これまでどおりデータアクセス層（`apps/web/src/api/`）だけとし、0001 で決めたとおり中身だけを差し替える。
- **API の中はオニオンアーキテクチャ**にする。依存は内側にだけ向ける（presentation / infrastructure → application → domain）。
  - `domain`: エンティティとルール。外側に依存しない
  - `application`: ユースケースと、外側に求めるもの（ports）。一覧などは読み取りモデル（例: `PostSummary`）で返す
  - `infrastructure`: ports の実装（Drizzle、JWKS での検証）
  - `presentation`: Hono のルートとミドルウェア。読み取りモデルを API のレスポンスの形（`packages/shared` の `PostType`）に変換する
  - `app.ts`: すべてを組み立てる唯一の場所。ユースケースは `(deps) => (input) => result` の関数で、クラスや DI コンテナは使わない
- **デプロイ**は SPA と同じ Vercel プロジェクトの Functions（Node.js ランタイム）にする。`/api/*` を同一オリジンで受けるので CORS は要らない。
- 移行は機能ごとに PR を分けて段階的に進める。移行中は RLS を念のための防御として残し、最後にテーブルへの `authenticated` 権限を外して、フロントから DB に直接アクセスできないようにする。

## Considered Options

- **RLS を残し、API はユーザーの JWT を付けて supabase-js を呼ぶ**: 移行は最小だが、API がほぼ中継になり、0001 で見送った理由（移しても中身が変わらない）がそのまま残る。
- **サービスロールの supabase-js で DB にアクセスする**: クエリビルダーを流用できるが、Supabase への依存が減らない。
- **HS256 の共有シークレットで JWT を検証する**: 手軽だが、秘密情報を API にも渡すことになり、Supabase でも非推奨になりつつある。
- **OpenAPI（`@hono/zod-openapi`）でクライアントを生成する**: 別のクライアントが増えたら検討する。いまはフロントだけなので Hono RPC で足りる。
- **層を分けず、ルートとクエリだけで組む**: 読み取りが中心のいまは薄くて済むが、RLS から移す認可のルールの置き場所が決まらず、移行の途中でルールが散らばる。読み取りも含めて全面的にオニオンにし、層を一貫させることにした。
- **Turborepo**: アプリが 2 つだけなので入れず、pnpm workspace と Vite+ で回す。

## Consequences

- スキーマの正は引き続き `supabase/migrations` の SQL とする。`apps/api/src/db/schema.ts` は手で保つ写しなので、マイグレーションを変えたら合わせて直す。`drizzle-kit pull` の出力は auth スキーマへの参照が壊れるため使わない。
- 認可のルールは、移行が終わるまで RLS（SQL）と API（TypeScript）の二か所にある。移行した機能から、API 側のテストでルールを押さえる。
- ローカルでも JWT signing keys が要る。`supabase/signing_keys.json` は各自 `supabase gen signing-key` で作る。本番の Supabase プロジェクトも signing keys に移行しておく必要がある。
- 読み取りでも層を経由するので、一覧のような単純な取得でもファイルが増える。タイムラインの定義（自分とフォローしているユーザーのコメントでない投稿）はユースケースに書くため、SQL が 1 本から 2 本（フォローの取得と投稿の取得）に増える。
- API のテストは全層を組み立てた app を HTTP から試すので、層の中を組み替えてもテストは変わらない。
- プロフィール画像のアップロードは、移行の最後まで Storage への直接アップロード（RLS で保護）のまま残す。
