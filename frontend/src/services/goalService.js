import axios from 'axios';
import { getToken } from './auth';

const API_URL = 'http://localhost:5000/api/goals';

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${getToken()}` }
});

export const getGoals = async () => {
  const response = await axios.get(API_URL, getAuthHeader());
  return response.data;
};

export const createGoal = async (goalData) => {
  const response = await axios.post(API_URL, goalData, getAuthHeader());
  return response.data;
};

export const updateGoalProgress = async (id, increment) => {
  const response = await axios.patch(`${API_URL}/${id}/progress`, { increment }, getAuthHeader());
  return response.data;
};

export const deleteGoal = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
  return response.data;
};