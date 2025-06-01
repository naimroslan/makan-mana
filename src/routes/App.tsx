import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { RiFilter3Fill, RiSearchFill } from "react-icons/ri";
import { gsap } from "gsap";

import Navbar from "../components/Menu/Navbar";
import FilterModal from "../components/Modal/FilterModal";

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

interface FilterOptions {
  place: string[];
  type: string[];
  origin: string[];
}

function App() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(
    null,
  );
  const [restaurants, setRestaurants] = useState<string[]>([]);
  const [restaurantData, setRestaurantData] = useState<RestaurantData>({});
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    place: [],
    type: [],
    origin: [],
  });
  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const extractFilterOptions = (data: RestaurantData): FilterOptions => {
    const places = Object.keys(data);
    const typeSet = new Set<string>();
    const originSet = new Set<string>();

    Object.values(data).forEach((restaurants) => {
      restaurants.forEach((restaurant) => {
        restaurant.type?.forEach((c) => typeSet.add(c));
        restaurant.origin?.forEach((o) => originSet.add(o));
      });
    });

    return {
      place: places,
      type: Array.from(typeSet),
      origin: Array.from(originSet),
    };
  };

  const getAllRestaurantNames = (data: RestaurantData): string[] => {
    return Object.values(data)
      .flat()
      .map((r) => r.name);
  };

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch(`${process.env.MAKANMANA_API_URL}/restaurants`);
        const json = await res.json();

        // Debug log for fetched data
        console.log("Fetched restaurants data:", json);

        if (json.data && Array.isArray(json.data)) {
          setRestaurants(json.data);
        } else {
          setRestaurantData(json);
          setRestaurants(getAllRestaurantNames(json));
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

  const handleApplyFilter = (selectedFilters: FilterOptions) => {
    // Debug log for filters applied
    console.log("Filters applied from Modal:", selectedFilters);

    const params = new URLSearchParams();

    selectedFilters.place.forEach((p) => params.append("place", p));
    selectedFilters.type.forEach((t) => params.append("type", t));
    selectedFilters.origin.forEach((o) => params.append("origin", o));

    fetch(`${process.env.MAKANMANA_API_URL}/filter?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        const names = Object.values(data)
          .flat()
          .map((r: any) => r.name);
        setRestaurants(names);
        setSelectedRestaurant(null);
      })
      .catch((err) => {
        console.error("Filter fetch error:", err);
        alert("Failed to filter restaurants.");
      });

    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    setRestaurants(getAllRestaurantNames(restaurantData));
    setSelectedRestaurant(null);
  };

  return (
    <div className="min-h-screen bg-light flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <h2 className="text-primary text-xl font-semibold mb-2">
            Ask Me Anything
          </h2>
          <div className="flex items-center bg-primary-light rounded-full p-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent focus:outline-none text-primary px-2"
              placeholder="What you feel like eating?"
            />
            <button
              onClick={onSearch}
              disabled={!search.trim()}
              className="bg-light px-5 py-3 rounded-full text-primary text-xl font-bold"
            >
              <RiSearchFill />
            </button>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <h2 className="text-primary text-xl font-semibold">Today's Pick</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={resetFilters}
                className="text-sm text-primary underline"
              >
                Reset
              </button>
              <button onClick={() => setIsFilterOpen(true)} className="p-1">
                <RiFilter3Fill className="w-6 h-6 text-primary" />
              </button>
            </div>
          </div>

          <div className="mt-4 bg-white rounded-2xl overflow-hidden border border-border">
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
                      className={`h-[60px] flex items-center justify-center text-xl font-semibold transition-opacity ${
                        isSelected
                          ? "text-primary opacity-100"
                          : "text-gray opacity-30"
                      }`}
                    >
                      {name}
                    </div>
                  );
                })}
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
            className={`mt-4 w-full py-4 px-6 rounded-xl text-white font-semibold text-xl transition-all ${
              isRolling || restaurants.length === 0
                ? "bg-muted cursor-not-allowed"
                : "bg-primary active:scale-95"
            }`}
          >
            {isRolling
              ? "Rolling..."
              : restaurants.length === 0
                ? "Loading..."
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
      />
    </div>
  );
}

export default App;
