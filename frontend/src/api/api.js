import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('stayease_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if ([401, 403].includes(error.response?.status) && !error.config.url?.includes('/auth/login')) {
      localStorage.removeItem('stayease_token');
      localStorage.removeItem('stayease_user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const googleLogin = (data) => api.post('/auth/google', data);
export const getMe = () => api.get('/auth/me');

export const getHotels = (params = {}) => api.get('/hotels', { params });
export const getHotel = (id) => api.get(`/hotels/${id}`);
export const getRoomsByHotel = (hotelId) => api.get(`/rooms/hotel/${hotelId}`);
export const getAvailableRooms = (hotelId, checkIn, checkOut) =>
  api.get('/rooms/available', { params: { hotelId, checkIn, checkOut } });
export const getRoom = (id) => api.get(`/rooms/${id}`);
export const createBooking = (data) => api.post('/bookings', data);
export const getBookings = () => api.get('/bookings');
export const cancelBooking = (id) => api.delete(`/bookings/${id}`);

export default api;
