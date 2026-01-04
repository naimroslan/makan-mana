import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "@emotion/react";
import { useNavigate } from "react-router";
import { gsap } from "gsap";

import {
  loadFilterOptions,
  loadFilteredRestaurants,
  loadRestaurants,
  type FilterOptions,
} from "@Configs/restaurant";
import { readStoredLocation, storeLocation } from "@Configs/location";
import { ROLL_DURATION, VISIBLE_ITEM_HEIGHT } from "@Utils/constants";
import Header from "@Components/Header/Header";
import FilterDialog from "@Components/Modal/Filter/FilterDialog";
import FiltersHeader from "@Components/App/FiltersHeader";
import RestaurantRoller from "@Components/App/RestaurantRoller";
import SearchBar from "@Components/App/SearchBar";
import { useUserTier } from "@Hooks/useUserTier";
import PlaceStatus from "@Components/App/PlaceStatus";
import getStyle from "./Home.css";

const Home = () => {
  const theme = useTheme();
  const styles = getStyle(theme);
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

  useUserTier();

  useEffect(() => {
    setHasUserLocation(!!readStoredLocation());
  }, []);

  useEffect(() => {
    loadRestaurants()
      .then(({ restaurants, filterOptions }) => {
        setRestaurants(restaurants);
        setOriginalRestaurants(restaurants);
        if (filterOptions) setFilterOptions(filterOptions);
      })
      .catch((err) => {
        console.error("Failed to load restaurants:", err);
      });
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
        if (containerRef.current) {
          // null guard added
          gsap.set(containerRef.current, { y: -idx * itemHeight });
        }
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
        storeLocation(pos.coords);
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
      const names = await loadFilteredRestaurants(filters);
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
        const options = await loadFilterOptions();
        setFilterOptions(options);
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
    <div css={styles.container}>
      {/* <AnnouncementModal /> */}
      <main css={styles.main}>
        <div css={styles.content}>
          <Header />
          <SearchBar value={search} onChange={setSearch} onSearch={onSearch} />

          <FiltersHeader
            hasActiveFilters={hasActiveFilters}
            restaurantCount={restaurants.length}
            showLocationButton={!hasUserLocation}
            onReset={resetFilters}
            onOpenFilters={openFilterModal}
            onRequestLocation={handleGetLocation}
          />

          <div css={styles.rollerWrapper}>
            <RestaurantRoller
              restaurants={restaurants}
              selectedRestaurant={selectedRestaurant}
              containerRef={containerRef}
              onClick={handleRestaurantClick}
            />

            <button
              onClick={rollRestaurants}
              disabled={isRolling || restaurants.length === 0}
              css={[
                styles.rollButton,
                isRolling || restaurants.length === 0
                  ? styles.rollButtonDisabled
                  : styles.rollButtonActive,
              ]}
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

          {selectedRestaurant && !isRolling && (
            <div css={styles.selectionContainer}>
              <p css={styles.selectionText}>
                Makan{" "}
                <span css={styles.selectionHighlight}>
                  {selectedRestaurant}
                </span>{" "}
                jom!
              </p>
              <div css={styles.statusWrapper}>
                <PlaceStatus isOpen={true} />
              </div>
            </div>
          )}
        </div>
      </main>

      <FilterDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilter}
        filterOptions={filterOptions}
        isLoading={isFilterOptionsLoading}
      />
    </div>
  );
};

export default Home;
