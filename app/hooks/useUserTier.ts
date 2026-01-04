import { useEffect, useState } from "react";
import { BACKEND } from "../utils/api";

export const useUserTier = () => {
  const [tier, setTier] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const fetchTier = async () => {
      try {
        const res = await fetch(BACKEND.USER_TIER, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        setTier(json.tier);
        localStorage.setItem("user_tier", json.tier);
      } catch (err) {
        console.error("Failed to fetch user tier", err);
      }
    };

    fetchTier();
  }, []);

  return tier;
};
