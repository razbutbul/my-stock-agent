import AddIcon from '@mui/icons-material/Add';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import {
  Alert,
  Box,
  Button,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { StockLookupForm } from '../components/StockLookupForm';
import { StockQuoteCard } from '../components/StockQuoteCard';
import { useFavorites } from '../hooks/useFavorites';
import { usePortfolioQuotes } from '../hooks/usePortfolioQuotes';

function formatAddedAt(value: string): string {
  return new Date(value).toLocaleString('he-IL', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function PortfolioPage() {
  const {
    favorites,
    loading: favoritesLoading,
    actionLoading,
    error,
    add,
    remove,
  } = useFavorites();

  const symbols = favorites.map((favorite) => favorite.symbol);
  const {
    quotes,
    loading: quotesLoading,
    errors: quoteErrors,
  } = usePortfolioQuotes(symbols);

  const isLoading = favoritesLoading || quotesLoading || actionLoading;

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <AccountBalanceWalletOutlinedIcon color="primary" />
            <Box>
              <Typography variant="h5">My Portfolio</Typography>
              <Typography variant="body2" color="text.secondary">
                המניות המועדפות שלך — מחירים בזמן אמת מ-Yahoo Finance
              </Typography>
            </Box>
          </Stack>

          <StockLookupForm
            loading={actionLoading}
            onSubmit={(symbol) => {
              void add(symbol);
            }}
            submitLabel="הוסף לתיק"
            loadingLabel="מוסיף..."
            inputId="portfolio-symbol"
          />

          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </Paper>

      {favoritesLoading && <LinearProgress />}

      {!favoritesLoading && favorites.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <AddIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
          <Typography variant="h6" gutterBottom>
            התיק שלך ריק
          </Typography>
          <Typography variant="body2" color="text.secondary">
            הוסף מניות מועדפות באמצעות הסימול למעלה, למשל AAPL או NVDA
          </Typography>
        </Paper>
      )}

      {!favoritesLoading && favorites.length > 0 && (
        <Stack spacing={2}>
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Typography variant="subtitle1" color="text.secondary">
              {favorites.length} מניות בתיק
            </Typography>
            {quotesLoading && <LinearProgress sx={{ flex: 1, maxWidth: 200 }} />}
          </Stack>

          {favorites.map((favorite) => {
            const quote = quotes[favorite.symbol];
            const quoteError = quoteErrors[favorite.symbol];

            return (
              <Paper key={favorite.id} sx={{ p: { xs: 2, md: 2.5 } }}>
                <Stack spacing={2}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1}
                    sx={{ alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between' }}
                  >
                    <Box>
                      <Typography variant="h6">{favorite.symbol}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        נוסף ב-{formatAddedAt(favorite.addedAt)}
                      </Typography>
                    </Box>

                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteOutlinedIcon />}
                      disabled={isLoading}
                      onClick={() => {
                        void remove(favorite.symbol);
                      }}
                    >
                      הסר מהתיק
                    </Button>
                  </Stack>

                  {quoteError && <Alert severity="warning">{quoteError}</Alert>}

                  {quote && <StockQuoteCard data={quote} compact />}

                  {!quote && !quoteError && quotesLoading && <LinearProgress />}
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
}
