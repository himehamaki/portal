import React from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl">
            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                ようこそ、{user?.name}さん
              </h2>
              <p className="text-gray-600">
                今日の日付: {new Date().toLocaleDateString('ja-JP')}
              </p>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-3 gap-6">
              {/* Main Content - 2/3 width */}
              <div className="col-span-2 space-y-6">
                {/* Announcements Section */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">📰 新着お知らせ</h3>
                  <div className="space-y-3">
                    <div className="p-4 border-l-4 border-primary bg-blue-50">
                      <p className="font-medium text-gray-900">お知らせが表示されます</p>
                      <p className="text-sm text-gray-600 mt-1">Phase 2 で機能を実装予定</p>
                    </div>
                  </div>
                  <a href="#" className="mt-4 inline-block text-primary font-medium hover:underline">
                    すべてを見る ＞
                  </a>
                </div>

                {/* Q&A Section */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">❓ 新着 Q&A</h3>
                  <div className="space-y-3">
                    <div className="p-4 border-l-4 border-yellow-400 bg-yellow-50">
                      <p className="font-medium text-gray-900">Q&A が表示されます</p>
                      <p className="text-sm text-gray-600 mt-1">Phase 2 で機能を実装予定</p>
                    </div>
                  </div>
                  <a href="#" className="mt-4 inline-block text-primary font-medium hover:underline">
                    すべてを見る ＞
                  </a>
                </div>
              </div>

              {/* Sidebar - 1/3 width */}
              <div className="space-y-6">
                {/* Quick Links */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">🔗 クイックリンク</h3>
                  <div className="space-y-2">
                    <a href="#" className="block px-3 py-2 rounded bg-gray-50 hover:bg-gray-100 text-sm">
                      📘 社内規定
                    </a>
                    <a href="#" className="block px-3 py-2 rounded bg-gray-50 hover:bg-gray-100 text-sm">
                      💼 経費精算
                    </a>
                    <a href="#" className="block px-3 py-2 rounded bg-gray-50 hover:bg-gray-100 text-sm">
                      🕐 勤怠打刻
                    </a>
                  </div>
                </div>

                {/* Events Calendar */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">📅 イベント</h3>
                  <div className="text-sm text-gray-600">
                    <p>イベント情報は</p>
                    <p>Phase 2 で実装予定</p>
                  </div>
                </div>

                {/* Surveys */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">📊 アンケート</h3>
                  <div className="text-sm text-gray-600">
                    <p>回答募集中のアンケートは</p>
                    <p>Phase 2 で実装予定</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
