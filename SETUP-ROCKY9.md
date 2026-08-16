# RockyLinux 9 セットアップガイド

## 前提条件

- VirtualBox 上の RockyLinux 9 環境
- Git がインストール済み
- sudo 稱号で実行可能

## インストール手順

### 1️⃣ 自動セットアップ（推奨）

的スクリプトを使用して、すべて自動でインストール:

```bash
cd ~
curl -fsSL https://raw.githubusercontent.com/himehamaki/portal/main/setup-rocky9.sh -o setup-rocky9.sh
chmod +x setup-rocky9.sh
./setup-rocky9.sh
```

### 2️⃣ 手動インストール

事前準備 を衝気にしたい場合は、手動で実行してください:

```bash
# システム更新
sudo dnf update -y
sudo dnf install -y epel-release

# Docker インストール
sudo dnf install -y dnf-plugins-core
sudo dnf config-manager --add-repo https://download.docker.com/linux/rhel/docker-ce.repo
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Docker サービス起動
sudo systemctl start docker
sudo systemctl enable docker

# 現在ユーザーを docker グループに追加
sudo usermod -aG docker $USER
newgrp docker

# その他必须ツール
sudo dnf install -y curl wget vim nano htop net-tools
```

## Portal アプリケーションを起動

### 1️⃣ リポジトリをクローン

```bash
cd ~
git clone https://github.com/himehamaki/portal.git
cd portal
```

### 2️⃣ 環境変数を設定

```bash
cp .env.example .env

# 必要に応じて .env を編集
vim .env
```

### 3️⃣ Docker Compose で起動

```bash
# 起動
docker-compose up -d

# ログを確認
docker-compose logs -f

# 特定コンテナを確認
docker-compose logs backend   # バックエンド
docker-compose logs frontend  # フロントエンド
docker-compose logs postgres  # データベース
```

## アクセス

| アプリケーション | URL | 機能 |
|---|---|---|
| **フロントエンド** | http://localhost:5173 | Portal UI |
| **バックエンド API** | http://localhost:8080/api | REST API |
| **PostgreSQL** | localhost:5432 | データベース |

## テストアカウント

| 役割 | ユーザーコード | パスワード |
|---|---|---|
| 管理者 | admin001 | password123 |
| 一般ユーザー | user001 | password123 |

## トラブルシューティング

### ポート競合エラー

```bash
# 使用中のポートを確認
sudo netstat -tlnp | grep -E ':(5173|8080|5432)'

# 別のポートを指定 (.env を編集)
DB_PORT=5433
BACKEND_PORT=8081
FRONTEND_PORT=5174

docker-compose up -d
```

### コンテナが起動しない

```bash
# ログを確認
docker-compose logs backend

# コンテナを再起動
docker-compose restart backend

# コンテナを再機動
docker-compose down
docker-compose up -d
```

### データベースに接続

```bash
docker exec -it portal-db psql -U portal_user -d portal_db

# テーブル一覧を読み込み
\dt

# 特定テーブルを確認
SELECT * FROM users;

# 終了
docker-compose logs -f
```

## 次のステップ

1. ブラウザで http://localhost:5173 を開いてログイン
2. 「お知らせ」と「FAQ」内容を確認
3. 管理画面で新規作成を試す

## サポート

事不明な点があれば、GitHub Issues で報告してください。
