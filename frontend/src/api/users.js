import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchUsers = async (params = {}) => {
  const response = await axios.get(`${API_URL}/users`, { params });
  return response.data;
};

export const getUserById = async (id) => {
  const response = await axios.get(`${API_URL}/users/${id}`);
  return response.data;
};

export const searchUsers = async (params = {}) => {
  const response = await axios.get(`${API_URL}/users/search`, { params });
  return response.data;
};

export const fetchMentors = async (params = {}) => {
  const response = await axios.get(`${API_URL}/users/mentors`, { params });
  return response.data;
};

export const fetchMentees = async (params = {}) => {
  const response = await axios.get(`${API_URL}/users/mentees`, { params });
  return response.data;
};

export const updateReputation = async (id, value) => {
  const token = localStorage.getItem('token');
  const response = await axios.patch(
    `${API_URL}/users/reputation/${id}`,
    { value },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const getUserStats = async (id) => {
  const response = await axios.get(`${API_URL}/users/stats/${id}`);
  return response.data;
};
