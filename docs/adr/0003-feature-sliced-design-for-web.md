# apps/web を Feature-Sliced Design にし、API を呼べる場所を各スライスの api セグメントに広げる

`apps/web` は `components/` に部品を平らに並べていたため、機能が増えると置き場所に迷い、依存の向きも決まっていなかった。そこで [Feature-Sliced Design](https://feature-sliced.design/)（FSD）の層（`app / pages / widgets / features / entities / shared`）に移し、公式の linter である Steiger で層の向きと公開 API（スライスの `index.ts`）を強制する。コードはまずページに置き、複数のページで使うものだけを下の層へ切り出す（pages first）。

これに伴い、ADR 0001・0002 の「API を呼べるのはデータアクセス層（`apps/web/src/api/`）だけ」を次のように改める。

- `shared/api`: Hono RPC のクライアント、レスポンスの検査、クエリキー、supabase-js のクライアント
- 読み取り（`queryOptions`）は `entities/*/api` に置く
- 更新（`useMutation`）は、それを使う features（または pages / widgets）の `api` セグメントに置く
- API を呼べるのは各スライスの `api` セグメントと `shared/api` だけとする。UI や model からは直接呼ばない

## Considered Options

- **`shared/api` にクエリと更新をすべて残す**: 0001・0002 の決まりをそのまま守れるが、どのエンティティや機能の処理なのかがファイルの置き場所から読み取れず、FSD にする意味が薄れる。
- **oxlint の `no-restricted-imports` で層を強制する**（`apps/api` と同じ方法）: 依存は増えないが、公開 API を迂回する import やスライス間の import まで書き切るのが難しい。そのため FSD 公式の Steiger を採用した。

## Consequences

- Steiger の insignificant-slice に従い、1 か所でしか使わない操作は features に切らず、使う側（widgets / pages）に置く。2 か所目の利用者が出たら features に切り出す。そのため、いいねや削除のように features に見えないものがある。
- Steiger は `pnpm check`（CI）と pre-commit から実行する。
- TanStack Router のファイルルートは `src/app/routes/` に置く（`routesDirectory` を変更する）。ルートファイルは `head` / `loader` / `beforeLoad` と、ページの UI を結び付けるだけにする。
