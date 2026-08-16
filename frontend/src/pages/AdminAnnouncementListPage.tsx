import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { AnnouncementDto } from '../types';
import api from '../services/api';

/**
 * 管理者用お知らせ管理ページ
 * 全お知らせをテーブル形式で表示し、編集・削除が可能
 */
export const AdminAnnouncementListPage: React.FC = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<AnnouncementDto[]>([]);
  const [filter, setFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    loadAnnouncements();
  }, [filter]);

  // すべてのお知らせを読み込む
  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await api.getAnnouncements();
      setAnnouncements(data);
    } catch (err: any) {
      setError('お知らせの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // お知らせを削除
  const handleDelete = async (id: number) => {
    if (!window.confirm('削除してもよろしいですか？')) return;

    try {
      setDeleting(id);
      await api.deleteAnnouncement(id);
      // 削除後、リストから該当項目を除去
      setAnnouncements(announcements.filter((a) => a.id !== id));
    } catch (err: any) {
      setError('削除に失敗しました');
    } finally {
      setDeleting(null);
    }
  };

  // ステータスでフィルタリング
  const filteredAnnouncements = announcements.filter((a) => {
    if (filter === 'DRAFT') return a.status === 'DRAFT';
    if (filter === 'PUBLISHED') return a.status === 'PUBLISHED';
    return true; // ALL の場合はすべてを表示
  });

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex items-center justify-center flex-1">
            <div className="text-xl">読み込み中...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl">
            {/* ページタイトルと新規作成ボタン */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">📋 お知らせ管理</h1>
              <button
                onClick={() => navigate('/admin/announcements/create')}
                className="px-6 py-2 bg-primary text-white rounded hover:bg-blue-700 font-medium"
              >
                + 新規作成
              </button>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
                {error}
              </div>
            )}

            {/* ステータスフィルタボタン */}
            <div className="mb-6 flex gap-2">
              <button
                onClick={() => setFilter('ALL')}
                className={`px-4 py-2 rounded ${
                  filter === 'ALL'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                すべて
              </button>
              <button
                onClick={() => setFilter('DRAFT')}
                className={`px-4 py-2 rounded ${
                  filter === 'DRAFT'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                下書き
              </button>
              <button
                onClick={() => setFilter('PUBLISHED')}
                className={`px-4 py-2 rounded ${
                  filter === 'PUBLISHED'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                公開
              </button>
            </div>

            {/* お知らせテーブル */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">タイトル</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">カテゴリ</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">ステータス</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">作成日時</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">既読数</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">アクション</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAnnouncements.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-600">
                        お知らせがありません
                      </td>
                    </tr>
                  ) : (
                    filteredAnnouncements.map((announcement) => (
                      <tr key={announcement.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {announcement.title}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {announcement.categoryName}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded text-xs font-medium ${
                              announcement.status === 'PUBLISHED'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {announcement.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {announcement.createdAt
                            ? new Date(announcement.createdAt).toLocaleDateString('ja-JP')
                            : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {announcement.readCount}
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          {/* 編集ボタン */}
                          <button
                            onClick={() => navigate(`/admin/announcements/${announcement.id}/edit`)}
                            className="text-primary hover:underline"
                          >
                            編集
                          </button>
                          {/* 削除ボタン */}
                          <button
                            onClick={() => handleDelete(announcement.id || 0)}
                            disabled={deleting === announcement.id}
                            className="text-danger hover:underline disabled:text-gray-400"
                          >
                            {deleting === announcement.id ? '削除中...' : '削除'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
