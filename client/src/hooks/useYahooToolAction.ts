import { useState } from 'react';

interface UseYahooToolActionResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
}

export function useYahooToolAction<T>(
  fetcher: () => Promise<T>,
): UseYahooToolActionResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setData(null);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetch };
}
