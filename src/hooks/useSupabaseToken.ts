import { useEffect } from "react";
import { supabase } from "../utils/supabase";

export const useSupabaseToken = () => {
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (token) localStorage.setItem("access_token", token);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const token = session?.access_token;
        if (token) localStorage.setItem("access_token", token);
        else localStorage.removeItem("access_token");
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);
};
