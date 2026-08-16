import React from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * サイドバーコンポーネント
 * ナビゲーションメニューと管理者向けメニューを表示
 */
export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes('システム管理者') || user?.roles?.includes('System Admin');

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="p-6 space-y-2">
        {/* ユーザー向けメニュー */}
        <a href="/" className="block px-4 py-2 rounded hover:bg-gray-100">📊 ダッシュボード</a>
        <a href="/announcements" className="block px-4 py-2 rounded hover:bg-gray-100">📰 お知らせ</a>
        <a href="/faqs" className="block px-4 py-2 rounded hover:bg-gray-100">❓ FAQ</a>
        <a href="#" className="block px-4 py-2 rounded hover:bg-gray-100">🤔 Q&A</a>
        <a href="#" className="block px-4 py-2 rounded hover:bg-gray-100">📋 アンケート</a>
        <a href="#" className="block px-4 py-2 rounded hover:bg-gray-100">👥 社員名鑑</a>
        
        {/* 管理者メニュー */}
        {isAdmin && (
          <>
            <hr className="my-4" />
            <div className="text-xs font-bold text-gray-600 px-4 py-2">管理メニュー</div>
            <a href="/admin/announcements" className="block px-4 py-2 rounded hover:bg-gray-100">📋 お知らせ管理</a>
            <a href="/admin/faqs" className="block px-4 py-2 rounded hover:bg-gray-100">❓ FAQ管理</a>
            <a href="/admin/categories" className="block px-4 py-2 rounded hover:bg-gray-100">🏷️ カテゴリ管理</a>
            <a href="#" className="block px-4 py-2 rounded hover:bg-gray-100">⚙️ 設定</a>
          </>
        )}
      </nav>
    </aside>
  );
};
