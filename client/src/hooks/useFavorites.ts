import { useCallback, useEffect, useState } from 'react';
import { addFavorite, fetchFavorites, removeFavorite } from '../api/favorites';
import type { Favorite } from '../types/favorite';

interface UseFavoritesResult {
  favorites: Favorite[];
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  add: (symbol: string) => Promise<void>;
  remove: (symbol: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useFavorites(): UseFavoritesResult {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);

    try {
      const result = await fetchFavorites();
      setFavorites(result);
      setError(null);
    } catch (err) {
      setFavorites([]);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const add = async (symbol: string) => {
    const trimmed = symbol.trim();

    if (!trimmed) {
      setError('נא להזין סימול מניה');
      return;
    }

    setActionLoading(true);
    setError(null);

    try {
      await addFavorite(trimmed);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setActionLoading(false);
    }
  };

  const remove = async (symbol: string) => {
    setActionLoading(true);
    setError(null);

    try {
      await removeFavorite(symbol);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setActionLoading(false);
    }
  };

  return {
    favorites,
    loading,
    actionLoading,
    error,
    add,
    remove,
    refresh,
  };
}
