import { useState, useEffect } from "react";
import { University } from "../Account/Talent/Interfaces/UniversityInterface";

const Northeastern: University = {
  name: "Northeastern University",
  country: "United States",
  alpha_two_code: "US",
  web_pages: ["https://www.neu.edu/"],
  domains: ["neu.edu"],
};
const allowedCountries = ["United States"];

export const useUniversitySearch = (query: string) => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUniversities = async () => {
      if (!query || query.length < 2) {
        setUniversities([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const baseUrl = "https://universities.hipolabs.com/search";

        const params = new URLSearchParams({
          name: query.toLowerCase(),
        });

        const response = await fetch(`${baseUrl}?${params.toString()}`);

        const data = await response.json();

        // Filter by allowed countries
        const filteredUniversities = data.filter((uni: University) =>
          allowedCountries.includes(uni.country)
        );

        setUniversities([...filteredUniversities, Northeastern]);
      } catch (err) {
        setError("Failed to fetch universities");
        console.error("Error fetching universities:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, [query]);

  return { universities, loading, error };
};
