import { createContext } from "react";
import { User } from "@supabase/supabase-js";

export const AuthContext = createContext<{ user: User | null }>({
  user: null,
});
