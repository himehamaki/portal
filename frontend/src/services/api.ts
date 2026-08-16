import axios, { AxiosInstance } from 'axios';
import { LoginRequest, LoginResponse, UserDto } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests if available
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle response errors
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

  async login(userCode: string, password: string): Promise<LoginResponse> {
    const response = await this.client.post<LoginResponse>('/auth/login', {
      userCode,
      password,
    });
    return response.data;
  }

  async logout(): Promise<void> {
    await this.client.post('/auth/logout');
  }

  async getCurrentUser(): Promise<UserDto> {
    const response = await this.client.get<UserDto>('/users/me');
    return response.data;
  }

  async getAllUsers(): Promise<UserDto[]> {
    const response = await this.client.get<UserDto[]>('/users');
    return response.data;
  }

  async getUserById(id: number): Promise<UserDto> {
    const response = await this.client.get<UserDto>(`/users/${id}`);
    return response.data;
  }
}

export default new ApiClient();
