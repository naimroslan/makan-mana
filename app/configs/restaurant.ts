import { BACKEND } from "@Utils/api";
import {
  extractFilterOptions,
  type FilterOptions,
} from "@Utils/extractFilterOptions";
import { buildFilterURL } from "@Utils/filters";

export const NEARBY_OPTION = { label: "Nearby", value: "nearby" };

export async function loadRestaurants(): Promise<{
  restaurants: string[];
  filterOptions?: FilterOptions;
}> {
  const res = await fetch(BACKEND.RESTAURANTS);
  const json = await res.json();

  if (json.data && Array.isArray(json.data)) {
    return { restaurants: json.data };
  }

  const restaurants = Object.values(json)
    .flat()
    .map((r: any) => r.name);

  return { restaurants, filterOptions: extractFilterOptions(json) };
}

export async function loadFilterOptions(): Promise<FilterOptions> {
  const res = await fetch(BACKEND.FILTER_OPTIONS);
  const data = await res.json();
  return {
    place: [NEARBY_OPTION, ...(data.place || [])],
    type: data.type || [],
    origin: data.origin || [],
  };
}

export async function loadFilteredRestaurants(filters: any): Promise<string[]> {
  const url = `${BACKEND.FILTER}${buildFilterURL(filters)}`;
  const res = await fetch(url);
  const json = await res.json();
  return Object.values(json).flat().filter(Boolean) as string[];
}

export type { FilterOptions } from "@Utils/extractFilterOptions";
