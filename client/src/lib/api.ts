import axios, { AxiosInstance } from 'axios';
import { AuthResponse, NotesResponse, NoteResponse, UserResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

function encodeUserToken(user: { id: string; email: string; name: string; username?: string; role?: string }): string {
  const tokenData = JSON.stringify({
    id: user.id,
    email: user.email,
    name: user.name,
    username: user.username,
    role: user.role,
  });
  return Buffer.from(tokenData).toString('base64');
}

let globalUser: { id: string; email: string; name: string; username?: string; role?: string } | null = null;

export function setSessionUser(user: { id: string; email: string; name: string; username?: string; role?: string } | null) {
  globalUser = user;
}

export function getSessionUser() {
  return globalUser;
}

const createApiClient = (user?: { id: string; email: string; name: string; username?: string; role?: string } | null): AxiosInstance => {
  const activeUser = user || globalUser;
  
  const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  api.interceptors.request.use((config) => {
    if (activeUser && config.headers) {
      config.headers.Authorization = `Bearer ${encodeUserToken(activeUser)}`;
    }
    return config;
  });

  return api;
};

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await createApiClient().post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (email: string, password: string, username: string): Promise<AuthResponse> => {
    const response = await createApiClient().post('/auth/register', { email, password, username });
    return response.data;
  },
  
  logout: async (): Promise<void> => {
    setSessionUser(null);
    await createApiClient().post('/auth/logout');
  },
};

export const notesApi = {
  getAll: async (user?: { id: string; email: string; name: string; username?: string; role?: string } | null): Promise<NotesResponse> => {
    const response = await createApiClient(user).get('/notes');
    return response.data;
  },
  
  getById: async (id: string, user?: { id: string; email: string; name: string; username?: string; role?: string } | null): Promise<NoteResponse> => {
    const response = await createApiClient(user).get(`/notes/${id}`);
    return response.data;
  },
  
  create: async (data: { title: string; content: string }, user?: { id: string; email: string; name: string; username?: string; role?: string } | null): Promise<NoteResponse> => {
    const response = await createApiClient(user).post('/notes', data);
    return response.data;
  },
  
  update: async (id: string, data: { title?: string; content?: string }, user?: { id: string; email: string; name: string; username?: string; role?: string } | null): Promise<NoteResponse> => {
    const response = await createApiClient(user).put(`/notes/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string, user?: { id: string; email: string; name: string; username?: string; role?: string } | null): Promise<{ success: boolean }> => {
    const response = await createApiClient(user).delete(`/notes/${id}`);
    return response.data;
  },
};

export const adminApi = {
  getUsers: async (user?: { id: string; email: string; name: string; username?: string; role?: string } | null): Promise<{ success: boolean; data?: any[] }> => {
    const response = await createApiClient(user).get('/admin/users');
    return response.data;
  },
  
  getUserById: async (id: string, user?: { id: string; email: string; name: string; username?: string; role?: string } | null): Promise<{ success: boolean; data?: any }> => {
    const response = await createApiClient(user).get(`/admin/users/${id}`);
    return response.data;
  },
  
  deleteUser: async (id: string, user?: { id: string; email: string; name: string; username?: string; role?: string } | null): Promise<{ success: boolean }> => {
    const response = await createApiClient(user).delete(`/admin/users/${id}`);
    return response.data;
  },
  
  getAllNotes: async (user?: { id: string; email: string; name: string; username?: string; role?: string } | null): Promise<NotesResponse> => {
    const response = await createApiClient(user).get('/admin/notes');
    return response.data;
  },
  
  getNoteById: async (id: string, user?: { id: string; email: string; name: string; username?: string; role?: string } | null): Promise<NoteResponse> => {
    const response = await createApiClient(user).get(`/admin/notes/${id}`);
    return response.data;
  },
  
  updateNote: async (id: string, data: { title?: string; content?: string }, user?: { id: string; email: string; name: string; username?: string; role?: string } | null): Promise<NoteResponse> => {
    const response = await createApiClient(user).put(`/admin/notes/${id}`, data);
    return response.data;
  },
  
  deleteNote: async (id: string, user?: { id: string; email: string; name: string; username?: string; role?: string } | null): Promise<{ success: boolean }> => {
    const response = await createApiClient(user).delete(`/admin/notes/${id}`);
    return response.data;
  },
  
  getStats: async (user?: { id: string; email: string; name: string; username?: string; role?: string } | null): Promise<{ success: boolean; data?: any }> => {
    const response = await createApiClient(user).get('/admin/stats');
    return response.data;
  },
};

export const settingsApi = {
  updateUsername: async (username: string, user?: { id: string; email: string; name: string; username?: string; role?: string } | null): Promise<UserResponse> => {
    const response = await createApiClient(user).put('/auth/settings/username', { username });
    return response.data;
  },

  updateEmail: async (email: string, user?: { id: string; email: string; name: string; username?: string; role?: string } | null): Promise<UserResponse> => {
    const response = await createApiClient(user).put('/auth/settings/email', { email });
    return response.data;
  },

  updatePassword: async (currentPassword: string, newPassword: string, user?: { id: string; email: string; name: string; username?: string; role?: string } | null): Promise<{ success: boolean; message?: string }> => {
    const response = await createApiClient(user).put('/auth/settings/password', { currentPassword, newPassword });
    return response.data;
  },
};

export default createApiClient(null);