import { useState, useEffect } from "react";
import { apiFetch } from "../lib/api";

export function useGames(token = null) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const params = token ? `?token=${token}` : "";
        const data = await apiFetch(`/games/${params}`);
        setGames(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [token]);

  return { games, loading, error };
}
