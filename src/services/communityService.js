import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/community';

// Backend dùng session-based auth (Spring Security form login + cookie)
// withCredentials: true để browser tự động gửi session cookie
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});


export const communityService = {
  // ── Posts ────────────────────────────────────────
  getFeed: (params) =>
    axiosInstance.get(`/posts`, { params }).then(res => res.data),

  getFollowingFeed: (params) =>
    axiosInstance.get(`/posts/following`, { params }).then(res => res.data),

  getPost: (id) =>
    axiosInstance.get(`/posts/${id}`).then(res => res.data),

  createPost: (data) =>
    axiosInstance.post(`/posts`, data).then(res => res.data),

  updatePost: (id, data) =>
    axiosInstance.put(`/posts/${id}`, data).then(res => res.data),

  deletePost: (id) =>
    axiosInstance.delete(`/posts/${id}`).then(res => res.data),

  getSavedPosts: (params) =>
    axiosInstance.get(`/posts/saved`, { params }).then(res => res.data),

  getUserPosts: (userId, params) =>
    axiosInstance.get(`/users/${userId}/posts`, { params }).then(res => res.data),

  // ── Interactions ─────────────────────────────────
  likePost: (id) =>
    axiosInstance.post(`/posts/${id}/like`).then(res => res.data),

  unlikePost: (id) =>
    axiosInstance.delete(`/posts/${id}/like`).then(res => res.data),

  savePost: (id) =>
    axiosInstance.post(`/posts/${id}/save`).then(res => res.data),

  unsavePost: (id) =>
    axiosInstance.delete(`/posts/${id}/save`).then(res => res.data),

  sharePost: (id) =>
    axiosInstance.post(`/posts/${id}/share`).then(res => res.data),

  reportPost: (id, data) =>
    axiosInstance.post(`/posts/${id}/report`, data).then(res => res.data),

  // ── Comments ─────────────────────────────────────
  getComments: (postId, params) =>
    axiosInstance.get(`/posts/${postId}/comments`, { params }).then(res => res.data),

  addComment: (postId, data) =>
    axiosInstance.post(`/posts/${postId}/comments`, data).then(res => res.data),

  deleteComment: (commentId) =>
    axiosInstance.delete(`/comments/${commentId}`).then(res => res.data),

  // ── Follow ───────────────────────────────────────
  followUser: (userId) =>
    axiosInstance.post(`/users/${userId}/follow`).then(res => res.data),

  unfollowUser: (userId) =>
    axiosInstance.delete(`/users/${userId}/follow`).then(res => res.data),

  getUserProfile: (userId) =>
    axiosInstance.get(`/users/${userId}/profile`).then(res => res.data),

  // ── Upload & Tags ─────────────────────────────────
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosInstance.post(`/upload/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
  },

  getTrendingTags: () =>
    axiosInstance.get(`/tags/trending`).then(res => res.data),

  searchTags: (q) =>
    axiosInstance.get(`/tags/search`, { params: { q } }).then(res => res.data),
};
