-- Drop existing tables if they exist (for fresh setup)
DROP TABLE IF EXISTS announcement_reads CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS qa_questions CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS group_roles CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS user_groups CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS groups CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

-- 1. Departments Table
CREATE TABLE departments (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    user_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    department_id BIGINT REFERENCES departments(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Permissions Table
CREATE TABLE permissions (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL
);

-- 4. Roles Table
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    is_system_preset BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Role Permissions (Many-to-Many)
CREATE TABLE role_permissions (
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id BIGINT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- 6. Groups Table
CREATE TABLE groups (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. User Groups (Many-to-Many)
CREATE TABLE user_groups (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    group_id BIGINT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, group_id)
);

-- 8. User Roles (Many-to-Many)
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- 9. Group Roles (Many-to-Many)
CREATE TABLE group_roles (
    group_id BIGINT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (group_id, role_id)
);

-- 10. Categories Table
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    display_order INT DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Announcements Table
CREATE TABLE announcements (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content LONGTEXT NOT NULL,
    category_id BIGINT NOT NULL REFERENCES categories(id),
    author_id BIGINT NOT NULL REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'DRAFT',
    is_important BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. Announcement Reads Table
CREATE TABLE announcement_reads (
    id BIGSERIAL PRIMARY KEY,
    announcement_id BIGINT NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    read_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(announcement_id, user_id)
);

-- 13. QA Questions Table
CREATE TABLE qa_questions (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category_id BIGINT NOT NULL REFERENCES categories(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_resolved BOOLEAN DEFAULT FALSE,
    best_answer_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_users_user_code ON users(user_code);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_announcements_category ON announcements(category_id);
CREATE INDEX idx_announcements_author ON announcements(author_id);
CREATE INDEX idx_qa_questions_category ON qa_questions(category_id);
CREATE INDEX idx_qa_questions_user ON qa_questions(user_id);
CREATE INDEX idx_announcement_reads_announcement ON announcement_reads(announcement_id);
CREATE INDEX idx_announcement_reads_user ON announcement_reads(user_id);

-- Insert sample data
INSERT INTO departments (name, description) VALUES
('IT部門', 'Information Technology Division'),
('営業部門', 'Sales Division'),
('人事部門', 'Human Resources Division'),
('経理部門', 'Finance Division'),
('企画部門', 'Planning Division');

-- Insert permissions
INSERT INTO permissions (code, name, category) VALUES
('DASHBOARD_VIEW', 'ダッシュボード閲覧', 'ダッシュボード・全般'),
('MYLINK_EDIT', 'マイリンク編集', 'ダッシュボード・全般'),
('COMMON_LINK_MANAGE', '全社リンク管理', 'ダッシュボード・全般'),
('ANNOUNCEMENT_VIEW', 'お知らせ閲覧', 'お知らせ機能'),
('ANNOUNCEMENT_CREATE', 'お知らせ作成', 'お知らせ機能'),
('ANNOUNCEMENT_PUBLISH', 'お知らせ配信・編集', 'お知らせ機能'),
('ANNOUNCEMENT_READ_TRACK', '既読状況追跡', 'お知らせ機能'),
('QA_POST', 'Q&A投稿', 'Q&A機能'),
('QA_MODERATE', 'Q&Aモデレーション', 'Q&A機能'),
('SURVEY_ANSWER', 'アンケート回答', 'アンケート機能'),
('SURVEY_MANAGE', 'アンケート作成・集計', 'アンケート機能'),
('USER_VIEW', 'ユーザー・組織閲覧', '組織・社員名鑑'),
('PROFILE_EDIT_SELF', '自プロフィール編集', '組織・社員名鑑'),
('USER_MANAGE', 'ユーザー・組織管理', '組織・社員名鑑'),
('ROLE_MANAGE', 'ロール管理', 'システム・権限管理'),
('ROLE_ASSIGN', '権限付与', 'システム・権限管理'),
('GROUP_MANAGE', 'グループ管理', 'システム・権限管理'),
('AUDIT_LOG_VIEW', '監査ログ閲覧', 'システム・権限管理');

-- Insert roles
INSERT INTO roles (name, description, is_system_preset) VALUES
('一般ユーザー', 'Basic user with standard permissions', TRUE),
('システム管理者', 'System administrator with full permissions', TRUE),
('広報担当', 'PR staff can manage announcements and surveys', FALSE);

-- Assign permissions to General User role
INSERT INTO role_permissions (role_id, permission_id) VALUES
(1, 1), -- DASHBOARD_VIEW
(1, 2), -- MYLINK_EDIT
(1, 4), -- ANNOUNCEMENT_VIEW
(1, 8), -- QA_POST
(1, 10), -- SURVEY_ANSWER
(1, 12), -- USER_VIEW
(1, 13); -- PROFILE_EDIT_SELF

-- Assign permissions to System Administrator role (all permissions)
INSERT INTO role_permissions (role_id, permission_id) VALUES
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6), (2, 7),
(2, 8), (2, 9), (2, 10), (2, 11), (2, 12), (2, 13), (2, 14),
(2, 15), (2, 16), (2, 17), (2, 18);

-- Assign permissions to PR Staff role
INSERT INTO role_permissions (role_id, permission_id) VALUES
(3, 1), -- DASHBOARD_VIEW
(3, 2), -- MYLINK_EDIT
(3, 4), -- ANNOUNCEMENT_VIEW
(3, 5), -- ANNOUNCEMENT_CREATE
(3, 6), -- ANNOUNCEMENT_PUBLISH
(3, 7), -- ANNOUNCEMENT_READ_TRACK
(3, 8), -- QA_POST
(3, 10), -- SURVEY_ANSWER
(3, 11), -- SURVEY_MANAGE
(3, 12), -- USER_VIEW
(3, 13); -- PROFILE_EDIT_SELF

-- Insert sample users (passwords are hashed with BCrypt - all are 'password123')
INSERT INTO users (user_code, name, email, password, department_id, is_active) VALUES
('admin001', 'システム管理者', 'admin@company.com', '$2a$10$slYQmyNdGzin7olVN3p5Be7DlH.PKZbv5H8KnzzVgXXbVxzy2QSZG', 1, TRUE),
('user001', '山田太郎', 'yamada.taro@company.com', '$2a$10$slYQmyNdGzin7olVN3p5Be7DlH.PKZbv5H8KnzzVgXXbVxzy2QSZG', 2, TRUE),
('user002', '佐藤花子', 'sato.hanako@company.com', '$2a$10$slYQmyNdGzin7olVN3p5Be7DlH.PKZbv5H8KnzzVgXXbVxzy2QSZG', 3, TRUE),
('user003', '鈴木次郎', 'suzuki.jiro@company.com', '$2a$10$slYQmyNdGzin7olVN3p5Be7DlH.PKZbv5H8KnzzVgXXbVxzy2QSZG', 4, TRUE);

-- Assign roles to users
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 2), -- admin001 => System Admin
(2, 1), -- user001 => General User
(3, 3), -- user002 => PR Staff
(4, 1); -- user003 => General User

-- Insert groups
INSERT INTO groups (name, description) VALUES
('全社広報チーム', 'Company-wide PR team'),
('ITサポート課', 'IT Support team'),
('新入社員2026年', 'New employees 2026');

-- Assign groups to users
INSERT INTO user_groups (user_id, group_id) VALUES
(1, 2), -- admin001 in IT Support
(2, 3), -- user001 in New employees
(3, 1), -- user002 in PR team
(3, 3); -- user002 in New employees

-- Insert categories
INSERT INTO categories (type, name, display_order, is_visible) VALUES
('ANNOUNCEMENT', '全社', 1, TRUE),
('ANNOUNCEMENT', '人事関連', 2, TRUE),
('ANNOUNCEMENT', 'IT・セキュリティ', 3, TRUE),
('ANNOUNCEMENT', '経営', 4, TRUE),
('QA', '総務', 1, TRUE),
('QA', 'IT', 2, TRUE),
('QA', '人事', 3, TRUE);
