import axios from 'axios';
import { getToken } from './auth';

const API_URL = 'http://localhost:5000/api/journal';

const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${getToken()}` }
});

export const getJournals = async () => {
    const response = await axios.get(API_URL, getAuthHeader());
    return response.data;
};

export const getJournalById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
};

export const createJournal = async (journalData) => {
    const response = await axios.post(API_URL, journalData, getAuthHeader());
    return response.data;
};
