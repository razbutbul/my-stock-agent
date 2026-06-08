import { useEffect, useState } from 'react';
import { fetchHealth } from '../api/health';
import type { HealthResponse } from '../types/health';

interface UseHealthResult {
  data: HealthResponse | null;
  loading: boolean;
  error: string | null;
}

export function useHealth(): UseHealthResult {
  const [data, setData] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadHealth() {
      try {
        const result = await fetchHealth();
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          setData(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadHealth();

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}
