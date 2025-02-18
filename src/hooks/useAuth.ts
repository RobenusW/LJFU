import { useContext } from "react";
import { AuthContext } from "../CreateContext.tsx";
import { User } from "@supabase/supabase-js";

export function useAuth(): { user: User | null } {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("Context must be defined");
  }
  return context;
}
