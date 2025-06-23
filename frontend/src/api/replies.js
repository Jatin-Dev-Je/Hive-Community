import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchRepliesByPost = async (postId, params = {}) => {
  const response = await axios.get(`${API_URL}/replies/post/${postId}`, { params });
  return response.data;
};

export const createReply = async (data) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(
    `${API_URL}/replies`,
    data,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const updateReply = async (id, data) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(
    `${API_URL}/replies/${id}`,
    data,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const deleteReply = async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(
    `${API_URL}/replies/${id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const likeReply = async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(
    `${API_URL}/replies/${id}/like`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const dislikeReply = async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(
    `${API_URL}/replies/${id}/dislike`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const markHelpful = async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(
    `${API_URL}/replies/${id}/mark-helpful`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const unmarkHelpful = async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(
    `${API_URL}/replies/${id}/unmark-helpful`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}; 