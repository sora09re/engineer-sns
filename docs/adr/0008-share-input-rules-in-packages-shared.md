# 入力のルールを packages/shared に置き、api の domain と web のフォームで共有する

自己紹介の文字数、プロフィール画像の形式とサイズ、名前などの必須の項目、投稿の本文が空でないこと、といった入力のルールを、api の domain と web のフォームで別々に持っていた。片方だけ直すと、フォームは通るのに API が 422 を返す（またはその逆）ので、ルールを 1 か所に置き、両方から使う。

- 外部に依存しない入力のルールは `packages/shared/src/rules/` に置き、`@engineer-sns/shared/rules` として出す。ここには定数と純粋な関数だけを置き、ライブラリにも `packages/shared` のほかのファイルにも依存しない。
- `@engineer-sns/shared/rules` は domain より内側として扱う。api の domain はここから import し、application はこれまでどおり domain を経由して使う。[0002](./0002-hono-api-server-with-server-side-authorization.md) の「domain は外側に依存しない」は変わらない。
- レスポンスの型（`@engineer-sns/shared`）は presentation の都合で決まる外側のものなので、domain と application からは引き続き import しない（`vite.config.ts` の `no-restricted-imports`）。
- エラーのメッセージ（「自己紹介は160文字以内で入力してください。」など）もルールと一緒に置く。何を満たしていないかを言うのはルールの一部で、web がフォームでメッセージを出すときに API と同じ言い方になる。
- web は、送信ボタンを押せるかどうかや、入力欄の `maxLength`・画像の `accept`・`maxSize` をこのルールから決める。送信ボタンを押せなくするときは、ルールが返すメッセージを表示して、押せない理由がわかるようにする。API のルールの正はこれまでどおり API で、API のテストで押さえる。
- プロフィール画像のサイズの上限と形式は、Storage の `profile_image` バケットの設定（`file_size_limit`・`allowed_mime_types`、`supabase/migrations`）にも書いてある。バケットは API が発行した署名付き URL へのアップロードを最後に受け止める場所で、ここだけが SQL にある。API のテスト（`profile-image.test.ts`）で、バケットの設定がこのルールと同じことを確かめる。
- 画像形式からファイルの拡張子を決めるのは Storage の置き方の都合なので、api の domain に残す。形式の一覧は `ProfileImageMimeType` で共有し、拡張子の対応表が形式の一覧からずれると型エラーになるようにする。

## Considered Options

- **`packages/shared` 全体を domain より内側とする**: レスポンスの型（snake_case の `PostType` など）まで domain から見えてしまい、presentation の都合が domain に入り込む。
- **新しいパッケージ（`packages/rules` など）に分ける**: 境界ははっきりするが、ルールがいまは数個しかなく、パッケージを増やすほどではない。サブパスで分ければ足りる。
- **zod のスキーマを共有する**: 形の検証まで共有できるが、domain が zod に依存することになる。いまの domain は外側のライブラリに依存しないので見送る。

## Consequences

- 入力のルールを変えるときは `packages/shared/src/rules/` を直せば、api と web の両方に効く。プロフィール画像のサイズと形式を変えるときは、バケットの設定を変えるマイグレーションも足す（足し忘れると API のテストが落ちる）。変えたら、web から実際にアップロードできるところまで確かめる（E2E の `profile.spec.ts`）。
- `packages/shared` は型だけのパッケージではなくなり、実行時のコードを持つ。api も web もソースの TypeScript をそのまま読むので、ビルドの手順は変わらない。
