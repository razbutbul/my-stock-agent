import { useState } from 'react';
import { analyzeStock } from '../api/agent';
import type { StockInsight } from '../types/agent';

interface UseStockAnalysisResult {
  data: StockInsight | null;
  loading: boolean;
  error: string | null;
  analyze: (symbol: string) => Promise<void>;
}

export function useStockAnalysis(): UseStockAnalysisResult {
  const [data, setData] = useState<StockInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (symbol: string) => {
    const trimmed = symbol.trim();

    if (!trimmed) {
      setError('Please enter a stock symbol');
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await analyzeStock(trimmed);
      setData(result);
    } catch (err) {
      setData(null);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, analyze };
}
