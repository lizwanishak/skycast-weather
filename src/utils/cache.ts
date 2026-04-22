const CACHE_KEY_PREFIX = "lightsky_cache_";
const CACHE_EXPIRY = 15 * 60 * 1000; // 15 minutes

export const getCachedData = <T>(key: string): T | null => {
  const cached = localStorage.getItem(CACHE_KEY_PREFIX + key);
  if (!cached) return null;

  try {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(CACHE_KEY_PREFIX + key);
      return null;
    }
    return data as T;
  } catch (e) {
    localStorage.removeItem(CACHE_KEY_PREFIX + key);
    return null;
  }
};

export const setCachedData = (key: string, data: any): void => {
  const cacheObject = {
    timestamp: Date.now(),
    data: data,
  };
  localStorage.setItem(CACHE_KEY_PREFIX + key, JSON.stringify(cacheObject));
};

export const saveLastLocation = (location: any): void => {
  localStorage.setItem("lightsky_last_loc", JSON.stringify(location));
};

export const getLastLocation = (): any | null => {
  const last = localStorage.getItem("lightsky_last_loc");
  return last ? JSON.parse(last) : null;
};
