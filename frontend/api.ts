import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/auth'; 

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const signup = async (data: any) => {
  return await apiClient.post('/signup', data);
};

export const signin = async (data: any) => {
  return await apiClient.post('/signin', data);
};

export const logout = async () => {
  return await apiClient.post('/logout');
};

export const getMe = async (token: string) => {
  return await apiClient.get('/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getUsers = async (token: string) => {
  return await apiClient.get('/admin/users', {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const approveUser = async (userId: number, token: string) => {
  return await apiClient.post(
    '/admin/approve-user',
    { userId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};