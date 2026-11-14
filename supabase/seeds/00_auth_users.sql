-- シード用のアカウント。public.users はこれらの ID を参照する。
-- パスワードは持たせない（ローカルでは GitHub ログインした自分のアカウントから閲覧する想定）。
-- トークン系のカラムは空文字にする。NULL のままだと Auth サーバーがユーザー一覧を読めない
-- （admin API の GET /admin/users が "converting NULL to string is unsupported" で失敗する）。
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
)
SELECT
    '00000000-0000-0000-0000-000000000000',
    u.id::uuid,
    'authenticated',
    'authenticated',
    u.email,
    now(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{}'::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    ''
FROM (VALUES
    ('123e4567-e89b-12d3-a456-426614174000', 'johndoe@example.com'),
    ('223e4567-e89b-12d3-a456-426614174001', 'artbyana@example.com'),
    ('323e4567-e89b-12d3-a456-426614174002', 'lucaswrites@example.com'),
    ('423e4567-e89b-12d3-a456-426614174003', 'mariadev@example.com'),
    ('523e4567-e89b-12d3-a456-426614174004', 'alexbackend@example.com'),
    ('623e4567-e89b-12d3-a456-426614174005', 'sara.ai@example.com'),
    ('723e4567-e89b-12d3-a456-426614174006', 'hackerjoe@example.com'),
    ('823e4567-e89b-12d3-a456-426614174007', 'naturepix@example.com'),
    ('923e4567-e89b-12d3-a456-426614174008', 'devpixel@example.com'),
    ('a23e4567-e89b-12d3-a456-426614174009', 'numbersnarrative@example.com')
) AS u (id, email);
