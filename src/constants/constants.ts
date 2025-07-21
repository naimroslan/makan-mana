export const API = {
  MAKANMANA: {
    HOSTNAME: process.env.MAKANMANA_BACKEND_URL,
  },
  SUPABASE: {
    HOSTNAME: process.env.SUPABASE_URL,
    ANON: process.env.SUPABASE_ANON_KEY,
  },
};

export const APP_VERSION = process.env.REACT_MAKANMANA_VERSION;

const constants = {
  API,
  APP_VERSION,
};

export default constants;
