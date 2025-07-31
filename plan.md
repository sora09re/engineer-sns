- [x] `src/shared/ui/FollowButton` を `src/features/follow/ui` へ移動する。

- [x] `src/shared/ui/UsersList` を `src/widgets/user-list` へ移動する
- [x] `src/shared/ui/Post/Post.tsx` を `src/entities/post` へ移動する
✅ `src/shared/ui/PostActionMenu` を `src/entities/post` へ移動する
✅ entities や features などの ui フォルダ直下の index.ts を削除する。
✅ `src/shared/ui` 内のファイルで特定のページからしか使用されていないコンポーネントを `src/pages/〇〇/ui` へ移動する

✅ `src/shared/ui/Sidebar` を `src/widgets` へ移動する
✅ `src/shared/ui/Modal/PostModal` を `src/features/create-post/ui` へ移動する
✅ `src/shared/ui/NewPostForm/NewPostForm.tsx` を `src/features/create-post/ui` へ移動する
✅ `src/shared/ui/PostActionsButtonGroup` を `src/entities/post/ui` へ移動する
✅ `src/shared/entities/profile.ts` を `src/entities/profile/model` に移動する
✅ `src/shared/api/useGetProfile.tsx` を `src/entities/profile/api` に移動する

✅ `src/shared/api/useGetCommentsForPost.tsx` を `src/pages/posts/api` に移動する
✅ `src/shared/api/useGetPostDetail.tsx` を `src/pages/posts/api` に移動する


- `src/entities/post/ui/Post.tsx` を `src/widgets/posts/ui` に移動する
- `src/entities/post/ui/PostActionMenu.tsx` を `src/widgets/posts/ui` に移動する
- src/shared/api/useGetCurrentUser.tsx を src/entities/user/api に移動する
