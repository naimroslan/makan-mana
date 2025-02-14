import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const restaurants = [
  "A&W",
  "Absolute Thai",
  "Ah Cheng Laksa",
  "Ayam Penyet Best",
  "Ayam Penyet Express",
  "Ayla Steakhouse",
  "BananaBro",
  "Boat Noodle",
  "Bungkus Kaw Kaw",
  "Burger King",
  "Chicken Plus",
  "Chili's",
  "Dolly Dim Sum",
  "Dubuyo",
  "Grill Teppanyaki",
  "Kedey Kamek",
  "Kenny Roger Roasters",
  "KFC",
  "Mee Hiris",
  "Mr Dakgalbi",
  "MyeongDong Topokki",
  "Nando's",
  "Onde Onde",
  "Pak Nik Burger",
  "Secret Recipe",
  "Serai",
  "Sukiya Tokyo Bowls",
  "Super Saigon",
  "Sushi Kazoku",
  "Sushi King",
  "Texas Chicken",
  "The Chicken Rice Shop",
  "The Manhattan Fish Market",
  "Toast Maker",
  "Vivo Pizza"
];

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);

  const rollRestaurants = () => {
    if (isRolling || !containerRef.current) return;
    
    setIsRolling(true);
    setSelectedRestaurant(null);
    
    const duration = 3;
    const container = containerRef.current;
    const itemHeight = container.children[0].getBoundingClientRect().height;
    const totalHeight = itemHeight * restaurants.length;
    
    // Reset position
    gsap.set(container, { y: 0 });
    
    // Create the rolling animation
    gsap.to(container, {
      y: -totalHeight * 2, // Roll through the list multiple times
      duration: duration,
      ease: "power2.inOut",
      onComplete: () => {
        const randomIndex = Math.floor(Math.random() * restaurants.length);
        setSelectedRestaurant(restaurants[randomIndex]);
        setIsRolling(false);
        
        // Position the selected restaurant in the center
        gsap.set(container, {
          y: -randomIndex * itemHeight
        });
      }
    });
  };

  useEffect(() => {
    // Initial setup
    if (containerRef.current) {
      gsap.set(containerRef.current, { y: 0 });
    }
  }, []);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex flex-col items-center">
      {/* Decorative blurred circles */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-200/50 blur-[100px]" />
      <div className="absolute bottom-[-30%] right-[-20%] w-[600px] h-[600px] rounded-full bg-blue-200/50 blur-[120px]" />
      
      {/* Main content wrapper */}
      <div className="flex-1 w-full flex flex-col items-center justify-center gap-8 p-4">
        {/* Restaurant list card */}
        <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
          <div className="relative h-[180px] overflow-hidden bg-white">
            {/* Top fade gradient */}
            <div className="absolute left-0 right-0 top-0 h-[60px] bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />
            
            {/* Bottom fade gradient */}
            <div className="absolute left-0 right-0 bottom-0 h-[60px] bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
            
            <div ref={containerRef} className="absolute top-[60px] left-0 right-0 transition-all">
              {restaurants.map((restaurant, index) => (
                <div
                  key={index}
                  className={`h-[60px] flex items-center justify-center text-xl font-semibold
                    ${selectedRestaurant === restaurant ? 'text-purple-600' : 'text-gray-700 opacity-30'}
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
                Your destination: <span className="font-bold text-purple-600">{selectedRestaurant}</span>
              </p>
            </div>
          )}
        </div>

        {/* Button */}
        <button
          onClick={rollRestaurants}
          disabled={isRolling}
          className={`w-full max-w-md py-4 px-6 rounded-xl text-white font-bold text-xl transition-all shadow-lg relative z-20
            ${isRolling 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-purple-600 hover:bg-purple-700 active:transform active:scale-95'
            }`}
        >
          {isRolling ? 'Rolling...' : 'Makan mana?'}
        </button>
      </div>

      {/* Footer */}
      <div className="w-full text-center py-4 text-gray-400 text-sm">
        Built with <a href="https://bolt.new" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600">bolt.new</a>
      </div>
    </div>
  );
}

export default App;