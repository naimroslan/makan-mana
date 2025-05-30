import { useEffect, useState, useMemo, useCallback } from "react";

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

export function FilterButton({ onRestaurantsChange }: FilterButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    all: true,
    sunwayPutra: false,
    trx: false,
    nearby: false,
  });
  const [data, setData] = useState<RestaurantData | null>(null);
  const [loading, setLoading] = useState(true);

  // fetch once
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${process.env.MAKANMANA_API_URL}/restaurants`);
        if (!res.ok) throw new Error("Failed to load");
        setData(await res.json());
      } catch {
        /* handle global error state if desired */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // compute filtered list
  const filtered = useMemo(() => {
    if (!data) return [];
    let list: Restaurant[] = [];
    if (filters.all) {
      list = Object.values(data).flat();
    } else {
      if (filters.sunwayPutra) list.push(...data.sunwayputra);
      if (filters.trx) list.push(...data.trx);
      if (filters.nearby) list.push(...data.nearby);
    }
    return list.map((r) => r.name);
  }, [data, filters]);

  // notify parent
  useEffect(() => {
    onRestaurantsChange(filtered);
  }, [filtered, onRestaurantsChange]);

  const toggleFilter = useCallback((key: keyof Filters) => {
    setFilters((prev) => {
      const next = { ...prev };
      if (key === "all") {
        next.all = !prev.all;
        if (next.all) {
          next.sunwayPutra = next.trx = next.nearby = false;
        }
      } else {
        next[key] = !prev[key];
        next.all = next.sunwayPutra && next.trx && next.nearby;
      }
      return next;
    });
  }, []);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full md:w-1/3 max-w-md py-2 px-4 rounded-xl text-primary font-semibold text-lg bg-light hover:bg-gray-100 transition-all border border-primary"
      >
        Filter
      </button>

      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-md border-2 border-primary-light shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              {(["all", "sunwayPutra", "trx", "nearby"] as const).map((key) => (
                <label
                  key={key}
                  className="flex items-center space-x-3 text-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={filters[key]}
                    onChange={() => toggleFilter(key)}
                    className="w-5 h-5 rounded border-gray-300 text-secondary focus:ring-primary-light"
                  />
                  <span>
                    {key === "all"
                      ? "All"
                      : key === "sunwayPutra"
                        ? "Sunway Putra"
                        : key === "trx"
                          ? "TRX"
                          : "Nearby"}
                  </span>
                </label>
              ))}
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-6 w-full py-2 px-4 rounded-xl text-white font-semibold text-lg bg-secondary hover:bg-primary transition-all shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
