import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { AnnouncementDto, CategoryDto } from '../types';
import api from '../services/api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

/**
 * 管理者用お知らせ作成・編集ページ
 * React Quill でリッチなテキスト編集が可能
 * 画像アップロード機能付き
 */
export const AdminAnnouncementPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState<AnnouncementDto>({
    title: '',
    content: '',
    categoryId: 0,
    status: 'DRAFT',
    isImportant: false,
  });
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(id ? true : false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadCategories();
    if (id) {
      loadAnnouncement();
    }
  }, [id]);

  // カテゴリを読み込む
  const loadCategories = async () => {
    try {
      const cats = await api.getCategories('ANNOUNCEMENT');
      setCategories(cats);
      // 最初のカテゴリをデフォルト選択
      if (cats.length > 0 && !announcement.categoryId) {
        setAnnouncement({ ...announcement, categoryId: cats[0].id || 0 });
      }
    } catch (err) {
      setError('カテゴリの読み込みに失敗しました');
    }
  };

  // 編集時：既存のお知らせを読み込む
  const loadAnnouncement = async () => {
    try {
      setLoading(true);
      const data = await api.getAnnouncementDetail(Number(id));
      setAnnouncement(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'お知らせの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // 画像をアップロード
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const result = await api.uploadImage(file);
      // アップロードした画像の URL を本文に設定
      setAnnouncement({ ...announcement, imageUrl: result.url });
    } catch (err: any) {
      setError('画像のアップロードに失敗しました');
    } finally {
      setUploading(false);
    }
  };

  // お知らせを保存
  const handleSave = async () => {
    // 必須項目チェック
    if (!announcement.title || !announcement.content || !announcement.categoryId) {
      setError('すべての必須項目を入力してください');
      return;
    }

    try {
      setSaving(true);
      setError('');
      if (id) {
        // 更新の場合
        await api.updateAnnouncement(Number(id), announcement);
      } else {
        // 新規作成の場合
        await api.createAnnouncement(announcement);
      }
      // お知らせ管理ページに戻る
      navigate('/admin/announcements');
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
                {id ? 'お知らせ編集' : '新規お知らせ作成'}
              </h1>
              <button
                onClick={() => navigate('/admin/announcements')}
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
              {/* タイトル入力欄 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  タイトル
                </label>
                <input
                  type="text"
                  value={announcement.title}
                  onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="お知らせのタイトルを入力"
                />
              </div>

              {/* カテゴリ選択 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  カテゴリ
                </label>
                <select
                  value={announcement.categoryId}
                  onChange={(e) => setAnnouncement({ ...announcement, categoryId: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 画像アップロード */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  画像
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {uploading ? 'アップロード中...' : '画像をアップロード'}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {announcement.imageUrl && (
                    <div className="flex items-center gap-2">
                      <img src={announcement.imageUrl} alt="preview" className="h-12 w-12 object-cover rounded" />
                      <button
                        onClick={() => setAnnouncement({ ...announcement, imageUrl: undefined })}
                        className="text-danger hover:underline"
                      >
                        削除
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* リッチテキストエディタ（React Quill） */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  本文
                </label>
                <ReactQuill
                  theme="snow"
                  value={announcement.content}
                  onChange={(content) => setAnnouncement({ ...announcement, content })}
                  style={{ height: '300px', marginBottom: '40px' }}
                />
              </div>

              {/* オプション（重要フラグ） */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={announcement.isImportant || false}
                      onChange={(e) => setAnnouncement({ ...announcement, isImportant: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="ml-2 text-sm text-gray-700">重要なお知らせとしてマーク</span>
                  </label>
                </div>
              </div>

              {/* ステータス選択 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ステータス
                </label>
                <select
                  value={announcement.status}
                  onChange={(e) => setAnnouncement({ ...announcement, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="DRAFT">下書き</option>
                  <option value="PUBLISHED">公開</option>
                  <option value="ARCHIVED">アーカイブ</option>
                </select>
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
                  onClick={() => navigate('/admin/announcements')}
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
