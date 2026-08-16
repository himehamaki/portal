-- ========================================
-- Portal DB 初期化スクリプト
-- ========================================

-- ========== テーブル作成 ==========

-- ユーザーテーブル
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    user_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    department_id BIGINT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ロールテーブル
CREATE TABLE IF NOT EXISTS roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

-- ユーザーロール関連テーブル
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- カテゴリテーブル
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    display_order INT DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- お知らせテーブル
CREATE TABLE IF NOT EXISTS announcements (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category_id BIGINT NOT NULL,
    author_id BIGINT NOT NULL,
    image_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'DRAFT',
    is_important BOOLEAN DEFAULT false,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (author_id) REFERENCES users(id)
);

-- お知らせ既読テーブル
CREATE TABLE IF NOT EXISTS announcement_reads (
    id BIGSERIAL PRIMARY KEY,
    announcement_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (announcement_id) REFERENCES announcements(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- FAQ テーブル
CREATE TABLE IF NOT EXISTS faqs (
    id BIGSERIAL PRIMARY KEY,
    question VARCHAR(200) NOT NULL,
    answer TEXT NOT NULL,
    category_id BIGINT NOT NULL,
    display_order INT DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- ========== インデックス作成 ==========
CREATE INDEX IF NOT EXISTS idx_announcements_category_id ON announcements(category_id);
CREATE INDEX IF NOT EXISTS idx_announcements_author_id ON announcements(author_id);
CREATE INDEX IF NOT EXISTS idx_announcements_status ON announcements(status);
CREATE INDEX IF NOT EXISTS idx_announcement_reads_announcement_id ON announcement_reads(announcement_id);
CREATE INDEX IF NOT EXISTS idx_announcement_reads_user_id ON announcement_reads(user_id);
CREATE INDEX IF NOT EXISTS idx_faqs_category_id ON faqs(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(type);

-- ========== サンプルデータ挿入 ==========

-- ロール
INSERT INTO roles (name, description) VALUES 
    ('ROLE_ADMIN', 'システム管理者'),
    ('ROLE_USER', '一般ユーザー')
ON CONFLICT (name) DO NOTHING;

-- テストユーザー（パスワード: password123）
INSERT INTO users (user_code, name, email, password, is_active) VALUES 
    ('admin001', '管理者太郎', 'admin@example.com', '$2a$10$YU8nkRNe8CXsKdSvR7nEAepVjQu.zMfPiQmRvQW6TiVNgS0TfKKvK', true),
    ('user001', 'ユーザー一郎', 'user@example.com', '$2a$10$YU8nkRNe8CXsKdSvR7nEAepVjQu.zMfPiQmRvQW6TiVNgS0TfKKvK', true)
ON CONFLICT (user_code) DO NOTHING;

-- ユーザーロール関連付け
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r 
WHERE u.user_code = 'admin001' AND r.name = 'ROLE_ADMIN'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r 
WHERE u.user_code = 'user001' AND r.name = 'ROLE_USER'
ON CONFLICT DO NOTHING;

-- お知らせカテゴリ
INSERT INTO categories (type, name, display_order, is_visible) VALUES 
    ('ANNOUNCEMENT', '重要なお知らせ', 1, true),
    ('ANNOUNCEMENT', 'イベント', 2, true),
    ('ANNOUNCEMENT', 'システムメンテナンス', 3, true),
    ('FAQ', 'よくある質問', 1, true)
ON CONFLICT DO NOTHING;

-- サンプル FAQ
INSERT INTO faqs (question, answer, category_id, display_order, is_visible) VALUES 
    ('ログインできません', 'パスワードをリセットしてください。「ログイン」ページの「パスワードを忘れた」からリセット可能です。', 
     (SELECT id FROM categories WHERE type = 'FAQ' LIMIT 1), 1, true),
    ('プロフィールを変更するには？', 'メインメニューの「プロフィール」から変更できます。メールアドレスと電話番号が変更可能です。', 
     (SELECT id FROM categories WHERE type = 'FAQ' LIMIT 1), 2, true),
    ('パスワード変更の方法は？', 'プロフィール画面の「セキュリティ」タブから「パスワード変更」を選択してください。', 
     (SELECT id FROM categories WHERE type = 'FAQ' LIMIT 1), 3, true)
ON CONFLICT DO NOTHING;
