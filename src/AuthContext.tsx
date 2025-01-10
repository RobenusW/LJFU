import { useEffect, useState } from "react";
import { supabase } from "./Account/supabase";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { AuthContext } from "./CreateContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        setUser(session?.user || null);
        navigate("/dashboard"); // Navigate to dashboard
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        navigate("/"); // Navigate to home
      }
    });

    // Cleanup the subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}
