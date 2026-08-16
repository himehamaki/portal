import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { AnnouncementDto } from '../types';
import api from '../services/api';

/**
 * お知らせ詳細ページ
 * 選択したお知らせの全文を表示
 */
export const AnnouncementDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState<AnnouncementDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadAnnouncement();
    }
  }, [id]);

  // お知らせを読み込んで既読マーク
  const loadAnnouncement = async () => {
    try {
      setLoading(true);
      const data = await api.getAnnouncementDetail(Number(id));
      setAnnouncement(data);
      // 詳細ページを表示した時点で既読扱いにする
      await api.markAnnouncementAsRead(Number(id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'お知らせの読み込みに失敗しました');
    } finally {
      setLoading(false);
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

  if (error || !announcement) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 p-6">
            <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700">
              {error || 'お知らせが見つかりません'}
            </div>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-blue-700"
            >
              ← 戻る
            </button>
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
            <button
              onClick={() => navigate('/announcements')}
              className="text-primary hover:underline mb-4"
            >
              ← 戻る
            </button>

            <div className="bg-white rounded-lg shadow p-8">
              {/* カテゴリと重要度バッジ */}
              <div className="mb-4">
                <span className="text-sm bg-blue-100 text-primary px-3 py-1 rounded">
                  {announcement.categoryName}
                </span>
                {announcement.isImportant && (
                  <span className="ml-2 text-sm bg-red-100 text-red-700 px-3 py-1 rounded">
                    ⭐ 重要
                  </span>
                )}
              </div>

              {/* タイトル */}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{announcement.title}</h1>

              {/* メタ情報 */}
              <div className="flex items-center text-gray-600 text-sm mb-6 border-b pb-4">
                <span>作成者: {announcement.authorName}</span>
                <span className="mx-2">|</span>
                <span>
                  {announcement.publishedAt
                    ? new Date(announcement.publishedAt).toLocaleDateString('ja-JP')
                    : '下書き'}
                </span>
                <span className="mx-2">|</span>
                <span>既読数: {announcement.readCount}</span>
              </div>

              {/* 画像 */}
              {announcement.imageUrl && (
                <div className="mb-6">
                  <img
                    src={announcement.imageUrl}
                    alt="announcement"
                    className="max-w-full h-auto rounded-lg"
                  />
                </div>
              )}

              {/* HTML 形式の本文を表示 */}
              <div
                className="prose max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: announcement.content }}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
