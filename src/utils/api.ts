const BASE_URL = process.env.MAKANMANA_API_URL;

export const API = {
  FILTER_OPTIONS: `${BASE_URL}/restaurants/filter-options`,
  FILTER: `${BASE_URL}/restaurants/filter`,
  RESTAURANTS: `${BASE_URL}/restaurants`,
  CHAT: `${BASE_URL}/chat`,
  LOGIN: `${BASE_URL}/admin/login`,
};
