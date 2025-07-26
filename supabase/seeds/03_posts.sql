INSERT INTO posts (
    id,
    content,
    created_at,
    is_deleted,
    updated_at,
    user_id,
    parent_post_id
) VALUES
-- 1
('b23e4567-e89b-12d3-a456-426614174010', 'Hello world! This is my first post.', '2025-05-01 08:00:00', false, '2025-05-01 08:00:00', '123e4567-e89b-12d3-a456-426614174000', NULL),
-- 2
('b23e4567-e89b-12d3-a456-426614174011', 'Does anyone know good places to visit in Berlin?', '2025-04-29 13:15:00', false, '2025-04-30 10:30:00', '223e4567-e89b-12d3-a456-426614174001', NULL),
-- 3
('b23e4567-e89b-12d3-a456-426614174012', 'Check out my latest travel blog!', '2025-03-22 17:45:00', false, '2025-03-22 17:45:00', '323e4567-e89b-12d3-a456-426614174002', NULL),
-- 4
('b23e4567-e89b-12d3-a456-426614174013', 'I just pushed a new update to GitHub.', '2025-04-01 11:10:00', false, '2025-04-01 11:10:00', '423e4567-e89b-12d3-a456-426614174003', NULL),
-- 5
('b23e4567-e89b-12d3-a456-426614174014', 'Open source contributions are underrated.', '2025-04-12 20:00:00', false, '2025-04-12 20:00:00', '523e4567-e89b-12d3-a456-426614174004', NULL),
-- 6
('b23e4567-e89b-12d3-a456-426614174015', 'New paper on LLMs just published!', '2025-03-30 09:00:00', false, '2025-03-30 09:00:00', '623e4567-e89b-12d3-a456-426614174005', NULL),
-- 7
('b23e4567-e89b-12d3-a456-426614174016', 'Don’t click random links. Stay safe online!', '2025-02-11 16:30:00', false, '2025-02-11 16:30:00', '723e4567-e89b-12d3-a456-426614174006', NULL),
-- 8
('b23e4567-e89b-12d3-a456-426614174017', 'Captured this sunset last weekend 🌅', '2025-01-20 18:00:00', false, '2025-01-20 18:00:00', '823e4567-e89b-12d3-a456-426614174007', NULL),
-- 9
('b23e4567-e89b-12d3-a456-426614174018', 'My new indie game is live on itch.io!', '2025-04-10 10:10:00', false, '2025-04-10 10:10:00', '923e4567-e89b-12d3-a456-426614174008', NULL),
-- 10
('b23e4567-e89b-12d3-a456-426614174019', 'Exploring data visualization techniques.', '2025-05-01 09:00:00', false, '2025-05-01 09:00:00', 'a23e4567-e89b-12d3-a456-426614174009', NULL);
