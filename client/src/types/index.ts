export interface User {
  id: string;
  email: string;
  username?: string;
  name?: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
  };
}

export interface AuthResponse {
  success: boolean;
  data?: {
    accessToken: string;
    id?: string;
    email?: string;
    role?: string;
  };
  message?: string;
}

export interface NotesResponse {
  success: boolean;
  data?: Note[];
  message?: string;
}

export interface NoteResponse {
  success: boolean;
  data?: Note;
  message?: string;
}

export interface AdminStats {
  totalUsers: number;
  totalNotes: number;
  recentNotes: {
    id: string;
    title: string;
    userId: string;
    createdAt: string;
  }[];
}

export interface UserResponse {
  success: boolean;
  data?: User;
  message?: string;
}

export interface ApiError {
  success: boolean;
  message: string;
}