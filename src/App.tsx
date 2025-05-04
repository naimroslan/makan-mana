import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

import { FilterButton } from './components/FilterButton';
import { ChatDrawer } from './components/ChatDrawer';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<string[]>([]);

  // Add this useEffect for debugging
  useEffect(() => {
    console.log("App received restaurants:", restaurants);
  }, [restaurants]);

  const rollRestaurants = () => {
    if (isRolling || !containerRef.current) return;
    
    setIsRolling(true);
    setSelectedRestaurant(null);
    
    const duration = 3;
    const container = containerRef.current;
    const itemHeight = container.children[0].getBoundingClientRect().height;
    const totalHeight = itemHeight * restaurants.length;
    
    gsap.set(container, { y: 0 });
    
    gsap.to(container, {
      y: -totalHeight * 2,
      duration: duration,
      ease: "power2.inOut",
      onComplete: () => {
        const randomIndex = Math.floor(Math.random() * restaurants.length);
        setSelectedRestaurant(restaurants[randomIndex]);
        setIsRolling(false);
        
        gsap.set(container, {
          y: -randomIndex * itemHeight
        });
      }
    });
  };

  useEffect(() => {
    if (containerRef.current) {
      gsap.set(containerRef.current, { y: 0 });
    }
  }, []);

  return (
    <div className="min-h-screen bg-light flex flex-col">
      {/* Background gradients */}
      {/* <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] -translate-x-1/4 -translate-y-1/4 
          rounded-full bg-purple-200/50 blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] translate-x-1/4 translate-y-1/4 
          rounded-full bg-blue-200/50 blur-[120px]" />
      </div> */}
      
      {/* Main content wrapper */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative">
        <div className="w-full max-w-md space-y-8">
          <FilterButton onRestaurantsChange={setRestaurants} />
          
          {/* Restaurant list card */}
          <div className="bg-light rounded-2xl overflow-hidden border-2 border-primary-light">
            <div className="relative h-[180px] overflow-hidden bg-white">
              <div className="absolute inset-x-0 top-0 h-[60px] bg-gradient-to-b from-white to-transparent z-10" />
              <div className="absolute inset-x-0 bottom-0 h-[60px] bg-gradient-to-t from-white to-transparent z-10" />
              
              <div ref={containerRef} className="absolute top-[60px] inset-x-0 transition-all">
                {restaurants.map((restaurant, index) => (
                  <div
                    key={index}
                    className={`h-[60px] flex items-center justify-center text-xl font-semibold
                      ${selectedRestaurant === restaurant ? 'text-primary' : 'text-gray-700 opacity-30'}
                      ${index === 0 ? 'opacity-60' : ''}
                      ${index === 2 ? 'opacity-60' : ''}`}
                  >
                    {restaurant}
                  </div>
                ))}
              </div>
            </div>

            {selectedRestaurant && !isRolling && (
              <div className="p-4 bg-gray-50 text-center">
                <p className="text-gray-600">
                  Makan <span className="font-bold text-primary">{selectedRestaurant}</span> jom!
                </p>
              </div>
            )}
          </div>

          {/* Roll button */}
          <button
            onClick={rollRestaurants}
            disabled={isRolling}
            className={`w-full py-4 px-6 rounded-xl text-white font-semibold text-xl 
              transition-all ${
                isRolling
                  ? 'bg-gray-400 border-2 border-gray-400 cursor-not-allowed' 
                  : 'bg-secondary border-2 border-primary-light active:transform active:scale-95'
              }`}
          >
            {isRolling ? 'Rolling...' : 'Makan mana?'}
          </button>
        </div>
      </main>

      <ChatDrawer />

      {/* Footer */}
      <div className="w-full text-center py-10 text-gray-400 text-sm">
        yetanotherproject
      </div>
    </div>
  );
}

export default App;
