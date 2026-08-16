import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { FAQDto, CategoryDto } from '../types';
import api from '../services/api';

/**
 * FAQ一覧ページ（ユーザー向け）
 * 管理者が作成したFAQを参照するページ
 * カテゴリ別でフィルタリング可能
 */
export const FAQListPage: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  // カテゴリ変更時にFAQを再読み込み
  useEffect(() => {
    if (selectedCategory) {
      loadFAQsByCategory();
    } else {
      loadAllFAQs();
    }
  }, [selectedCategory]);

  /**
   * 初期データ（カテゴリと全FAQ）を読み込む
   */
  const loadData = async () => {
    try {
      setLoading(true);
      // FAQ用カテゴリを取得
      const cats = await api.getVisibleCategories('FAQ');
      setCategories(cats);
      // すべてのFAQを取得
      const allFaqs = await api.getAllFAQs();
      setFaqs(allFaqs);
    } catch (err: any) {
      setError('FAQの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  /**
   * すべてのFAQを取得
   */
  const loadAllFAQs = async () => {
    try {
      const data = await api.getAllFAQs();
      setFaqs(data);
    } catch (err) {
      setError('FAQの読み込みに失敗しました');
    }
  };

  /**
   * カテゴリ別にFAQを取得
   */
  const loadFAQsByCategory = async () => {
    if (!selectedCategory) return;
    try {
      const data = await api.getFAQsByCategory(selectedCategory);
      setFaqs(data);
    } catch (err) {
      setError('FAQの読み込みに失敗しました');
    }
  };

  /**
   * FAQ テキストで検索（フロントエンド側）
   */
  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1 className="text-3xl font-bold text-gray-900 mb-6">❓ よくある質問（FAQ）</h1>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
                {error}
              </div>
            )}

            {/* 検索バー */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="FAQを検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

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

            {/* FAQ アコーディオンリスト */}
            <div className="space-y-2">
              {filteredFAQs.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  FAQが見つかりません
                </div>
              ) : (
                filteredFAQs.map((faq) => (
                  <div key={faq.id} className="bg-white rounded-lg shadow">
                    {/* FAQタイトル（クリックで展開） */}
                    <button
                      onClick={() =>
                        setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)
                      }
                      className="w-full px-6 py-4 text-left hover:bg-gray-50 transition flex items-center justify-between"
                    >
                      <span className="font-medium text-gray-900">
                        Q. {faq.question}
                      </span>
                      <span
                        className={`text-gray-600 transition-transform ${
                          expandedFAQ === faq.id ? 'rotate-180' : ''
                        }`}
                      >
                        ▼
                      </span>
                    </button>

                    {/* FAQ 回答（展開時） */}
                    {expandedFAQ === faq.id && (
                      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <div className="text-sm text-gray-700 mb-2">A.</div>
                        <div
                          className="text-gray-700 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: faq.answer }}
                        />
                      </div>
                    )}
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
