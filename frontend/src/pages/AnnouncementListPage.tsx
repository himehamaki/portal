import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { AnnouncementDto, CategoryDto } from '../types';
import api from '../services/api';

/**
 * お知らせ一覧ページ
 * 公開中のお知らせをカテゴリ別に表示
 */
export const AnnouncementListPage: React.FC = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<AnnouncementDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  // カテゴリ変更時にお知らせを再読み込み
  useEffect(() => {
    if (selectedCategory) {
      loadAnnouncementsByCategory();
    } else {
      loadAnnouncements();
    }
  }, [selectedCategory]);

  // 初期データ（カテゴリとお知らせ一覧）を読み込む
  const loadData = async () => {
    try {
      setLoading(true);
      // 表示可能なカテゴリを取得
      const cats = await api.getVisibleCategories('ANNOUNCEMENT');
      setCategories(cats);
      // すべてのお知らせを取得
      const annoucements = await api.getAnnouncements();
      setAnnouncements(annoucements);
    } catch (err: any) {
      setError('お知らせの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // すべてのお知らせを取得
  const loadAnnouncements = async () => {
    try {
      const data = await api.getAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      setError('お知らせの読み込みに失敗しました');
    }
  };

  // カテゴリ別にお知らせを取得
  const loadAnnouncementsByCategory = async () => {
    if (!selectedCategory) return;
    try {
      const data = await api.getAnnouncementsByCategory(selectedCategory);
      setAnnouncements(data);
    } catch (err) {
      setError('お知らせの読み込みに失敗しました');
    }
  };

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
          <div className="max-w-4xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">📰 お知らせ</h1>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
                {error}
              </div>
            )}

            {/* カテゴリタブ */}
            <div className="mb-6 border-b border-gray-200">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 font-medium ${
                  selectedCategory === null
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                すべて
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id || null)}
                  className={`px-4 py-2 font-medium ${
                    selectedCategory === cat.id
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* お知らせリスト */}
            <div className="space-y-4">
              {announcements.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  お知らせがありません
                </div>
              ) : (
                announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    onClick={() => navigate(`/announcements/${announcement.id}`)}
                    className="bg-white rounded-lg shadow p-4 hover:shadow-lg cursor-pointer transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* バッジエリア */}
                        <div className="flex items-center gap-2 mb-2">
                          {announcement.isImportant && (
                            <span className="text-red-500 font-bold">⭐</span>
                          )}
                          <span className="text-xs bg-blue-100 text-primary px-2 py-1 rounded">
                            {announcement.categoryName}
                          </span>
                          {announcement.isRead && (
                            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                              既読
                            </span>
                          )}
                        </div>
                        {/* タイトル */}
                        <h3 className="text-lg font-bold text-gray-900">
                          {announcement.title}
                        </h3>
                        {/* プレビュー（HTML タグを除去） */}
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                          {announcement.content.replace(/<[^>]*>/g, '')}
                        </p>
                        {/* 投稿日と既読数 */}
                        <div className="text-xs text-gray-500 mt-2">
                          {announcement.publishedAt
                            ? new Date(announcement.publishedAt).toLocaleDateString('ja-JP')
                            : '下書き'}
                          {' | '}
                          既読数: {announcement.readCount}
                        </div>
                      </div>
                      {/* サムネイル画像 */}
                      {announcement.imageUrl && (
                        <img
                          src={announcement.imageUrl}
                          alt="announcement"
                          className="w-24 h-24 object-cover rounded ml-4"
                        />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
