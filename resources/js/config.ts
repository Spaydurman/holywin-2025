const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";
const BASE_API_URL = import.meta.env.VITE_API_BASE_URL?.replace('/v1', '') || "http://127.0.1:8000/api";

export const API_ENDPOINTS = {
  LOGIN: `/login`,
  REGISTER: `/register`,
  USERS: `/users`,
  POST_SIDE_QUESTS: `/admin/side-quest`,
  SIDE_QUEST_HEADERS: `/admin/side-quest-headers`,
  SIDE_QUEST_LINES: `/admin/side-quest-lines`,
  LEADERBOARD: `/leaderboard`,
  VALIDATE_SIDE_QUEST: '/game/side-quest/validate',  // Updated to use web route with game auth
  UPDATE_ATTENDANCE: (id: number) => `/api/registrations/${id}/attendance`,
};

export default API_ENDPOINTS;
