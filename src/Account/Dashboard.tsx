import { useAuth } from "../hooks/useAuth";
import NavBar from "../NavBar";

export default function Dashboard() {
  const { user: authUser } = useAuth();
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
