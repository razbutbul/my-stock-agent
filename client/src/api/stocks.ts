import { API_BASE_URL } from './config';
import type { StockQuote } from '../types/stock';

export async function fetchStock(symbol: string): Promise<StockQuote> {
  const encodedSymbol = encodeURIComponent(symbol.trim().toUpperCase());
  const response = await fetch(`${API_BASE_URL}/stocks/${encodedSymbol}`);

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string | string[];
    } | null;
    const message = Array.isArray(body?.message)
      ? body.message.join(', ')
      : body?.message;

    throw new Error(message ?? `Stock lookup failed (${response.status})`);
  }

  return response.json() as Promise<StockQuote>;
}
