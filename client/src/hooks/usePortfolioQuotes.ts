import { useEffect, useState } from 'react';
import { fetchStockQuote } from '../api/stocks';
import type { StockQuote } from '../types/stock';

interface UsePortfolioQuotesResult {
  quotes: Record<string, StockQuote>;
  loading: boolean;
  errors: Record<string, string>;
}

export function usePortfolioQuotes(symbols: string[]): UsePortfolioQuotesResult {
  const [quotes, setQuotes] = useState<Record<string, StockQuote>>({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (symbols.length === 0) {
      setQuotes({});
      setErrors({});
      return;
    }

    let cancelled = false;

    async function loadQuotes() {
      setLoading(true);

      const results = await Promise.allSettled(
        symbols.map(async (symbol) => {
          const quote = await fetchStockQuote(symbol);
          return { symbol, quote };
        }),
      );

      if (cancelled) {
        return;
      }

      const nextQuotes: Record<string, StockQuote> = {};
      const nextErrors: Record<string, string> = {};

      results.forEach((result, index) => {
        const symbol = symbols[index];

        if (result.status === 'fulfilled') {
          nextQuotes[symbol] = result.value.quote;
          return;
        }

        nextErrors[symbol] =
          result.reason instanceof Error
            ? result.reason.message
            : 'Failed to load quote';
      });

      setQuotes(nextQuotes);
      setErrors(nextErrors);
      setLoading(false);
    }

    void loadQuotes();

    return () => {
      cancelled = true;
    };
  }, [symbols.join('|')]);

  return { quotes, loading, errors };
}
