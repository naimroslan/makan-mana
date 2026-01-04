import { API } from "@Utils/constants";

export const BACKEND = {
  FILTER_OPTIONS: `${API.MAKANMANA.HOSTNAME}/restaurants/filter-options`,
  FILTER: `${API.MAKANMANA.HOSTNAME}/restaurants/`,
  RESTAURANTS: `${API.MAKANMANA.HOSTNAME}/restaurants`,
  CHAT: `${API.MAKANMANA.HOSTNAME}/chat`,
  ADMIN_LOGIN: `${API.MAKANMANA.HOSTNAME}/admin/login`,
  USER_LOGIN: `${API.MAKANMANA.HOSTNAME}/auth/google`,
  ANNOUNCEMENT: `${API.MAKANMANA.HOSTNAME}/announcement`,
  PROFILE: `${API.MAKANMANA.HOSTNAME}/profile`,
  SEED: `${API.MAKANMANA.HOSTNAME}/avatar/seed`,
};
