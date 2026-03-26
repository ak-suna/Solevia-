import axios from 'axios';
import { getToken } from './auth';

const API_URL = 'http://localhost:5000/api/analytics';

const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${getToken()}` }
});

export const getAnalyticsSummary = async () => {
    const response = await axios.get(`${API_URL}/summary`, getAuthHeader());
    return response.data;
};