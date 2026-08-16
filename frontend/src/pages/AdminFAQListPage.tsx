import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { FAQDto } from '../types';
import api from '../services/api';

/**
 * 管理者向け FAQ 管理ページ
 * すべてのFAQをテーブル形式で表示し、編集・削除が可能
 */
export const AdminFAQListPage: React.FC = () => {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState<FAQDto[]>([]);
  const [filter, setFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    loadFAQs();
  }, [filter]);

  /**
   * すべてのFAQを読み込む
   */
  const loadFAQs = async () => {
    try {
      setLoading(true);
      const data = await api.getAllFAQsAdmin();
      setFaqs(data);
    } catch (err: any) {
      setError('FAQの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  /**
   * FAQを削除
   */
  const handleDelete = async (id: number) => {
    if (!window.confirm('削除してもよろしいですか？')) return;

    try {
      setDeleting(id);
      await api.deleteFAQ(id);
      // 削除後、リストから該当項目を除外
      setFaqs(faqs.filter((f) => f.id !== id));
    } catch (err: any) {
      setError('削除に失敗しました');
    } finally {
      setDeleting(null);
    }
  };

  /**
   * 表示フラグでフィルタリング
   */
  const filteredFAQs = faqs.filter((f) => {
    if (filter === 'VISIBLE') return f.isVisible;
    if (filter === 'HIDDEN') return !f.isVisible;
    return true; // ALL
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
              <h1 className="text-3xl font-bold text-gray-900">❓ FAQ管理</h1>
              <button
                onClick={() => navigate('/admin/faqs/create')}
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

            {/* フィルタボタン */}
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
                onClick={() => setFilter('VISIBLE')}
                className={`px-4 py-2 rounded ${
                  filter === 'VISIBLE'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                表示中
              </button>
              <button
                onClick={() => setFilter('HIDDEN')}
                className={`px-4 py-2 rounded ${
                  filter === 'HIDDEN'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                非表示
              </button>
            </div>

            {/* FAQ テーブル */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      質問
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      カテゴリ
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      表示
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      順序
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      アクション
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFAQs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-600">
                        FAQがありません
                      </td>
                    </tr>
                  ) : (
                    filteredFAQs.map((faq) => (
                      <tr key={faq.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">
                          {faq.question}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {faq.categoryName}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {faq.isVisible ? (
                            <span className="text-green-600">✓ 表示</span>
                          ) : (
                            <span className="text-red-600">✕ 非表示</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {faq.displayOrder}
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          {/* 編集ボタン */}
                          <button
                            onClick={() => navigate(`/admin/faqs/${faq.id}/edit`)}
                            className="text-primary hover:underline"
                          >
                            編集
                          </button>
                          {/* 削除ボタン */}
                          <button
                            onClick={() => handleDelete(faq.id || 0)}
                            disabled={deleting === faq.id}
                            className="text-danger hover:underline disabled:text-gray-400"
                          >
                            {deleting === faq.id ? '削除中...' : '削除'}
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
