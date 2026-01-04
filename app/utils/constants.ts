export const API = {
  MAKANMANA: {
    HOSTNAME: process.env.MAKANMANA_BACKEND_URL,
  },
};

export const APP_VERSION = process.env.REACT_MAKANMANA_VERSION;

export const ROLL_DURATION = 3;
export const VISIBLE_ITEM_HEIGHT = 60;

const constants = {
  API,
  APP_VERSION,
  ROLL_DURATION,
  VISIBLE_ITEM_HEIGHT,
};

export default constants;
