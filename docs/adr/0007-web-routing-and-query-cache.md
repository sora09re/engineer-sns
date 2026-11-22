# apps/web のルートの守りと、TanStack Query のキャッシュの扱い

`apps/web` は TanStack Router の `beforeLoad` / `loader` と TanStack Query でデータを取る（[0003](./0003-feature-sliced-design-for-web.md)）。どのページに誰が入れるかと、キャッシュをいつ捨てるかをここで決める。

## ルートの守り

- ログインが必要なページは `/_authed` の下に置く。`/_authed` の `beforeLoad` は、アカウントがなければログインへ、ユーザーがなければ新規ユーザー登録へ送る。そのため `useCurrentUser` は `/_authed` の下でだけ使い、ユーザーがあるものとして扱う。
- 新規ユーザー登録のページは、ユーザーを持たないアカウントだけが開ける。
- GitHub OAuth のコールバックでは、supabase-js がクライアントを初期化するときに URL の `code` をセッションに交換する。それが終わってからトップへ送り、ユーザーの有無は `/_authed` に判定させる。

## キャッシュ

- `staleTime` は 30 秒にする。`loader` で取った直後に、コンポーネントがもう一度取りに行かないようにするため。
- プリロードの鮮度は TanStack Query に任せる（`defaultPreloadStaleTime: 0`）。
- 更新したら、クエリキーの先頭の要素（`"users"` / `"posts"` / `"follows"`）の単位で無効化する。
- クエリキーの形と、どの更新でどのキャッシュを無効化するかは、`shared/api/query-cache.ts` の 1 か所にまとめる。更新の hook は、起きた出来事（投稿が変わった、投稿が消えた、フォローが変わった、ログイン中のユーザーが変わった、新規ユーザー登録が済んだ）に合う関数を呼ぶだけにする。
- `currentUser` は `/_authed` の `beforeLoad` でしか読まれず、ふだんは非アクティブなので、無効化しただけでは取り直されない。新規ユーザー登録のあとは `refetchType: "all"` で取り直す。
- 詳細ページの取得は、`shared/api/detail-query.ts` の `defineDetailQuery` で定義し、ルートの `loader` とページはそれが返す `load` / `useData` を使う。404 なら、開く前（`loader`）でも、開いたあとに取り直したとき（例: ほかの画面で投稿が削除された）でも、`notFound` を投げてルートの「見つからない」を表示する。ページは見つかった値だけを受け取る。新しい詳細ページで 404 の扱いを書き直さないようにするため。
- コンポーネントで投げた `notFound` は、`routeId` を指定しないと投げたルートのものとして扱われ、`notFoundComponent` を持つルートに届かずエラーになる。そのため `defineDetailQuery` は `routeId` をルートにして投げる。
- 投稿を削除したら、`"posts"` のクエリをすべて無効にするが、削除した投稿のクエリ（詳細とコメント）は取り直さない。詳細ページで削除したときは前のページ（なければタイムライン）へ戻るので、戻るまでの間に 404 が見えないようにするため。
- 更新のあとの通知や画面遷移は、`mutateAsync` の結果で行う。`mutate` に渡したコールバックは、更新で対象のカードが消えてコンポーネントがアンマウントされると呼ばれない。
- 更新の結果の知らせ方は、`shared/lib/notify-mutation.tsx` の `notifyMutation` の 1 か所にまとめる。UI は mutation と値と「何をしているか」のラベル（「投稿」「削除」など）を渡し、返る真偽値で成功したときの続き（入力を空にする、画面を移る）だけを書く。`notifyMutation` は `mutateAsync` で待ち、送信中・成功・失敗の通知を出す。通知の文言はラベルから作る（「投稿中...」「投稿に成功しました！」「投稿に失敗しました。」）。
  - 失敗は、API が返した `message`（[0005](./0005-api-input-errors-and-query-rules.md)）をそのまま見せる。`shared/api/response.ts` は、`{ message }` のある失敗のレスポンスを `ApiError` にして投げる。`message` のない失敗（通信の失敗など）は、英語のメッセージを見せないように「{ラベル}に失敗しました。」にする。
  - いいね・フォロー・新規ユーザー登録は、結果がすぐ画面に出る（ボタンが変わる、画面を移る）ので、`report: "failure"` で失敗だけを知らせる。
  - 送信中から結果への通知は Mantine の `notifications.promise` で出す。`notifications.update` は前の通知に値を重ねるので、送信中の読み込みの表示が結果に残る。また送信中の通知が閉じられると、結果の通知が出ない。`notifications.update` と、`loading` を付けた `notifications.show` は lint（`mutation-notice/no-manual`）で禁じる。
  - 成功の続きが呼び出し元の画面を変える（モーダルを閉じる、入力を空にする）ときは、`useIsMounted` で呼び出し元がまだ表示されているかを確かめる。`mutateAsync` の結果は、呼び出し元がアンマウントされたあとにも届く。たとえば投稿のモーダルを閉じて開き直したあとに前の投稿が済むと、開き直したモーダルを閉じてしまう。画面の移動（投稿を消したあとに戻る）は、アンマウントされたあとでも行う。
- いいねは、送信中は押した結果を先に表示する。取り直しが終わるまで mutation は pending のままなので、その間は `variables` の値を使う。
