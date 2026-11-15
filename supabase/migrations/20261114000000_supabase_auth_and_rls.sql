-- Auth.js (next_auth スキーマ) から Supabase Auth への移行。
-- アカウントの ID が変わるため、既存データは引き継がずに作り直す（docs/adr/0001 参照）。

drop table if exists public.likes cascade;
drop table if exists public.follows cascade;
drop table if exists public.posts cascade;
drop table if exists public.users cascade;
drop schema if exists next_auth cascade;

-- updated_at を自動更新する
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
	new.updated_at = now();
	return new;
end;
$$;

-- ユーザー: アカウント (auth.users) に 0..1 で紐づくプロフィール
create table public.users (
	id uuid primary key references auth.users (id) on delete cascade,
	name text not null,
	username text not null unique,
	email text not null,
	bio text,
	location text,
	website text,
	profile_image_url text,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create trigger users_set_updated_at
before update on public.users
for each row execute function public.set_updated_at();

-- 投稿。parent_post_id を持つものはコメント
create table public.posts (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null references public.users (id) on delete cascade,
	parent_post_id uuid references public.posts (id) on delete cascade,
	content text not null check (length(trim(content)) > 0),
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create index posts_user_id_idx on public.posts (user_id);
create index posts_parent_post_id_idx on public.posts (parent_post_id);

create trigger posts_set_updated_at
before update on public.posts
for each row execute function public.set_updated_at();

create table public.likes (
	id uuid primary key default gen_random_uuid(),
	post_id uuid not null references public.posts (id) on delete cascade,
	user_id uuid not null references public.users (id) on delete cascade,
	created_at timestamptz not null default now(),
	unique (post_id, user_id)
);

create index likes_user_id_idx on public.likes (user_id);

-- フォロー: follower (フォローする側) が followee (フォローされる側) を購読する
create table public.follows (
	id uuid primary key default gen_random_uuid(),
	follower_id uuid not null references public.users (id) on delete cascade,
	followee_id uuid not null references public.users (id) on delete cascade,
	created_at timestamptz not null default now(),
	unique (follower_id, followee_id),
	check (follower_id <> followee_id)
);

create index follows_followee_id_idx on public.follows (followee_id);

-- 権限: 未ログイン (anon) には何も見せない
revoke all on public.users, public.posts, public.likes, public.follows from anon;
grant select, insert, update on public.users to authenticated;
grant select, insert, delete on public.posts to authenticated;
grant select, insert, delete on public.likes to authenticated;
grant select, insert, delete on public.follows to authenticated;

alter table public.users enable row level security;
alter table public.posts enable row level security;
alter table public.likes enable row level security;
alter table public.follows enable row level security;

-- users
create policy "users: ログイン済みなら読める" on public.users
for select to authenticated using (true);

create policy "users: 本人のみ作成できる" on public.users
for insert to authenticated with check (id = (select auth.uid()));

create policy "users: 本人のみ更新できる" on public.users
for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

-- posts
create policy "posts: ログイン済みなら読める" on public.posts
for select to authenticated using (true);

create policy "posts: 本人名義でのみ作成できる" on public.posts
for insert to authenticated with check (user_id = (select auth.uid()));

create policy "posts: 投稿者のみ削除できる" on public.posts
for delete to authenticated using (user_id = (select auth.uid()));

-- likes
create policy "likes: ログイン済みなら読める" on public.likes
for select to authenticated using (true);

create policy "likes: 本人のみ作成できる" on public.likes
for insert to authenticated with check (user_id = (select auth.uid()));

create policy "likes: 本人のみ削除できる" on public.likes
for delete to authenticated using (user_id = (select auth.uid()));

-- follows
create policy "follows: ログイン済みなら読める" on public.follows
for select to authenticated using (true);

create policy "follows: フォローする側の本人のみ作成できる" on public.follows
for insert to authenticated with check (follower_id = (select auth.uid()));

create policy "follows: フォローする側の本人のみ削除できる" on public.follows
for delete to authenticated using (follower_id = (select auth.uid()));

-- プロフィール画像: 公開バケット。{userId}/ 配下に本人のみアップロードできる
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('profile_image', 'profile_image', true, 3145728, array['image/png', 'image/jpeg', 'image/gif', 'image/webp'])
on conflict (id) do update
set public = excluded.public,
	file_size_limit = excluded.file_size_limit,
	allowed_mime_types = excluded.allowed_mime_types;

create policy "profile_image: 本人のフォルダにのみアップロードできる" on storage.objects
for insert to authenticated
with check (
	bucket_id = 'profile_image'
	and (storage.foldername(name))[1] = (select auth.uid())::text
);
