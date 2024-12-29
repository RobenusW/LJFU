import NavBar from "../NavBar";
import { useLocation } from "react-router-dom";

export default function HOW() {
  const { pathname } = useLocation();
  let bulletPoints = [];

  const bulletPointsTalent = [
    "Fill out your resume (You will never have to do this again 😉)",
    "Employers will now be able to see your resume, without you applying.",
    "Employers will reach out to you if they are interested.",
    "Focus on honing your skills and let the jobs find you.",
    "You can always update your resume.",
  ];
  const bulletPointsBusiness = [
    "As soon as you sign up, look and filter through resumes you are interested in.",
    "Contact the talent you are interested in.",
    "No more waiting for talent to apply.",
    "We will notify you when we think their is talent you might want",
  ];

  if (pathname.includes("business")) {
    bulletPoints = bulletPointsBusiness;
  } else {
    bulletPoints = bulletPointsTalent;
  }

  return (
    <div className="d-flex flex-column vh-100 position-relative">
      <NavBar />
      <div className="position-absolute top-50 start-50 translate-middle text-center">
        <h1>How It Works</h1>
        <p>
          <ol>
            {bulletPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ol>
        </p>
      </div>
    </div>
  );
}
