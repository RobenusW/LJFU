import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "./supabase"; // Your initialized Supabase client

export default function AuthScreen() {
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
