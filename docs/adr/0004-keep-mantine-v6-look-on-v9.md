# Mantine 9 に上げても v6 の見た目を保つ

Mantine を 6 から 9 に上げたとき、既定値や廃止されたコンポーネントのせいで見た目が変わった。見た目を変える判断はバージョンアップと分けたいので、v6 の見た目を保つ。保つための差分は、なるべく `apps/web/src/app/theme.ts` に集める。見た目を変えるときは、まずそこを直し、それから VRT のベースラインを更新する（[0006](./0006-api-tests-and-e2e-vrt.md)）。

## v6 に戻しているもの

- **dark の色**: v9 は青みのない灰色になったので、v6 の `dark` のパレットを使う
- **`fontSizes.xl`**: v9 で 24px から 32px になったので、v6 の値に戻す
- **`ActionIcon` の `variant`**: v6 の既定は `subtle`
- **`Avatar` の角**: v9 の `Avatar` は `defaultRadius` に関係なく丸い。v6 は `sm`
- **ドロップダウンの位置**: v9 は画面の端から 5px 離す。v6 は端まで寄せていた
- **`Textarea` の `minRows`**: v9 は `autosize` でないと効かないので、`autosize` を付ける

## 廃止されたコンポーネントの置き換え

- **`Image` の `withPlaceholder`**: Mantine 7 で廃止された。画像がないときは、v6 と同じプレースホルダーのアイコンを自前で出す（`entities/user/ui/ImageUpload.tsx`）。v6 ではアイコンが中央より 3px 上にあったので、そこも合わせる
- **`Navbar`**: Mantine 7 で廃止された。v6 の `Navbar`（fixed）と同じ配置を `nav` で組む（`widgets/sidebar/ui/Sidebar.tsx`）。v6 の `Navbar` は下端が基準（`bottom: 0`）で、高さは `100vh` だった

## Considered Options

- **v9 の既定の見た目に合わせ、VRT のベースラインを撮り直す**: 差分は小さく済むが、バージョンアップの PR で見た目の変化まで判断することになる。ライブラリの更新と見た目の変更を同じ PR に混ぜないことにした。
