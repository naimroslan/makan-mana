interface RestaurantRollerProps {
  restaurants: string[];
  selectedRestaurant: string | null;
  containerRef: React.RefObject<HTMLDivElement>;
  onClick: (name: string) => void;
}

export default function RestaurantRoller({
  restaurants,
  selectedRestaurant,
  containerRef,
  onClick,
}: RestaurantRollerProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-border shadow-sm">
      <div className="relative h-[220px] overflow-hidden">
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
                onClick={() => onClick(name)}
                className={`h-[60px] flex items-center justify-center text-xl font-semibold transition-opacity cursor-pointer ${
                  isSelected
                    ? "text-text opacity-100"
                    : "text-gray-400 opacity-30"
                }`}
              >
                {name}
              </div>
            );
          })}

          {restaurants.length === 0 && (
            <div className="h-[60px] flex items-center justify-center text-gray-500 text-lg">
              Loading restaurants...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
