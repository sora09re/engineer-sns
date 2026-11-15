# API サーバーを置かず、Supabase の RLS で認可する

Next.js から React + Vite の SPA へ移行するにあたり、Next.js API Routes と Auth.js を廃止する。認証は Supabase Auth（GitHub OAuth）、認可は Postgres の RLS で行い、クライアントから supabase-js で直接 DB にアクセスする。旧 API Routes は Supabase の薄いラッパーにすぎず、しかも `currentUserId` をクライアントから受け取って信用していたため、RLS に寄せるとサーバーコードの削除と認可の穴の解消を同時に実現できる。

将来は独立した API サーバーに移行する予定である。そのため、supabase-js を呼べる場所はデータアクセス層（`src/api/`）だけに限定する。この層はユースケース単位の関数としてドメイン型を返し、Supabase の型やクエリビルダーを外に出さない。現在の利用者は引数で受け取らず、セッションから解決する。API サーバーへ移行するときは、この層の中身を fetch に差し替えるだけで済むようにする。

## Considered Options

- **Hono などの独立 API サーバー（Auth.js 継続）**: 将来の構成には近いが、いま移植しても中身は Supabase の呼び出しをそのまま移すだけになり、移行範囲が倍になる。そのため今回は見送る。
- **同じリポジトリで Vite と Vercel Functions を同居させる**: 上と同じ理由で見送る。

## Consequences

- アカウントの ID が Auth.js のものから `auth.users.id` に変わるため、既存データは引き継がずにリセットする。デモ用アカウントのデータはシードで作り直す。
- 認可ルールは SQL のマイグレーション（`supabase/migrations/`）に置かれる。API サーバーへ移行するときは、RLS を残すか、サーバー側のチェックに移すかを改めて判断する必要がある。
