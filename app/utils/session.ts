export const getSessionItem = <T = string>(key: string): T | null => {
  const item = sessionStorage.getItem(key);
  if (!item) return null;

  try {
    return JSON.parse(item);
  } catch {
    return item as unknown as T;
  }
};

export const setSessionItem = <T>(key: string, value: T): void => {
  try {
    const serialized = JSON.stringify(value);
    sessionStorage.setItem(key, serialized);
  } catch {
    sessionStorage.setItem(key, String(value));
  }
};

export const getLocalItem = <T = string>(key: string): T | null => {
  const item = localStorage.getItem(key);
  if (!item) return null;

  try {
    return JSON.parse(item);
  } catch {
    return item as unknown as T;
  }
};

export const setLocalItem = <T>(key: string, value: T): void => {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch {
    localStorage.setItem(key, String(value));
  }
};
