import { useState, useEffect } from "react";
import { apiFetch } from "../lib/api";

export function useAccess(token = null) {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        const params = token ? `?token=${token}` : "";
        const data = await apiFetch(`/access/verify/${params}`);
        setHasAccess(data.has_access);
      } catch {
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    check();
  }, [token]);

  return { hasAccess, loading };
}
