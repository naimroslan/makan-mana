import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { FilterButton } from "./components/FilterButton";
import { ChatDrawer } from "./components/ChatDrawer";

const ROLL_DURATION = 3;
const VISIBLE_ITEM_HEIGHT = 60;

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(
    null,
  );
  const [restaurants, setRestaurants] = useState<string[]>([]);

  // reset position on mount or when restaurant list changes
  useEffect(() => {
    if (!containerRef.current) return;
    gsap.set(containerRef.current, { y: 0 });
  }, [restaurants.length]);

  const rollRestaurants = useCallback(() => {
    if (isRolling || !containerRef.current || restaurants.length === 0) return;

    setIsRolling(true);
    setSelectedRestaurant(null);

    // compute heights
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

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative">
        <div className="w-full max-w-md space-y-8">
          <FilterButton onRestaurantsChange={setRestaurants} />

          <div className="bg-light rounded-2xl overflow-hidden border-2 border-primary-light">
            <div className="relative h-[180px] overflow-hidden bg-white">
              <div className="absolute inset-x-0 top-0 h-[60px] bg-gradient-to-b from-white to-transparent z-10" />
              <div className="absolute inset-x-0 bottom-0 h-[60px] bg-gradient-to-t from-white to-transparent z-10" />

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
                          : "text-gray-700 opacity-30"
                      }`}
                    >
                      {name}
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedRestaurant && !isRolling && (
              <div className="p-4 bg-gray-50 text-center">
                <p className="text-gray-600">
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
            className={`w-full py-4 px-6 rounded-xl text-white font-semibold text-xl transition-all
              ${
                isRolling || restaurants.length === 0
                  ? "bg-gray-400 border-gray-400 cursor-not-allowed"
                  : "bg-secondary border-primary-light active:scale-95"
              }`}
          >
            {isRolling ? "Rolling..." : "Makan mana?"}
          </button>
        </div>
      </main>

      <ChatDrawer />

      <footer className="w-full text-center py-10 text-gray-400 text-sm">
        yetanotherproject
      </footer>
    </div>
  );
}

export default App;
