import SearchIcon from '@mui/icons-material/Search';
import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import type { FormEvent } from 'react';

interface StockLookupFormProps {
  loading: boolean;
  onSubmit: (symbol: string) => void;
  submitLabel?: string;
  loadingLabel?: string;
  inputId?: string;
}

export function StockLookupForm({
  loading,
  onSubmit,
  submitLabel = 'שלח',
  loadingLabel = 'טוען...',
  inputId = 'symbol',
}: StockLookupFormProps) {
  const [symbol, setSymbol] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(symbol);
  };

  return (
    <Stack
      component="form"
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1.5}
      onSubmit={handleSubmit}
    >
      <TextField
        id={inputId}
        label="סימול מניה"
        placeholder="לדוגמה: AAPL, NVDA, TSLA"
        value={symbol}
        onChange={(event) => setSymbol(event.target.value.toUpperCase())}
        disabled={loading}
        fullWidth
        slotProps={{
          htmlInput: { style: { textTransform: 'uppercase' } },
        }}
      />
      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={loading}
        startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SearchIcon />}
        sx={{ minWidth: { sm: 180 }, px: 3, whiteSpace: 'nowrap' }}
      >
        {loading ? loadingLabel : submitLabel}
      </Button>
    </Stack>
  );
}
