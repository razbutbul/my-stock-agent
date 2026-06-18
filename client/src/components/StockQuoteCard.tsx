import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import type { StockQuote } from '../types/stock';

interface StockQuoteCardProps {
  data: StockQuote;
  compact?: boolean;
}

function formatNumber(value: number | null, digits = 2): string {
  if (value === null) {
    return '—';
  }

  return value.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function getTrendIcon(change: number | null) {
  if (change === null || change === 0) {
    return <TrendingFlatIcon fontSize="small" />;
  }

  return change > 0 ? (
    <TrendingUpIcon fontSize="small" />
  ) : (
    <TrendingDownIcon fontSize="small" />
  );
}

function getTrendColor(change: number | null): 'success.main' | 'error.main' | 'text.secondary' {
  if (change === null || change === 0) {
    return 'text.secondary';
  }

  return change > 0 ? 'success.main' : 'error.main';
}

export function StockQuoteCard({ data, compact = false }: StockQuoteCardProps) {
  const changePrefix = data.change !== null && data.change > 0 ? '+' : '';

  const metrics = [
    { label: 'מחיר', value: `${formatNumber(data.price)} ${data.currency}` },
    {
      label: 'שינוי יומי',
      value: `${changePrefix}${formatNumber(data.change)} (${changePrefix}${formatNumber(data.changePercent)}%)`,
      highlight: true,
    },
    { label: 'סגירה קודמת', value: formatNumber(data.previousClose) },
    {
      label: 'טווח יומי',
      value: `${formatNumber(data.dayLow)} – ${formatNumber(data.dayHigh)}`,
    },
    { label: 'ווליום', value: formatNumber(data.volume, 0) },
  ];

  return (
    <Card variant="outlined">
      <CardContent sx={{ py: compact ? 2 : 2.5 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          sx={{
            mb: compact ? 1.5 : 2,
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
          }}
        >
          {!compact && (
            <Typography variant="h6">
              {data.symbol} — {data.name}
            </Typography>
          )}
          <Chip
            size="small"
            label={data.marketState}
            variant="outlined"
            color="info"
          />
        </Stack>

        <Grid container spacing={1.5}>
          {metrics.map((metric) => (
            <Grid key={metric.label} size={{ xs: 12, sm: compact ? 6 : 12, md: compact ? 4 : 6 }}>
              <Box
                sx={{
                  p: 1.25,
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {metric.label}
                </Typography>
                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                  {metric.highlight && getTrendIcon(data.change)}
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: metric.highlight
                        ? getTrendColor(data.change)
                        : 'text.primary',
                    }}
                  >
                    {metric.value}
                  </Typography>
                </Stack>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
