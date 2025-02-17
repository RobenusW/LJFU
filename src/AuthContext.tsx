import { useEffect, useState } from "react";
import { supabase } from "./Account/supabase";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { AuthContext } from "./CreateContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialSession, setIsInitialSession] = useState(true);
  const navigate = useNavigate();

  // Handle initial session
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    getSession();
  }, []);

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Handle auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change:", event, session);

      setUser(session?.user || null);

      // Only navigate on actual sign in, not on session restore or tab switches
      if (event === "SIGNED_IN" && isInitialSession) {
        setIsInitialSession(false);

        if (session?.user?.user_metadata?.chosen_role === "talent") {
          navigate("talent/editor"); // Navigate to dashboard
        } else if (session?.user?.user_metadata?.chosen_role === "business") {
          navigate("/business/resumes"); // Navigate to dashboard
        } else {
          (async () => {
            navigate("/initiate");
            console.log("delaying redirect authcontext");
            await sleep(20000);
          })();
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        navigate("/"); // Navigate to home on sign out
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, isInitialSession]);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}
