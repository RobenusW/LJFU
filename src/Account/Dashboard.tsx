import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import NavBar from "../NavBar";
import { supabase } from "./supabaseClient";
import { Navigate } from "react-router-dom"; // Ensure this import is correct

export default function Dashboard() {
  console.log("Dashboard Rendered");

  // Rename to avoid shadowing
  const { user: authUser } = useAuth();

  // State to hold user metadata
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    // Define an async function inside useEffect
    const fetchUserMetadata = async () => {
      if (authUser) {
        try {
          const { data, error } = await supabase.auth.getUser();
          if (error) {
            console.error("Error fetching user:", error);
          } else if (data.user) {
            setMetadata(data.user.user_metadata);
          }
        } catch (err) {
          console.error("Unexpected error:", err);
        }
      }
    };

    fetchUserMetadata();
  }, [authUser]); // Re-run if authUser changes

  // If metadata is loaded and user is not initiated, navigate to /initiated
  if (metadata && !metadata.is_initiated) {
    return <Navigate to="/initiated" replace />;
  }

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
