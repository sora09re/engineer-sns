# API・web のテストと E2E・VRT の動かし方

テストは、API のテスト（Vitest）、web のテスト（Vitest）、shared のテスト（Vitest）、E2E（Playwright）、VRT（Playwright のスクリーンショット）の 5 つにする。web と shared のテスト以外は、ローカルの Supabase（`pnpm exec supabase start`）が起動している前提で動く。

## API のテスト

- 全層を組み立てた app を HTTP から試す。結果の確認は必ず API のレスポンスで行い、DB は見ない。
- 準備（投稿・コメント・フォロー・いいね・プロフィールの変更）も API で行う（`test/fixtures.ts`）。DB に直接書くのは次の 2 つだけにする。
  - アカウント（`auth.users`）とユーザーの作成。アカウントを作る API はない
  - 並び順を確かめるための作成時刻の固定。テストは 1 つのトランザクションの中で動き、`now()` がずっと同じ時刻を返すので、API で作ったあとに `created_at` を書き換える
- テスト本体はトランザクションの中で動かし、最後にロールバックする。テスト同士でデータが混ざらない。同じ DB を使うので、ファイルは並列に動かさない（`fileParallelism: false`）。
- Storage は DB のロールバックでは消えないので、テストでアップロードした画像は後で消す。
- アクセストークンは、テスト用の鍵で Supabase Auth と同じ ES256 で署名する。差し替えるのは鍵の取得元だけで、検証のコードは本番と同じものが動く。
- 検索のテストのキーワードは、シードと重ならない英小文字だけの語にする。大文字にしても別の語にならないので、大文字と小文字を区別しないことを確かめられる。
- フロントから DB と Storage に直接アクセスできないこと（0002）は HTTP では確かめられないので、`direct-access.test.ts` だけは、supabase-js がログイン済みでつなぐときと同じロールとクレームで DB に直接つなぐ。`storage.objects` の権限は Supabase のものなので残るが、insert のポリシーがないので RLS で拒否される。

## web のテスト

- Supabase も API のサーバーも使わない。jsdom の上で、QueryClient やルーターと組み合わせた web の部品（キャッシュの無効化、詳細ページの「見つからない」など）を試す。
- そのため、テストする module から `shared/api/http.ts`・`shared/api/supabase.ts` を読み込まない。supabase-js のクライアントは、読み込んだ時点で環境変数がないとエラーになる。レスポンスの検査は `shared/api/response.ts` に置く。
- `@/shared/api` を経由すると、どちらも間接的に読み込まれる。そこで `apps/web/vitest-setup.ts` で両方を差し替え、使うとこの ADR を指すエラーで落とす。API を呼ぶ部品（フォームなど）を試すときは、テストで `@/shared/api/http` を `vi.mock` し、`fetch` を差し替えた Hono のクライアント（`hc<AppType>`）を渡す。送り先と本文はそこで確かめる。
- 部品のテストで済ませず、変えた挙動が実際のページに出ることは E2E でも確かめる。API の結果を変えたいときは、`respondNotFoundFrom` のように `page.route` で差し替える。

## shared のテスト

- `packages/shared/src/rules/`（0008）の入力のルールを、ルールのファイルの隣（`rules/*.test.ts`）で直接試す。ルールは純粋な関数なので、DB も API のサーバーも使わない。
- API のテストは HTTP から試すので、ルールの境界（自己紹介の上限ちょうどと 1 文字超え、空白だけの必須の項目など）を細かく押さえるのには向かない。境界はここで押さえる。API のテストでは、ルールが API に組み込まれていることを確かめれば足りる。

## Property-based Testing

- 入力の組み合わせが多い純粋な関数（入力のルール、投稿の本文の `parseContent`）は、例に加えて fast-check で性質を確かめる。境界の値は、性質に任せず例のテストとしても書く。
- `fc.assert(fc.property(...))` を `vite-plus/test` の `it` の中で使う。`@fast-check/vitest` は使わない。pnpm の peer 依存の解決で `vite-plus/test` と別の Vitest の実体を読み込み、テストを集められずに落ちる。
- 失敗すると fast-check が seed と縮めた反例を出す。直すときは、その反例を例のテストとして足す。

## Mutation Testing

- Stryker で、テストが見逃す変更（生き残ったミュータント）を探し、テストを足す手がかりにする。スコアは目安で、閾値で落とすことはしない（`thresholds.break` は設定しない）。CI でも動かさず、手元で `pnpm mutation` を流す。
- 対象は純粋なロジック（`packages/shared/src/rules`、`apps/web` の `lib`）に絞る。API のテストは実 DB を使って直列に動くので、ミュータントごとに流すと遅すぎる。api の domain はほぼ shared のルールの再 export なので、対象にしない。
- 設定はパッケージごとの `stryker.config.mjs` に置き、Stryker もそれぞれのパッケージに入れる。
- テストは `command` ランナーで、ミュータントごとに `vp test run` を流す。`@stryker-mutator/vitest-runner` は、pnpm の peer 依存の解決で `vite-plus/test` とは別の Vitest の実体を読み込むことがあり、そのときは最初のテストの実行で落ちる。どちらの実体になるかはインストールのたびに変わる。`command` ランナーはテストごとのカバレッジ分析ができず、ミュータントごとにテストをすべて流すので、web は並列数を 2 に絞る（Vitest がそれぞれ複数のワーカーを使い、並列を増やすと時間切れになる）。
- Stryker はサンドボックスにパッケージを写し、tsconfig の `extends` の相対パスを TypeScript の JS API で書き換える。TS 7 にはこの API がないので、`pnpm-workspace.yaml` の `packageExtensions` で `@stryker-mutator/core` にだけ TypeScript 5 を渡す。
- `@stryker-mutator/typescript-checker`（型エラーになるミュータントを先に除く）は、同じ理由で TS 7 を読み込んで初期化に失敗するので使わない。型エラーになるミュータントも「殺された」と数えられるので、スコアは少し甘く出る。
- 等価なミュータント（結果が変わらない変更）は、コードにコメントを書いて抑えない（`no-comments`）。残っていてよく、どうしても外すなら `stryker.config.mjs` の `mutate` で外す。通知の色のように、見た目だけが変わるミュータントも残してよい。

## E2E と VRT

- E2E は動きを確かめ、合否の判定に使う。VRT は見た目を記録し、差分は人が見て判断する。問題がなければ `pnpm vrt:update` でベースラインを更新する。
- Playwright は毎回このチェックアウトの API と Web のサーバーを、開発用（5173 / 8787）とは別のポートで起動する。既存のサーバーを再利用すると、別の worktree のサーバーを試してしまうことがあるので、`reuseExistingServer: false` にし、ポートが使われていればエラーで止める。API のポートは `API_PORT` で変える。API はトークンなしの 401 が返れば起動しているとみなす（Playwright は 400〜403 を起動済みとみなす）。
- テスト用のアカウントとデータは、service role で DB に直接作る。service role は RLS を無視できるので、ローカルの Supabase 以外では動かさない。
- `supabase status` は同期で実行するので、ワーカーで呼ぶとテストのタイムアウトが効かない。global setup で 1 回だけ呼び、結果は環境変数でワーカーに渡す（global setup で設定した環境変数はワーカーに引き継がれる）。
- 外部へのリクエスト（シードのプロフィール画像など）は止めて、結果を安定させる。
- Playwright は fixture の第 1 引数の分割代入から依存する fixture を読み取るので、依存がなくても `{}` が要る（`no-empty-pattern` を行ごとに無効にする）。
- VRT のデータは、ID も日時も固定する。ほかのデータ（シードや E2E が作ったもの）が混ざらないよう、VRT の 2 人のユーザーは互いだけをフォローし、検索には VRT 専用のキーワードを使う。
- クリックしたあとのホバーの見た目が写らないように、撮る前にマウスを画面の端へ逃がす。
