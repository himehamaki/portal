#!/bin/bash

# ========================================
# Portal アプリケーション RockyLinux 9 セットアップスクリプト
# ========================================

set -e

echo "🔹 Portal アプリケーション セットアップを開始します..."

# ========== システム更新 ==========
echo "📄 システムを更新中..."
sudo dnf update -y
sudo dnf install -y epel-release

# ========== Docker インストール ==========
echo "🐓 Docker をインストール中..."
sudo dnf install -y dnf-plugins-core
sudo dnf config-manager --add-repo https://download.docker.com/linux/rhel/docker-ce.repo
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Docker サービスを開始
 sudo systemctl start docker
sudo systemctl enable docker

# 現在ユーザーを docker グループに追加
echo "👥 現在ユーザーを docker グループに追加中..."
sudo usermod -aG docker $USER
newgrp docker

# ========== Docker Compose スタンドアローンインストール ==========
echo "📈 Docker Compose をインストール中..."
DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d'"' -f4)
sudo curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# ========== 其他必须ツール ==========
echo "🔧 其他必须ツールをインストール中..."
sudo dnf install -y \
  curl \
  wget \
  vim \
  nano \
  htop \
  net-tools \
  git \
  openssh-clients

# ========== バージョン確認 ==========
echo ""
echo "✔️  セットアップ完了！"
echo ""
echo "🔍 バージョン確認:"
echo "  Docker: $(docker --version)"
echo "  Docker Compose: $(docker-compose --version)"
echo "  Git: $(git --version)"
echo ""
echo "🚀 次の手順:"
echo "  1. Git リポジトリをクローン:"
echo "     git clone https://github.com/himehamaki/portal.git"
echo "     cd portal"
echo ""
echo "  2. 環境変数を設定:"
echo "     cp .env.example .env"
echo ""
echo "  3. Docker Compose で起動:"
echo "     docker-compose up -d"
echo ""
echo "  4. アクセス:"
echo "     🌐 フロントエンド: http://localhost:5173"
echo "     🖌  API: http://localhost:8080/api"
echo ""
echo "👥 テストアカウント:"
echo "  管理者: admin001 / password123"
echo "  ユーザー: user001 / password123"
echo ""
