export interface Restaurant {
  name: string;
  type: string[];
  origin?: string[];
  location?: string;
}

export interface RestaurantData {
  [location: string]: Restaurant[];
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterOptions {
  place: FilterOption[];
  type: FilterOption[];
  origin: FilterOption[];
}

export const extractFilterOptions = (
  data: RestaurantData | Restaurant[],
): FilterOptions => {
  const placeSet = new Set<string>();
  const typeSet = new Set<string>();
  const originSet = new Set<string>();

  if (Array.isArray(data)) {
    data.forEach((restaurant) => {
      if ("location" in restaurant && restaurant.location) {
        placeSet.add(restaurant.location);
      }
      restaurant.type?.forEach((c) => typeSet.add(c));
      restaurant.origin?.forEach((o) => originSet.add(o));
    });
  } else {
    Object.entries(data).forEach(([place, restaurants]) => {
      placeSet.add(place);
      restaurants.forEach((restaurant) => {
        restaurant.type?.forEach((c) => typeSet.add(c));
        restaurant.origin?.forEach((o) => originSet.add(o));
      });
    });
  }

  const toFilterOption = (item: string): FilterOption => ({
    label: item,
    value: item.toLowerCase(),
  });

  return {
    place: Array.from(placeSet).map(toFilterOption),
    type: Array.from(typeSet).map(toFilterOption),
    origin: Array.from(originSet).map(toFilterOption),
  };
};
