import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "./supabase.ts";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AuthScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const [view, setView] = useState<"sign_in" | "sign_up">("sign_in");

  useEffect(() => {
    // Set initial view based on URL
    setView(location.pathname === "/signup" ? "sign_up" : "sign_in");
  }, [location.pathname]);

  useEffect(() => {
    // Handle email confirmation
    const handleAuthChange = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        // Check if this is right after email confirmation
        const confirmationHash = window.location.hash;
        if (confirmationHash.includes("confirmation")) {
          navigate("/signin", { replace: true });
        }
      }
    });

    return () => {
      handleAuthChange.data.subscription.unsubscribe();
    };
  }, [navigate]);

  console.log("View:", view);

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "#fff",
      }}
    >
      <div>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "22rem",
            backgroundColor: "#fff",
          }}
          className="card p-4 shadow"
        >
          <h2 className="text-center mb-4">
            {view === "sign_up" ? "Sign Up" : "Sign In"}
          </h2>

          <Auth
            supabaseClient={supabase}
            view={view}
            appearance={{
              theme: ThemeSupa,
              style: {
                button: {
                  background: "#000",
                  color: "#fff",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  marginRight: "16px",
                },
              },
            }}
            localization={{
              variables: {
                sign_in: {
                  email_label: "Email",
                  password_label: "Password",
                },
                sign_up: {
                  email_label: "Email",
                  password_label: "Password",
                },
              },
            }}
            providers={["google"]}
          />
        </div>
      </div>
    </div>
  );
}
