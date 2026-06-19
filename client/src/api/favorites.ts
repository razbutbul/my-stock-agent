import { API_BASE_URL } from './config';
import type { Favorite } from '../types/favorite';

async function parseError(response: Response): Promise<string> {
  const body = (await response.json().catch(() => null)) as {
    message?: string | string[];
  } | null;
  const message = Array.isArray(body?.message)
    ? body.message.join(', ')
    : body?.message;

  return message ?? `Request failed (${response.status})`;
}

export async function fetchFavorites(): Promise<Favorite[]> {
  const response = await fetch(`${API_BASE_URL}/favorites`);

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json() as Promise<Favorite[]>;
}

export async function addFavorite(symbol: string): Promise<Favorite> {
  const response = await fetch(`${API_BASE_URL}/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symbol: symbol.trim().toUpperCase() }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json() as Promise<Favorite>;
}

export async function removeFavorite(symbol: string): Promise<void> {
  const encodedSymbol = encodeURIComponent(symbol.trim().toUpperCase());
  const response = await fetch(`${API_BASE_URL}/favorites/${encodedSymbol}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }
}
