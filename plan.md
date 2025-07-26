✅ `app` フォルダ内の _components フォルダを `src/pages/〇〇/ui` へ移動する。

例:

1. export default から 通常の export に修正する。
2. `app/search/_components/SearchPageClient.tsx` を `src/pages/search/ui` へ移動する。
3. その Export を `src/pages/search/index.ts` へ追加する。
4. コミットする。

完了したコンポーネント:
- ✅ SearchPageClient
- ✅ TopPageClient  
- ✅ NewUserPageClient
- ✅ SigninPageClient
- ✅ PostDetailPageClient
- ✅ ProfilePageClient
- ✅ FollowsPageClient
