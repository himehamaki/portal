import React from 'react';

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="p-6 space-y-2">
        <a href="/" className="block px-4 py-2 rounded hover:bg-gray-100">📊 ダッシュボード</a>
        <a href="#" className="block px-4 py-2 rounded hover:bg-gray-100">📰 お知らせ</a>
        <a href="#" className="block px-4 py-2 rounded hover:bg-gray-100">❓ Q&A</a>
        <a href="#" className="block px-4 py-2 rounded hover:bg-gray-100">📋 アンケート</a>
        <a href="#" className="block px-4 py-2 rounded hover:bg-gray-100">👥 社員名鑑</a>
        <hr className="my-4" />
        <a href="#" className="block px-4 py-2 rounded hover:bg-gray-100">⚙️ 管理画面</a>
      </nav>
    </aside>
  );
};
