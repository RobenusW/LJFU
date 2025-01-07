import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import NavBar from "../NavBar";
import { supabase } from "./supabase";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  console.log("Dashboard Rendered");

  // Rename to avoid shadowing
  const { user: authUser } = useAuth();
  // State to hold user metadata
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserMetadata = async () => {
      if (authUser) {
        try {
          const { data, error } = await supabase.auth.getUser();
          if (error) {
            console.error("Error fetching user:", error);
          } else if (data.user) {
            if (data.user.user_metadata === null) {
              throw new Error("User metadata is null");
            } else if (data.user.user_metadata.is_initiated === false) {
              console.log("User is not initiated, navigating to /initiated");
              navigate("/initiated", { replace: true });
            }
          }
        } catch (err) {
          console.error("Unexpected error:", err);
        }
      }
    };

    fetchUserMetadata();
  }, [authUser, navigate]); // Re-run if authUser changes

  // Render the dashboard if everything is fine
  return (
    <div>
      <nav>
        <NavBar />
      </nav>
      <div>{authUser && <p>Logged in as: {authUser.email}</p>}</div>
    </div>
  );
}
