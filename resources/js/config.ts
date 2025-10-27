const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/login`,
  REGISTER: `${API_BASE_URL}/register`,
  USERS: `${API_BASE_URL}/users`,
  POST_SIDE_QUESTS: `${API_BASE_URL}/admin/side-quest`,
  SIDE_QUEST_HEADERS: `${API_BASE_URL}/admin/side-quest-headers`,
  SIDE_QUEST_LINES: `${API_BASE_URL}/admin/side-quest-lines`,
  VALIDATE_SIDE_QUEST: '/game/side-quest/validate',  // Updated to use web route with game auth
};

export default API_ENDPOINTS;
