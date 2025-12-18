import axios from 'axios';
import { getToken } from './auth';

const API_URL = 'http://localhost:5000/api/habits';

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${getToken()}` }
});

export const getHabits = async () => {
  const response = await axios.get(API_URL, getAuthHeader());
  return response.data;
};

export const createHabit = async (name, category = 'general') => {
  const response = await axios.post(API_URL, { name, category }, getAuthHeader());
  return response.data;
};

export const toggleHabit = async (id) => {
  const response = await axios.patch(`${API_URL}/${id}/toggle`, {}, getAuthHeader());
  return response.data;
};

export const deleteHabit = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
  return response.data;
};
export const checkNewDay = async () => {
  const response = await axios.post(`${API_URL}/check-day`, {}, getAuthHeader());
  return response.data;
};