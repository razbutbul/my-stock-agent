import type { ReactNode } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { Alert, Box, Button, CircularProgress, LinearProgress, Stack, Typography } from '@mui/material';
import { StockLookupForm } from './StockLookupForm';

interface YahooToolSectionBaseProps {
  toolName: string;
  title: string;
  description: string;
  submitLabel: string;
  loadingLabel: string;
  loading: boolean;
  error: string | null;
  children?: ReactNode;
}

interface YahooToolSymbolSectionProps extends YahooToolSectionBaseProps {
  requiresSymbol?: true;
  inputId: string;
  onSubmit: (symbol: string) => void;
}

interface YahooToolActionSectionProps extends YahooToolSectionBaseProps {
  requiresSymbol: false;
  onSubmit: () => void;
}

type YahooToolSectionProps =
  | YahooToolSymbolSectionProps
  | YahooToolActionSectionProps;

export function YahooToolSection(props: YahooToolSectionProps) {
  const {
    toolName,
    title,
    description,
    submitLabel,
    loadingLabel,
    loading,
    error,
    onSubmit,
    children,
  } = props;
  const requiresSymbol = props.requiresSymbol !== false;

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        border: '1px solid rgba(255,255,255,0.08)',
        bgcolor: 'rgba(255,255,255,0.02)',
      }}
    >
      <Stack spacing={1.5}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography variant="caption" color="primary.main" sx={{ display: 'block', mb: 0.5 }}>
            {toolName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>

        {requiresSymbol ? (
          <StockLookupForm
            loading={loading}
            onSubmit={onSubmit as (symbol: string) => void}
            submitLabel={submitLabel}
            loadingLabel={loadingLabel}
            inputId={props.inputId}
          />
        ) : (
          <Button
            variant="contained"
            size="large"
            disabled={loading}
            onClick={() => {
              (onSubmit as () => void)();
            }}
            startIcon={
              loading ? <CircularProgress size={18} color="inherit" /> : <SearchIcon />
            }
            sx={{ alignSelf: 'flex-start', px: 3 }}
          >
            {loading ? loadingLabel : submitLabel}
          </Button>
        )}

        {loading && <LinearProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        {children}
      </Stack>
    </Box>
  );
}
