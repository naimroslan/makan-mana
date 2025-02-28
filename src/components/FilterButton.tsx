import { useEffect, useState } from "react";
import data from '../data/restraurants.json';

interface Filters {
  all: boolean;
  sunwayPutra: boolean;
  trx: boolean;
  nearby: boolean;
}

interface FilterButtonProps {
  onRestaurantsChange: (restaurants: string[]) => void;
}

export function FilterButton({ onRestaurantsChange }: FilterButtonProps){
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    all: true,
    sunwayPutra: false,
    trx: false,
    nearby: false
  });

  const getFilteredRestaurants = () => {
    let filteredRestaurants: { name: string }[] = [];

    if (filters.all) {
      Object.values(data).forEach((mallRestaurants) => {
        filteredRestaurants = filteredRestaurants.concat(mallRestaurants);
      });
    } else {
      if (filters.sunwayPutra) {
        filteredRestaurants = filteredRestaurants.concat(data.sunwayputra);
      }
      if (filters.trx) {
        filteredRestaurants = filteredRestaurants.concat(data.trx);
      }
      if (filters.nearby) {
        filteredRestaurants = filteredRestaurants.concat(data.nearby);
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
    onRestaurantsChange(restaurants);
  }, [filters]);

  return (
    <>
      <button
        onClick={() => setShowFilterModal(true)}
        className="w-full md:w-1/3 max-w-md py-2 px-4 rounded-xl text-primary font-semibold text-lg 
          hover:bg-gray-100 active:transform active:scale-95 transition-all"
      >
        Filter
      </button>

      {showFilterModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" 
          onClick={() => setShowFilterModal(false)}
        >
          <div 
            className="bg-white rounded-2xl p-6 w-full max-w-md" 
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
                    className="w-5 h-5 rounded border-gray-300 text-purple-600 
                      focus:ring-purple-500"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
            <button
              onClick={() => setShowFilterModal(false)}
              className="mt-6 w-full py-2 px-4 rounded-xl text-white font-semibold text-lg 
                bg-purple-600 hover:bg-purple-700 active:transform active:scale-95 
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