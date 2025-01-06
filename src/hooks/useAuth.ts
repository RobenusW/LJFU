import { useContext } from "react";
import { AuthContext } from "../CreateContext";

export function useAuth() {
  return useContext(AuthContext);
}
