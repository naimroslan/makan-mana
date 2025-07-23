import { useEffect } from "react";
import { BACKEND } from "../utils/api";

export const useUserTier = () => {
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const fetchTier = async () => {
      const res = await fetch(BACKEND.USER_TIER, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      localStorage.setItem("user_tier", json.tier);
    };

    fetchTier();
  }, []);
};
