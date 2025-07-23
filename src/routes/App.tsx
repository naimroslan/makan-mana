import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";

import Navbar from "../components/Menu/Navbar";
import FilterModal from "../components/Modal/FilterModal";
import GetLocationModal from "../components/Modal/GetLocationModal";
import AnnouncementModal from "../components/Modal/AnnouncementModal";

import FiltersHeader from "../components/App/FiltersHeader";
import RestaurantRoller from "../components/App/RestaurantRoller";
import SearchBar from "../components/App/SearchBar";

import { useSupabaseToken } from "../hooks/useSupabaseToken";
import { useUserTier } from "../hooks/useUserTier";
import {
  extractFilterOptions,
  FilterOptions,
} from "../utils/extractFilterOptions";
import { buildFilterURL } from "../utils/filters";
import { getSessionItem } from "../utils/session";
import { BACKEND } from "../utils/api";

const ROLL_DURATION = 3;
const VISIBLE_ITEM_HEIGHT = 60;

function App() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const [restaurants, setRestaurants] = useState<string[]>([]);
  const [originalRestaurants, setOriginalRestaurants] = useState<string[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(
    null,
  );
  const [search, setSearch] = useState("");
  const [isRolling, setIsRolling] = useState(false);

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    place: [],
    type: [],
    origin: [],
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFilterOptionsLoading, setIsFilterOptionsLoading] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  const [hasUserLocation, setHasUserLocation] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [pendingNearbyFilter, setPendingNearbyFilter] = useState<any>(null);

  useSupabaseToken();
  useUserTier();

  useEffect(() => {
    const loc = sessionStorage.getItem("makanmana_user_loc");
    setHasUserLocation(!!loc);
  }, []);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch(BACKEND.RESTAURANTS);
        const json = await res.json();

        if (json.data && Array.isArray(json.data)) {
          setRestaurants(json.data);
          setOriginalRestaurants(json.data);
        } else {
          const names = Object.values(json)
            .flat()
            .map((r) => r.name);
          setRestaurants(names);
          setOriginalRestaurants(names);
          setFilterOptions(extractFilterOptions(json));
        }
      } catch (err) {
        console.error("Failed to load restaurants:", err);
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (containerRef.current) gsap.set(containerRef.current, { y: 0 });
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
    if (search.trim()) navigate("/chat", { state: { query: search.trim() } });
  };

  const handleRestaurantClick = (name: string) => {
    navigate("/chat", { state: { query: name } });
  };

  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        sessionStorage.setItem(
          "makanmana_user_loc",
          JSON.stringify({
            latitude: +latitude.toFixed(5),
            longitude: +longitude.toFixed(5),
          }),
        );
        setHasUserLocation(true);
        setShowLocationModal(false);

        if (pendingNearbyFilter) {
          handleApplyFilter(pendingNearbyFilter);
          setPendingNearbyFilter(null);
        }
      },
      (err) => {
        alert("Unable to get location. Please enable access.");
        setPendingNearbyFilter(null);
        console.error(err);
      },
    );
  };

  const handleApplyFilter = async (filters: any) => {
    const isNearby = filters.place.some((p: any) => p.value === "nearby");

    if (isNearby && !getSessionItem("makanmana_user_loc")) {
      setPendingNearbyFilter(filters);
      setShowLocationModal(true);
      return;
    }

    setIsFilterLoading(true);
    try {
      const url = `${BACKEND.FILTER}${buildFilterURL(filters)}`;
      const res = await fetch(url);
      const json = await res.json();
      const names = Object.values(json).flat().filter(Boolean);
      setRestaurants(names);
      setSelectedRestaurant(null);
      setHasActiveFilters(true);
      if (containerRef.current) gsap.set(containerRef.current, { y: 0 });
    } catch (err) {
      console.error("Filter fetch error:", err);
      alert("Failed to filter. Try again.");
    } finally {
      setIsFilterLoading(false);
      setIsFilterOpen(false);
    }
  };

  const openFilterModal = async () => {
    if (filterOptions.place.length === 0) {
      setIsFilterOptionsLoading(true);
      try {
        const res = await fetch(BACKEND.FILTER_OPTIONS);
        const data = await res.json();
        setFilterOptions({
          place: [{ label: "Nearby", value: "nearby" }, ...data.place],
          type: data.type,
          origin: data.origin,
        });
      } catch {
        alert("Failed to load filter options.");
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
    if (containerRef.current) gsap.set(containerRef.current, { y: 0 });
  };

  return (
    <div className="min-h-screen bg-light flex flex-col">
      {/* <AnnouncementModal /> */}
      <main className="flex-1 px-4 pt-6 pb-24 overflow-auto">
        <div className="w-full max-w-md mx-auto space-y-6">
          <SearchBar value={search} onChange={setSearch} onSearch={onSearch} />

          <FiltersHeader
            hasActiveFilters={hasActiveFilters}
            restaurantCount={restaurants.length}
            showLocationButton={!hasUserLocation}
            onReset={resetFilters}
            onOpenFilters={openFilterModal}
            onRequestLocation={() => setShowLocationModal(true)}
          />

          <RestaurantRoller
            restaurants={restaurants}
            selectedRestaurant={selectedRestaurant}
            containerRef={containerRef}
            onClick={handleRestaurantClick}
          />

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

      <Navbar />

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilter}
        filterOptions={filterOptions}
        isLoading={isFilterOptionsLoading}
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
