import { useState } from 'react';

interface UseYahooToolFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  fetch: (symbol: string) => Promise<void>;
}

export function useYahooToolFetch<T>(
  fetcher: (symbol: string) => Promise<T>,
): UseYahooToolFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = async (symbol: string) => {
    const trimmed = symbol.trim();

    if (!trimmed) {
      setError('יש להזין סימול מניה');
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetcher(trimmed);
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
