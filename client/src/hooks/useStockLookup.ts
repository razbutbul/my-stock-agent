import { useState } from 'react';
import { fetchStockQuote } from '../api/stocks';
import type { StockQuote } from '../types/stock';

interface UseStockLookupResult {
  data: StockQuote | null;
  loading: boolean;
  error: string | null;
  lookup: (symbol: string) => Promise<void>;
}

export function useStockLookup(): UseStockLookupResult {
  const [data, setData] = useState<StockQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookup = async (symbol: string) => {
    const trimmed = symbol.trim();

    if (!trimmed) {
      setError('Please enter a stock symbol');
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchStockQuote(trimmed);
      setData(result);
    } catch (err) {
      setData(null);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, lookup };
}
