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
