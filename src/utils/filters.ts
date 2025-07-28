export const buildFilterURL = (selectedFilters: {
  city: { label: string; value: string }[];
  place: { label: string; value: string }[];
  type: { label: string; value: string }[];
  origin: { label: string; value: string }[];
}) => {
  const params = new URLSearchParams();

  const hasNearby = selectedFilters.place.some((p) => p.value === "nearby");

  if (hasNearby) {
    const loc = sessionStorage.getItem("makanmana_user_loc");
    if (loc) {
      const { latitude, longitude } = JSON.parse(loc);
      params.append("nearby", `${latitude},${longitude}`);
    }
  }

  selectedFilters.city?.forEach((city) => params.append("city", city.value));
  selectedFilters.place
    .filter((p) => p.value !== "nearby")
    .forEach((p) => params.append("place", p.value));
  selectedFilters.type.forEach((type) => params.append("type", type.value));
  selectedFilters.origin.forEach((origin) =>
    params.append("origin", origin.value),
  );

  return `/filter?${params.toString()}`;
};
