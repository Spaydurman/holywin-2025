// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";
// const BASE_API_URL = import.meta.env.VITE_API_BASE_URL?.replace('/v1', '') || "http://127.0.1:8000/api";


export const API_ENDPOINTS = {
  LOGIN: `/login`,
  REGISTER: `/register`,
  USERS: `/users`,
  POST_SIDE_QUESTS: `/api/v1/admin/side-quest`,
  SIDE_QUEST_HEADERS: `/api/v1/admin/side-quest-headers`,
  SIDE_QUEST_LINES: `/api/v1/admin/side-quest-lines`,
  LEADERBOARD: `/api/v1/leaderboard`,
  VALIDATE_SIDE_QUEST: '/game/side-quest/validate',  // Updated to use web route with game auth
  UPDATE_ATTENDANCE: () => `/api/registrations/attendance`,
};

export default API_ENDPOINTS;
