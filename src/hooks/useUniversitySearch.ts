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

        // Combine and filter results
        const allUniversities = results.flat();
        const uniqueUniversities = Array.from(
          new Set(allUniversities.map((uni) => uni.name))
        )
          .map((name) => allUniversities.find((uni) => uni.name === name))
          .filter((uni): uni is University => uni !== undefined)
          .filter((uni) => {
            const uniName = uni.name.toLowerCase();
            return searchTerms.every((term) => uniName.includes(term));
          });

        setUniversities(uniqueUniversities);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setUniversities([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimeout = setTimeout(fetchUniversities, 300);

    return () => clearTimeout(debounceTimeout);
  }, [query, country]);

  return { universities, loading, error };
};
