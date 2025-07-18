import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchThreads = async (params = {}) => {
  const response = await axios.get(`${API_URL}/threads`, { params });
  return response.data;
};

export const createThread = async (data) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(
    `${API_URL}/threads`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const updatePost = async (id, data) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(
    `${API_URL}/posts/${id}`,
    data,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const deletePost = async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(
    `${API_URL}/posts/${id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const likePost = async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(
    `${API_URL}/posts/${id}/like`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const dislikePost = async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(
    `${API_URL}/posts/${id}/dislike`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const acceptAnswer = async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(
    `${API_URL}/posts/${id}/accept`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
