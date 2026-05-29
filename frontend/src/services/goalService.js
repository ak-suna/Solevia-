import axios from 'axios';
import { getToken } from './auth';
import { API_BASE_URL } from "../config";
const API_URL = `${API_BASE_URL}/goals`;

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

export const updateGoalProgress = async (id, currentIncrement) => {
  const response = await axios.patch(`${API_URL}/${id}/progress`, { currentIncrement }, getAuthHeader());
  return response.data;
};

export const deleteGoal = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
  return response.data;
};

export const linkHabitsToGoal = async (goalId, habitIds, contributionValues) => {
  const response = await axios.patch(
    `${API_URL}/${goalId}/link-habits`,
    { habitIds, contributionValues },
    getAuthHeader()
  );
  return response.data;
};

export const getLinkedHabits = async (goalId) => {
  const response = await axios.get(`${API_URL}/${goalId}/linked-habits`, getAuthHeader());
  return response.data;
};

export const getPastGoals = async () => {
  const response = await axios.get(`${API_URL}/past`, getAuthHeader());
  return response.data;
};