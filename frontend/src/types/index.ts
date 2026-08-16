export interface LoginRequest {
  userCode: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  name: string;
  email: string;
  userCode: string;
}

export interface UserDto {
  id: number;
  userCode: string;
  name: string;
  email: string;
  departmentId?: number;
  isActive: boolean;
  roles: string[];
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: UserDto | null;
  token: string | null;
  login: (userCode: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface AnnouncementDto {
  id?: number;
  title: string;
  content: string;
  categoryId: number;
  categoryName?: string;
  authorId?: number;
  authorName?: string;
  imageUrl?: string;
  status?: string; // DRAFT, PUBLISHED, ARCHIVED
  isImportant?: boolean;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  isRead?: boolean;
  readCount?: number;
}

export interface CategoryDto {
  id?: number;
  type: string; // ANNOUNCEMENT, QA, SURVEY, FAQ
  name: string;
  displayOrder?: number;
  isVisible?: boolean;
}

/**
 * FAQ DTO
 */
export interface FAQDto {
  id?: number;
  question: string;
  answer: string;
  categoryId: number;
  categoryName?: string;
  displayOrder?: number;
  isVisible?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
