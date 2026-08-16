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
