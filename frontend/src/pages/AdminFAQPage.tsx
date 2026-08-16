import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { FAQDto, CategoryDto } from '../types';
import api from '../services/api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

/**
 * 管理者向け FAQ 作成・編集ページ
 * React Quill を使用してリッチテキスト編集が可能
 */
export const AdminFAQPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [faq, setFaq] = useState<FAQDto>({
    question: '',
    answer: '',
    categoryId: 0,
    displayOrder: 0,
    isVisible: true,
  });
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(id ? true : false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategories();
    if (id) {
      loadFAQ();
    }
  }, [id]);

  /**
   * FAQ用カテゴリを読み込む
   */
  const loadCategories = async () => {
    try {
      const cats = await api.getCategories('FAQ');
      setCategories(cats);
      // 最初のカテゴリをデフォルト選択
      if (cats.length > 0 && !faq.categoryId) {
        setFaq({ ...faq, categoryId: cats[0].id || 0 });
      }
    } catch (err) {
      setError('カテゴリの読み込みに失敗しました');
    }
  };

  /**
   * 編集時：既存のFAQを読み込む
   */
  const loadFAQ = async () => {
    try {
      setLoading(true);
      const data = await api.getFAQDetail(Number(id));
      setFaq(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'FAQの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  /**
   * FAQを保存（新規作成または更新）
   */
  const handleSave = async () => {
    // 必須項目チェック
    if (!faq.question || !faq.answer || !faq.categoryId) {
      setError('すべての必須項目を入力してください');
      return;
    }

    try {
      setSaving(true);
      setError('');
      if (id) {
        // 更新の場合
        await api.updateFAQ(Number(id), faq);
      } else {
        // 新規作成の場合
        await api.createFAQ(faq);
      }
      // FAQ管理ページに戻る
      navigate('/admin/faqs');
    } catch (err: any) {
      setError(err.response?.data?.message || '保存に失敗しました');
    } finally {
      setSaving(false);
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
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                {id ? 'FAQ編集' : '新規FAQ作成'}
              </h1>
              <button
                onClick={() => navigate('/admin/faqs')}
                className="text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
                {error}
              </div>
            )}

            <div className="bg-white rounded-lg shadow p-6 space-y-6">
              {/* 質問入力 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  質問
                </label>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => setFaq({ ...faq, question: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="FAQの質問を入力"
                />
              </div>

              {/* カテゴリ選択 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  カテゴリ
                </label>
                <select
                  value={faq.categoryId}
                  onChange={(e) => setFaq({ ...faq, categoryId: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 回答エディタ（React Quill） */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  回答
                </label>
                <ReactQuill
                  theme="snow"
                  value={faq.answer}
                  onChange={(content) => setFaq({ ...faq, answer: content })}
                  style={{ height: '300px', marginBottom: '40px' }}
                />
              </div>

              {/* 表示順序 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  表示順序
                </label>
                <input
                  type="number"
                  value={faq.displayOrder}
                  onChange={(e) => setFaq({ ...faq, displayOrder: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* 表示・非表示 */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={faq.isVisible}
                    onChange={(e) => setFaq({ ...faq, isVisible: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="ml-2 text-sm text-gray-700">表示する</span>
                </label>
              </div>

              {/* 保存・キャンセルボタン */}
              <div className="flex gap-4 pt-6 border-t">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2 bg-primary text-white rounded hover:bg-blue-700 disabled:bg-gray-400 font-medium"
                >
                  {saving ? '保存中...' : '保存'}
                </button>
                <button
                  onClick={() => navigate('/admin/faqs')}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 font-medium"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
