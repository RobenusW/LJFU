import { useState, useEffect } from "react";

interface University {
  name: string;
  country: string;
  alpha_two_code: string;
  web_pages: string[];
  domains: string[];
}

export const useUniversitySearch = (query: string, country?: string) => {
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
        // Split search terms and create individual searches
        const searchTerms = query
          .toLowerCase()
          .split(" ")
          .filter((term) => term.length > 0);
        const baseUrl = "http://universities.hipolabs.com/search";

        // Search for each term individually
        const searchPromises = searchTerms.map((term) => {
          const params = new URLSearchParams({
            name: term,
          });

          if (country) {
            params.append("country", country);
          }

          return fetch(`${baseUrl}?${params.toString()}`).then((res) =>
            res.json()
          );
        });

        const results = await Promise.all(searchPromises);

        // Combine and deduplicate results
        const combinedResults = results.flat();
        const uniqueUniversities = Array.from(
          new Map(combinedResults.map((uni) => [uni.name, uni])).values()
        );

        setUniversities(uniqueUniversities);
      } catch (err) {
        setError("Failed to fetch universities");
        console.error("Error fetching universities:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, [query, country]);

  return { universities, loading, error };
};
