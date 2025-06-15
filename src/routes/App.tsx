import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { RiFilter3Fill, RiMapPinLine, RiSearchFill } from "react-icons/ri";
import { gsap } from "gsap";

import Navbar from "../components/Menu/Navbar";
import FilterModal from "../components/Modal/FilterModal";
import GetLocationModal from "../components/Modal/GetLocationModal";
import { buildFilterURL } from "../utils/filters";

const ROLL_DURATION = 3;
const VISIBLE_ITEM_HEIGHT = 60;

interface Restaurant {
  name: string;
  type: string[];
  origin?: string[];
}

interface RestaurantData {
  [location: string]: Restaurant[];
}

interface FilterOption {
  label: string; // Display to user (e.g., 'Sunway Putra Mall')
  value: string; // Sent to backend (e.g., 'sunway putra mall')
}

interface FilterOptions {
  place: FilterOption[];
  type: FilterOption[];
  origin: FilterOption[];
}

function App() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(
    null,
  );
  const [restaurants, setRestaurants] = useState<string[]>([]);
  const [originalRestaurants, setOriginalRestaurants] = useState<string[]>([]);
  const [restaurantData, setRestaurantData] = useState<RestaurantData>({});
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    place: [],
    type: [],
    origin: [],
  });
  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [isFilterOptionsLoading, setIsFilterOptionsLoading] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [hasUserLocation, setHasUserLocation] = useState(false);
  const [pendingNearbyFilter, setPendingNearbyFilter] =
    useState<FilterOptions | null>(null);

  // ✅ Only check if user *already* has a location stored
  useEffect(() => {
    const loc = localStorage.getItem("makanmana_user_loc");
    setHasUserLocation(!!loc);
  }, []);

  const extractFilterOptions = (
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
      value: item.toLowerCase(), // ensure value is lowercase for backend
    });

    return {
      place: Array.from(placeSet).map(toFilterOption),
      type: Array.from(typeSet).map(toFilterOption),
      origin: Array.from(originSet).map(toFilterOption),
    };
  };

  const getAllRestaurantNames = (data: RestaurantData): string[] => {
    return Object.values(data)
      .flat()
      .map((r) => r.name);
  };

  // ✅ Only request location when user clicks
  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const rounded = (num: number) => Number(num.toFixed(5));
        const { latitude, longitude } = position.coords;
        const locationData = {
          latitude: rounded(latitude),
          longitude: rounded(longitude),
        };
        localStorage.setItem(
          "makanmana_user_loc",
          JSON.stringify(locationData),
        );
        setHasUserLocation(true);
        setShowLocationModal(false);

        if (pendingNearbyFilter) {
          handleApplyFilter(pendingNearbyFilter);
          setPendingNearbyFilter(null);
        }
      },
      (error) => {
        console.error("Location access denied or error:", error);
        alert("Unable to get your location. Please enable location access.");
        setPendingNearbyFilter(null);
      },
    );
  };

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch(`${process.env.MAKANMANA_API_URL}/restaurants`);
        const json = await res.json();

        if (json.data && Array.isArray(json.data)) {
          setRestaurants(json.data);
          setOriginalRestaurants(json.data);
        } else {
          const restaurantNames = getAllRestaurantNames(json);
          setRestaurantData(json);
          setRestaurants(restaurantNames);
          setOriginalRestaurants(restaurantNames);
          setFilterOptions(extractFilterOptions(json));
        }
      } catch (err) {
        console.error("Failed to load restaurants:", err);
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.set(containerRef.current, { y: 0 });
  }, [restaurants.length]);

  const rollRestaurants = useCallback(() => {
    if (isRolling || !containerRef.current || restaurants.length === 0) return;

    setIsRolling(true);
    setSelectedRestaurant(null);

    const itemHeight = VISIBLE_ITEM_HEIGHT;
    const totalHeight = itemHeight * restaurants.length;

    gsap.set(containerRef.current, { y: 0 });
    gsap.to(containerRef.current, {
      y: -totalHeight * 2,
      duration: ROLL_DURATION,
      ease: "power2.inOut",
      onComplete: () => {
        const idx = Math.floor(Math.random() * restaurants.length);
        setSelectedRestaurant(restaurants[idx]);
        setIsRolling(false);
        gsap.set(containerRef.current, { y: -idx * itemHeight });
      },
    });
  }, [isRolling, restaurants]);

  const onSearch = () => {
    const trimmed = search.trim();
    if (!trimmed) return;
    navigate("/chat", { state: { query: trimmed } });
  };

  const handleRestaurantClick = (restaurantName: string) => {
    navigate("/chat", { state: { query: restaurantName } });
  };

  const handleApplyFilter = async (selectedFilters: FilterOptions) => {
    const isNearby = selectedFilters.place.some((p) => p.value === "nearby");

    if (isNearby) {
      const locationStr = localStorage.getItem("makanmana_user_loc");
      if (!locationStr) {
        setPendingNearbyFilter(selectedFilters);
        setShowLocationModal(true);
        return;
      }
    }

    setIsFilterLoading(true);

    try {
      const params = buildFilterURL(selectedFilters); // ✅ Don't manually add nearby again
      const url = `${process.env.MAKANMANA_API_URL}${params}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const filteredNames = await res.json();

      const restaurantNames = Object.values(filteredNames)
        .flat()
        .map((r) => r.name);

      setRestaurants(restaurantNames);
      setSelectedRestaurant(null);
      setHasActiveFilters(true);

      if (containerRef.current) {
        gsap.set(containerRef.current, { y: 0 });
      }
    } catch (err) {
      console.error("Filter fetch error:", err);
      alert("Failed to filter restaurants. Please try again.");
    } finally {
      setIsFilterLoading(false);
      setIsFilterOpen(false);
    }
  };

  const openFilterModal = async () => {
    if (
      filterOptions.place.length === 0 &&
      filterOptions.type.length === 0 &&
      filterOptions.origin.length === 0
    ) {
      try {
        setIsFilterOptionsLoading(true);
        const res = await fetch(
          `${process.env.MAKANMANA_API_URL}/filter-options`,
        );
        const data = await res.json();

        setFilterOptions({
          place: [
            { label: "Nearby", value: "nearby" }, // ensure value lowercase for backend
            { label: "Sunway Putra Mall", value: "sunway-putra-mall" },
            { label: "TRX Mall", value: "trx-mall" },
          ],
          type: data.type.map((item: string) => ({
            label: item,
            value: item.toLowerCase(),
          })),
          origin: data.origin.map((item: string) => ({
            label: item,
            value: item.toLowerCase(),
          })),
        });
      } catch (err) {
        console.error("Failed to load filter options:", err);
        alert("Failed to load filter options. Please try again.");
      } finally {
        setIsFilterOptionsLoading(false);
      }
    }
    setIsFilterOpen(true);
  };

  const resetFilters = () => {
    setRestaurants(originalRestaurants);
    setSelectedRestaurant(null);
    setHasActiveFilters(false);

    if (containerRef.current) {
      gsap.set(containerRef.current, { y: 0 });
    }
  };

  return (
    <div className="min-h-screen bg-light flex flex-col">
      <main className="flex-1 px-4 pt-6 pb-24 overflow-auto">
        <div className="w-full max-w-md mx-auto space-y-6">
          <div>
            <h2 className="text-primary text-xl font-semibold mb-2">
              Ask Me Anything
            </h2>
            <div className="flex items-center bg-primary-light rounded-full p-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && onSearch()}
                className="flex-1 bg-transparent focus:outline-none text-primary px-2 font-funnel font-semibold"
                placeholder="What you feel like eating?"
              />
              <button
                onClick={onSearch}
                disabled={!search.trim()}
                className="bg-light px-5 py-3 rounded-full text-primary text-xl font-bold disabled:opacity-50"
              >
                <RiSearchFill />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <h2 className="text-primary text-xl font-semibold">
                Today's Pick
              </h2>
              {hasActiveFilters && (
                <span className="text-sm font-normal text-gray">
                  ({restaurants.length} filtered)
                </span>
              )}
              {!hasUserLocation && (
                <button
                  onClick={() => setShowLocationModal(true)}
                  className="p-1 transition-colors text-gray hover:text-primary"
                >
                  <RiMapPinLine className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-sm text-primary underline hover:text-primary/80"
                >
                  Reset
                </button>
              )}
              <button
                onClick={openFilterModal}
                className={`p-1 transition-colors ${hasActiveFilters ? "text-primary" : "text-gray"}`}
              >
                <RiFilter3Fill className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden border border-border">
            <div className="relative h-[180px] overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-[60px] bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-[60px] bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
              <div
                ref={containerRef}
                className="absolute top-[60px] inset-x-0 transition-all"
              >
                {restaurants.map((name, i) => {
                  const isSelected = name === selectedRestaurant;
                  return (
                    <div
                      key={name + i}
                      onClick={() => handleRestaurantClick(name)}
                      className={`h-[60px] flex items-center justify-center text-xl font-semibold transition-opacity cursor-pointer ${
                        isSelected
                          ? "text-primary opacity-100"
                          : "text-gray opacity-30"
                      }`}
                    >
                      {name}
                    </div>
                  );
                })}

                {restaurants.length === 0 && (
                  <div className="h-[60px] flex items-center justify-center text-gray text-lg">
                    {hasActiveFilters
                      ? "No restaurants match your filters"
                      : "Loading restaurants..."}
                  </div>
                )}
              </div>
            </div>

            {selectedRestaurant && !isRolling && (
              <div className="p-4 bg-light text-center">
                <p className="text-gray">
                  Makan{" "}
                  <span className="font-bold text-primary">
                    {selectedRestaurant}
                  </span>{" "}
                  jom!
                </p>
              </div>
            )}
          </div>

          <button
            onClick={rollRestaurants}
            disabled={isRolling || restaurants.length === 0}
            className={`w-full py-4 px-6 rounded-xl text-white font-semibold text-xl transition-all ${
              isRolling || restaurants.length === 0
                ? "bg-muted cursor-not-allowed"
                : "bg-primary active:scale-95 hover:bg-primary/90"
            }`}
          >
            {isRolling
              ? "Rolling..."
              : restaurants.length === 0
                ? hasActiveFilters
                  ? "No restaurants available"
                  : "Loading..."
                : "Makan mana?"}
          </button>
        </div>
      </main>

      <Navbar className="fixed bottom-0 left-0 right-0 z-50" />

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilter}
        filterOptions={filterOptions}
        isLoading={isFilterOptionsLoading} // ✅ Pass this if your FilterModal handles loading UI
      />

      {showLocationModal && (
        <GetLocationModal
          onAllow={() => setShowLocationModal(false)}
          onClose={() => setShowLocationModal(false)}
          onRequestLocation={handleGetLocation}
        />
      )}
    </div>
  );
}

export default App;
