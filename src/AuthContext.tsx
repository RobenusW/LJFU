import { useEffect, useState } from "react";
import { supabase } from "./Account/supabase";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { AuthContext } from "./CreateContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const navigate = useNavigate();

  // Handle initial session
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setInitialLoad(false);
    };
    getSession();
  }, []);

  // Handle auth state changes
  useEffect(() => {
    if (initialLoad) return; // Skip subscription during initial load

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        setUser(session?.user || null);
        // Only navigate on actual sign in, not session restore
        if (session?.user?.user_metadata?.chosen_role === "talent") {
          navigate("/resources"); // Navigate to dashboard
        } else if (session?.user?.user_metadata?.chosen_role === "business") {
          navigate("/business/resumes"); // Navigate to dashboard
        } else {
          navigate("/initiate"); // Navigate to dashboard
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        navigate("/"); // Navigate to home
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, initialLoad]);

  // Don't render children until initial load is complete
  if (initialLoad) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}
