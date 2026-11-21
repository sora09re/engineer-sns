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
- `currentUser` は `/_authed` の `beforeLoad` でしか読まれず、ふだんは非アクティブなので、無効化しただけでは取り直されない。新規ユーザー登録のあとは `refetchType: "all"` で取り直す。
- 詳細ページの取得は、404 なら `null` を返し、「見つからない」を表示する。
- いいねは、送信中は押した結果を先に表示する。取り直しが終わるまで mutation は pending のままなので、その間は `variables` の値を使う。
