import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import {
  Box,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Typography,
} from '@mui/material';
import type { Favorite } from '../types/favorite';
import type { StockQuote } from '../types/stock';

interface PortfolioCompactGridProps {
  favorites: Favorite[];
  quotes: Record<string, StockQuote>;
  quoteErrors: Record<string, string>;
  quotesLoading: boolean;
  actionLoading: boolean;
  onRemove: (symbol: string) => void;
}

function formatPrice(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return '—';
  }

  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getPriceColor(change: number | null | undefined): string {
  if (change === null || change === undefined || change === 0) {
    return 'text.secondary';
  }

  return change > 0 ? 'success.main' : 'error.main';
}

export function PortfolioCompactGrid({
  favorites,
  quotes,
  quoteErrors,
  quotesLoading,
  actionLoading,
  onRemove,
}: PortfolioCompactGridProps) {
  return (
    <Grid container spacing={1.5}>
      {favorites.map((favorite) => {
        const quote = quotes[favorite.symbol];
        const quoteError = quoteErrors[favorite.symbol];
        const priceColor = getPriceColor(quote?.change);

        return (
          <Grid key={favorite.id} size={{ xs: 6, sm: 4, md: 3 }}>
            <Paper
              sx={{
                p: 1.5,
                height: '100%',
                minHeight: 96,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                textAlign: 'center',
              }}
            >
              <IconButton
                size="small"
                aria-label={`הסר ${favorite.symbol} מהתיק`}
                disabled={actionLoading}
                onClick={() => onRemove(favorite.symbol)}
                sx={{
                  position: 'absolute',
                  top: 4,
                  insetInlineStart: 4,
                  color: 'text.secondary',
                  '&:hover': { color: 'error.main' },
                }}
              >
                <DeleteOutlinedIcon fontSize="small" />
              </IconButton>

              <Typography variant="subtitle1" sx={{ mb: 0.5, fontWeight: 700 }}>
                {favorite.symbol}
              </Typography>

              {quoteError && (
                <Typography variant="caption" color="warning.main">
                  שגיאה
                </Typography>
              )}

              {!quoteError && quote && (
                <Typography
                  variant="h6"
                  sx={{ color: priceColor, lineHeight: 1.2, fontWeight: 700 }}
                >
                  {formatPrice(quote.price)}
                </Typography>
              )}

              {!quoteError && !quote && quotesLoading && (
                <Box sx={{ width: '70%', mt: 0.5 }}>
                  <LinearProgress />
                </Box>
              )}

              {!quoteError && !quote && !quotesLoading && (
                <Typography variant="body2" color="text.secondary">
                  —
                </Typography>
              )}
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
}
