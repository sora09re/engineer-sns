-- フロントから DB と Storage に直接アクセスできないようにする（docs/adr/0002）。
-- 読み書きはすべて API（apps/api）が postgres のロールで行い、認可も API で行う。
-- 本番に当てるのは、API を通す FE と API をデプロイした後にする（古い FE は動かなくなる）。

-- テーブル: ログイン済み（authenticated）からも、すべての権限を外す（anon はすでに外している）
revoke all on public.users, public.posts, public.likes, public.follows from anon, authenticated;

-- RLS のポリシーは残す。ルールの正は API に移ったが、誤って権限を付け直しても本人の行に絞られる。
-- ポリシーを消すと、Supabase の Security Advisor が「RLS Enabled No Policy」と指摘する

-- これから public に作るもの: Supabase は anon と authenticated に権限を付けるので、付かないようにする。
-- postgres のロールが作るもの（マイグレーションや SQL エディタ）が対象
alter default privileges for role postgres in schema public revoke all on tables from anon, authenticated;
alter default privileges for role postgres in schema public revoke all on sequences from anon, authenticated;
alter default privileges for role postgres in schema public revoke all on functions from anon, authenticated;
-- 関数は Postgres の組み込みの既定で PUBLIC にも実行権限が付き、PostgREST の /rpc から呼べてしまう。
-- 組み込みの既定はスキーマを指定しても取り消せないので、postgres が作る関数すべてを対象にする
alter default privileges for role postgres revoke execute on functions from public;

-- Storage: アップロードは API が発行する署名付き URL で行うので、直接アップロードのポリシーを消す。
-- 公開バケットなので、画像の読み込みはこれまでどおりできる
drop policy "profile_image: 本人のフォルダにのみアップロードできる" on storage.objects;
