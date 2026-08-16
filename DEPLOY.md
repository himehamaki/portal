# 🚀 Portal アプリケーション デプロイガイド

## 前提条件

- VirtualBox 上の Linux 環境
- Docker & Docker Compose がインストール済み
- Git がインストール済み

## セットアップ手順

### 1️⃣ リポジトリをクローン

```bash
git clone https://github.com/himehamaki/portal.git
cd portal
```

### 2️⃣ 環境変数ファイルを作成

```bash
cp .env.example .env
```

必要に応じて `.env` を編集（デフォルトでも動作します）

### 3️⃣ Docker Compose で起動

```bash
docker-compose up -d
```

初回起動時は、イメージのビルドに 2-3 分かかります。

### 4️⃣ アプリケーションにアクセス

| アプリケーション | URL | 説明 |
|---|---|---|
| **フロントエンド** | http://localhost:5173 | ポータルの UI |
| **バックエンド API** | http://localhost:8080/api | REST API |
| **PostgreSQL** | localhost:5432 | データベース |

## テストアカウント

### 管理者アカウント
- **ユーザーコード**: `admin001`
- **パスワード**: `password123`

### 一般ユーザアカウント
- **ユーザーコード**: `user001`
- **パスワード**: `password123`

## よく使うコマンド

### ログを確認
```bash
docker-compose logs -f backend    # バックエンドのログ
docker-compose logs -f frontend   # フロントエンドのログ
docker-compose logs -f postgres   # データベースのログ
```

### コンテナを停止
```bash
docker-compose down
```

### コンテナを再起動
```bash
docker-compose restart
```

### データベースに接続
```bash
docker exec -it portal-db psql -U portal_user -d portal_db
```

## トラブルシューティング

### ポート競合エラー

ポートがすでに使用されている場合、`.env` で別のポートを指定してください：

```bash
DB_PORT=5433
BACKEND_PORT=8081
FRONTEND_PORT=5174
```

### バックエンドが起動しない

```bash
# ログを確認
docker-compose logs backend

# データベースの接続を確認
docker exec -it portal-db psql -U portal_user -d portal_db -c "SELECT 1;"
```

### フロントエンドが起動しない

```bash
docker-compose logs frontend
```

## 機能

✅ **お知らせ管理**
- リッチテキストエディタで作成・編集
- 画像アップロード対応
- カテゴリ分類・既読管理

✅ **FAQ（よくある質問）**
- 管理者向け CRUD
- ユーザー向け閲覧
- カテゴリ別表示

✅ **認証・ユーザー管理**
- JWT ベースの認証
- ロールベースのアクセス制御

## 次のステップ

1. ログイン画面でテストアカウントでログイン
2. 「お知らせ」セクションを確認
3. 「FAQ」セクションを確認
4. 管理画面でお知らせ・FAQ を作成

## サポート

問題が発生した場合は、GitHub Issues で報告してください。
