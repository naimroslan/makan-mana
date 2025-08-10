export const API = {
  MAKANMANA: {
    HOSTNAME: process.env.MAKANMANA_BACKEND_URL,
  },
};

export const APP_VERSION = process.env.REACT_MAKANMANA_VERSION;

const constants = {
  API,
  APP_VERSION,
};

export default constants;
