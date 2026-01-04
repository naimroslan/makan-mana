import { getSessionItem } from "@Utils/session";

export const LOCATION_KEY = "makanmana_user_loc";

export type StoredLocation = {
  latitude: number;
  longitude: number;
};

export const readStoredLocation = (): StoredLocation | null =>
  getSessionItem<StoredLocation>(LOCATION_KEY);

export const storeLocation = (
  coords: GeolocationCoordinates,
): StoredLocation => {
  const location = {
    latitude: +coords.latitude.toFixed(5),
    longitude: +coords.longitude.toFixed(5),
  };
  sessionStorage.setItem(LOCATION_KEY, JSON.stringify(location));
  return location;
};
