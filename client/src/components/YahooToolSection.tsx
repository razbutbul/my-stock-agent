import type { ReactNode } from 'react';
import { Alert, Box, LinearProgress, Stack, Typography } from '@mui/material';
import { StockLookupForm } from './StockLookupForm';

interface YahooToolSectionProps {
  toolName: string;
  title: string;
  description: string;
  submitLabel: string;
  loadingLabel: string;
  inputId: string;
  loading: boolean;
  error: string | null;
  onSubmit: (symbol: string) => void;
  children?: ReactNode;
}

export function YahooToolSection({
  toolName,
  title,
  description,
  submitLabel,
  loadingLabel,
  inputId,
  loading,
  error,
  onSubmit,
  children,
}: YahooToolSectionProps) {
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

        <StockLookupForm
          loading={loading}
          onSubmit={onSubmit}
          submitLabel={submitLabel}
          loadingLabel={loadingLabel}
          inputId={inputId}
        />

        {loading && <LinearProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        {children}
      </Stack>
    </Box>
  );
}
