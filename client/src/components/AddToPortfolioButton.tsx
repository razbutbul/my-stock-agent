import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import { Alert, Button, CircularProgress, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { addFavorite, fetchFavorites } from '../api/favorites';

interface AddToPortfolioButtonProps {
  symbol: string;
}

export function AddToPortfolioButton({ symbol }: AddToPortfolioButtonProps) {
  const normalizedSymbol = symbol.trim().toUpperCase();
  const [inPortfolio, setInPortfolio] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function checkPortfolio() {
      setChecking(true);
      setMessage(null);
      setError(null);

      try {
        const favorites = await fetchFavorites();
        if (!cancelled) {
          setInPortfolio(
            favorites.some((favorite) => favorite.symbol === normalizedSymbol),
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load portfolio');
        }
      } finally {
        if (!cancelled) {
          setChecking(false);
        }
      }
    }

    void checkPortfolio();

    return () => {
      cancelled = true;
    };
  }, [normalizedSymbol]);

  const handleAdd = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      await addFavorite(normalizedSymbol);
      setInPortfolio(true);
      setMessage(`${normalizedSymbol} נוסף לתיק`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to portfolio');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <Button variant="outlined" disabled startIcon={<CircularProgress size={16} />}>
        בודק תיק...
      </Button>
    );
  }

  if (inPortfolio) {
    return (
      <Stack spacing={1} sx={{ alignItems: { xs: 'stretch', sm: 'flex-end' } }}>
        <Button
          component={RouterLink}
          to="/portfolio"
          variant="outlined"
          color="primary"
          startIcon={<CheckCircleOutlineOutlinedIcon />}
          sx={{ whiteSpace: 'nowrap' }}
        >
          בתיק — צפה
        </Button>
      </Stack>
    );
  }

  return (
    <Stack spacing={1} sx={{ alignItems: { xs: 'stretch', sm: 'flex-end' } }}>
      <Button
        variant="contained"
        color="primary"
        disabled={loading}
        startIcon={
          loading ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            <AccountBalanceWalletOutlinedIcon />
          )
        }
        onClick={() => {
          void handleAdd();
        }}
        sx={{ whiteSpace: 'nowrap' }}
      >
        הוסף לתיק
      </Button>

      {message && (
        <Alert severity="success">
          {message}.{' '}
          <RouterLink to="/portfolio" style={{ color: 'inherit', fontWeight: 600 }}>
            עבור ל-My Portfolio
          </RouterLink>
        </Alert>
      )}
      {error && <Alert severity="error">{error}</Alert>}
    </Stack>
  );
}
