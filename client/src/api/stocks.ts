import { API_BASE_URL } from './config';
import type {
  StockChart,
  StockCompetitors,
  StockFinancials,
  StockFundamentals,
  StockNews,
  StockQuote,
} from '../types/stock-market';

async function fetchStockResource<T>(symbol: string, path = ''): Promise<T> {
  const encodedSymbol = encodeURIComponent(symbol.trim().toUpperCase());
  const suffix = path ? `/${path}` : '';
  const response = await fetch(`${API_BASE_URL}/stocks/${encodedSymbol}${suffix}`);

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string | string[];
    } | null;
    const message = Array.isArray(body?.message)
      ? body.message.join(', ')
      : body?.message;

    throw new Error(message ?? `Stock request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}

export function fetchStockQuote(symbol: string): Promise<StockQuote> {
  return fetchStockResource<StockQuote>(symbol);
}

export function fetchStockChart(symbol: string): Promise<StockChart> {
  return fetchStockResource<StockChart>(symbol, 'chart');
}

export function fetchStockFundamentals(symbol: string): Promise<StockFundamentals> {
  return fetchStockResource<StockFundamentals>(symbol, 'fundamentals');
}

export function fetchStockFinancials(symbol: string): Promise<StockFinancials> {
  return fetchStockResource<StockFinancials>(symbol, 'financials');
}

export function fetchStockNews(symbol: string): Promise<StockNews> {
  return fetchStockResource<StockNews>(symbol, 'news');
}

export function fetchStockCompetitors(symbol: string): Promise<StockCompetitors> {
  return fetchStockResource<StockCompetitors>(symbol, 'competitors');
}
