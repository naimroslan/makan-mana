import { useEffect, useState } from "react";

interface Filters {
  all: boolean;
  sunwayPutra: boolean;
  trx: boolean;
  nearby: boolean;
}

interface FilterButtonProps {
  onRestaurantsChange: (restaurants: string[]) => void;
}

interface Restaurant {
  name: string;
  category: string | string[];
}

interface RestaurantData {
  sunwayputra: Restaurant[];
  trx: Restaurant[];
  nearby: Restaurant[];
  [key: string]: Restaurant[];
}

export function FilterButton({ onRestaurantsChange }: FilterButtonProps){
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    all: true,
    sunwayPutra: false,
    trx: false,
    nearby: false
  });
  const [restaurantData, setRestaurantData] = useState<RestaurantData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch restaurant data from backend
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        console.log("Fetching restaurant data...");
        const response = await fetch(`${process.env.MAKANMANA_API_URL}/restaurants`);
        if (!response.ok) {
          throw new Error('Failed to fetch restaurant data');
        }
        const data = await response.json();
        console.log("Restaurant data received:", data);
        setRestaurantData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const getFilteredRestaurants = () => {
    if (!restaurantData) return [];
    
    let filteredRestaurants: { name: string }[] = [];

    if (filters.all) {
      Object.values(restaurantData).forEach((mallRestaurants) => {
        filteredRestaurants = filteredRestaurants.concat(mallRestaurants);
      });
    } else {
      if (filters.sunwayPutra) {
        filteredRestaurants = filteredRestaurants.concat(restaurantData.sunwayputra);
      }
      if (filters.trx) {
        filteredRestaurants = filteredRestaurants.concat(restaurantData.trx);
      }
      if (filters.nearby) {
        filteredRestaurants = filteredRestaurants.concat(restaurantData.nearby);
      }
    }

    return filteredRestaurants.map((restaurant) => restaurant.name);
  };

  const handleFilterChange = (filterKey: keyof Filters) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters };
      if (filterKey === 'all') {
        newFilters.all = !newFilters.all;
        if (newFilters.all) {
          newFilters.sunwayPutra = false;
          newFilters.trx = false;
          newFilters.nearby = false;
        }
      } else {
        newFilters[filterKey] = !newFilters[filterKey];
        if (newFilters.sunwayPutra && newFilters.trx && newFilters.nearby) {
          newFilters.all = true;
        } else {
          newFilters.all = false;
        }
      }
      return newFilters;
    });
  };

  // Update parent component whenever filters change
  useEffect(() => {
    const restaurants = getFilteredRestaurants();
    console.log("Filtered restaurants:", restaurants);
    onRestaurantsChange(restaurants);
  }, [filters, restaurantData]); // Add restaurantData as a dependency

  return (
    <>
      <button
        onClick={() => setShowFilterModal(true)}
        className="w-full md:w-1/3 max-w-md py-2 px-4 rounded-xl text-primary font-semibold text-lg 
            bg-light hover:bg-gray-100 active:transform active:scale-95 transition-all border border-primary"
      >
        Filter
      </button>

      {showFilterModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" 
          onClick={() => setShowFilterModal(false)}
        >
          <div 
            className="bg-white rounded-2xl p-6 w-full max-w-md border-2 border-primary-light shadow-lg" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              {[
                { key: 'all', label: 'All' },
                { key: 'sunwayPutra', label: 'Sunway Putra' },
                { key: 'trx', label: 'TRX' },
                { key: 'nearby', label: 'Nearby' }
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center space-x-3 text-gray-700">
                  <input
                    type="checkbox"
                    checked={filters[key as keyof Filters]}
                    onChange={() => handleFilterChange(key as keyof Filters)}
                    className="w-5 h-5 rounded border-gray-300 text-secondary 
                      focus:ring-primary-light"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
            <button
              onClick={() => setShowFilterModal(false)}
              className="mt-6 w-full py-2 px-4 rounded-xl text-white font-semibold text-lg 
                bg-secondary hover:bg-primary active:transform active:scale-95 
                transition-all shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
