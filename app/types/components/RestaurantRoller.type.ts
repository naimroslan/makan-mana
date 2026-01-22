import type React from "react";

export interface RestaurantRollerProps {
  restaurants: string[];
  selectedRestaurant: string | null;
  containerRef: React.RefObject<HTMLDivElement>;
  onClick: (name: string) => void;
}
