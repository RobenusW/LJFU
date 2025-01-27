import { useContext } from "react";
import { AuthContext } from "../CreateContext.tsx";
import { User } from "@supabase/supabase-js";

export function useAuth(): { user: User | null } {
  return useContext(AuthContext);
}
