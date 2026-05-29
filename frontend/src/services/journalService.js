import axios from 'axios';
import { getToken } from './auth';
import { API_BASE_URL } from "../config";
const API_URL = `${API_BASE_URL}/journal`;

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
