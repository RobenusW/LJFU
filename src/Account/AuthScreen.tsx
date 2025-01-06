import { useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "./supabase"; // Your initialized Supabase client

export default function AuthScreen() {
  useEffect(() => {
    // Listen for changes in auth state
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        if (session) {
          // A session exists => user is logged in
          try {
            // If not already done, you can update the user's metadata
            const { data, error } = await supabase.auth.updateUser({
              data: {
                user_metadata: { is_initiated: false },
              },
            });
            if (error) {
              console.error("Error updating user metadata:", error);
            } else {
              console.log("User metadata updated:", data);
            }
          } catch (err) {
            console.error("Unexpected error updating metadata:", err);
          }
        }
      }
    );

    // Cleanup listener on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

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
          <h2 className="text-center mb-4">Sign In</h2>

          <Auth
            supabaseClient={supabase}
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
            providers={[]}
          />
        </div>
      </div>
    </div>
  );
}
