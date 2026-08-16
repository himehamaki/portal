import axios from 'axios';
import { AnnouncementDto, CategoryDto } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

/**
 * API クライアント
 * バックエンドとの通信を担当
 */
class ApiClient {
  private client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  constructor() {
    // リクエストインターセプター: JWT トークンを自動付与
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // レスポンスインターセプター: 401 エラーでログイン画面へ
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // ========== 認証 ==========
  async login(userCode: string, password: string) {
    const response = await this.client.post('/auth/login', { userCode, password });
    return response.data;
  }

  async logout() {
    await this.client.post('/auth/logout');
  }

  // ========== ユーザー ==========
  async getCurrentUser() {
    const response = await this.client.get('/users/me');
    return response.data;
  }

  // ========== お知らせ ==========
  /** 公開中のお知らせ一覧を取得 */
  async getAnnouncements() {
    const response = await this.client.get<AnnouncementDto[]>('/announcements');
    return response.data;
  }

  /** カテゴリ別のお知らせを取得 */
  async getAnnouncementsByCategory(categoryId: number) {
    const response = await this.client.get<AnnouncementDto[]>(`/announcements/category/${categoryId}`);
    return response.data;
  }

  /** お知らせ詳細を取得 */
  async getAnnouncementDetail(id: number) {
    const response = await this.client.get<AnnouncementDto>(`/announcements/${id}`);
    return response.data;
  }

  /** お知らせを新規作成 */
  async createAnnouncement(dto: AnnouncementDto) {
    const response = await this.client.post<AnnouncementDto>('/announcements', dto);
    return response.data;
  }

  /** お知らせを更新 */
  async updateAnnouncement(id: number, dto: AnnouncementDto) {
    const response = await this.client.put<AnnouncementDto>(`/announcements/${id}`, dto);
    return response.data;
  }

  /** お知らせを削除 */
  async deleteAnnouncement(id: number) {
    await this.client.delete(`/announcements/${id}`);
  }

  /** お知らせを既読にマーク */
  async markAnnouncementAsRead(id: number) {
    await this.client.post(`/announcements/${id}/mark-read`);
  }

  // ========== カテゴリ ==========
  /** 指定タイプのカテゴリ一覧を取得 */
  async getCategories(type: string) {
    const response = await this.client.get<CategoryDto[]>('/categories', { params: { type } });
    return response.data;
  }

  /** 表示可能なカテゴリを取得 */
  async getVisibleCategories(type: string) {
    const response = await this.client.get<CategoryDto[]>('/categories/visible', { params: { type } });
    return response.data;
  }

  /** カテゴリ詳細を取得 */
  async getCategoryDetail(id: number) {
    const response = await this.client.get<CategoryDto>(`/categories/${id}`);
    return response.data;
  }

  /** カテゴリを新規作成 */
  async createCategory(dto: CategoryDto) {
    const response = await this.client.post<CategoryDto>('/categories', dto);
    return response.data;
  }

  /** カテゴリを更新 */
  async updateCategory(id: number, dto: CategoryDto) {
    const response = await this.client.put<CategoryDto>(`/categories/${id}`, dto);
    return response.data;
  }

  /** カテゴリを削除 */
  async deleteCategory(id: number) {
    await this.client.delete(`/categories/${id}`);
  }

  // ========== ファイルアップロード ==========
  /** 画像をアップロード */
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_BASE_URL}/uploads/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  }
}

export default new ApiClient();
