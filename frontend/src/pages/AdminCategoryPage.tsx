import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { CategoryDto } from '../types';
import api from '../services/api';

/**
 * 管理者用カテゴリ管理ページ
 * お知らせのカテゴリを作成・編集・削除できる
 */
export const AdminCategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CategoryDto>({
    type: 'ANNOUNCEMENT',
    name: '',
    displayOrder: 0,
    isVisible: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  // カテゴリを読み込む
  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await api.getCategories('ANNOUNCEMENT');
      setCategories(data);
    } catch (err: any) {
      setError('カテゴリの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // カテゴリを保存（新規作成または更新）
  const handleSave = async () => {
    if (!formData.name) {
      setError('カテゴリ名を入力してください');
      return;
    }

    try {
      setSaving(true);
      setError('');
      if (editingId) {
        // 更新の場合
        await api.updateCategory(editingId, formData);
      } else {
        // 新規作成の場合
        await api.createCategory(formData);
      }
      // フォームをリセットしてリスト再読み込み
      resetForm();
      loadCategories();
    } catch (err: any) {
      setError(err.response?.data?.message || '保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  // カテゴリを削除
  const handleDelete = async (id: number) => {
    if (!window.confirm('削除してもよろしいですか？')) return;

    try {
      await api.deleteCategory(id);
      loadCategories();
    } catch (err: any) {
      setError('削除に失敗しました');
    }
  };

  // 編集用にフォームを設定
  const handleEdit = (category: CategoryDto) => {
    setEditingId(category.id || null);
    setFormData(category);
  };

  // フォームをリセット
  const resetForm = () => {
    setEditingId(null);
    setFormData({
      type: 'ANNOUNCEMENT',
      name: '',
      displayOrder: 0,
      isVisible: true,
    });
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
            <h1 className="text-3xl font-bold text-gray-900 mb-6">🏷️ カテゴリ管理</h1>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
                {error}
              </div>
            )}

            {/* カテゴリ作成・編集フォーム */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editingId ? 'カテゴリを編集' : '新規カテゴリ'}
              </h2>
              <div className="space-y-4">
                {/* カテゴリ名入力欄 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    カテゴリ名
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="カテゴリ名を入力"
                  />
                </div>

                {/* 表示順序と表示フラグ */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      表示順序
                    </label>
                    <input
                      type="number"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="flex items-center mt-6">
                      <input
                        type="checkbox"
                        checked={formData.isVisible}
                        onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="ml-2 text-sm text-gray-700">表示する</span>
                    </label>
                  </div>
                </div>

                {/* 保存・キャンセルボタン */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 bg-primary text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {saving ? '保存中...' : '保存'}
                  </button>
                  {editingId && (
                    <button
                      onClick={resetForm}
                      className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                      キャンセル
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* カテゴリ一覧テーブル */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      カテゴリ名
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      表示順序
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      表示
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      アクション
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-600">
                        カテゴリがありません
                      </td>
                    </tr>
                  ) : (
                    categories.map((category) => (
                      <tr key={category.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {category.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {category.displayOrder}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {category.isVisible ? (
                            <span className="text-green-600">✓ 表示</span>
                          ) : (
                            <span className="text-red-600">✕ 非表示</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          {/* 編集ボタン */}
                          <button
                            onClick={() => handleEdit(category)}
                            className="text-primary hover:underline"
                          >
                            編集
                          </button>
                          {/* 削除ボタン */}
                          <button
                            onClick={() => handleDelete(category.id || 0)}
                            className="text-danger hover:underline"
                          >
                            削除
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
