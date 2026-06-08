import { API_BASE_URL } from './config';
import type { StockInsight } from '../types/agent';

export async function analyzeStock(symbol: string): Promise<StockInsight> {
  const response = await fetch(`${API_BASE_URL}/agent/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symbol: symbol.trim().toUpperCase() }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string | string[];
    } | null;
    const message = Array.isArray(body?.message)
      ? body.message.join(', ')
      : body?.message;

    throw new Error(message ?? `Stock analysis failed (${response.status})`);
  }

  return response.json() as Promise<StockInsight>;
}
