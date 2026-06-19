import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import type { HotStockItem, HotStockReason, HotStocks } from '../types/stock-market';

interface HotStocksCardProps {
  data: HotStocks;
}

const REASON_LABELS: Record<HotStockReason, string> = {
  trending: 'טרנדינג',
  most_active: 'נפח גבוה',
  day_gainer: 'עלייה חדה',
};

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

function HotStockRow({ stock }: { stock: HotStockItem }) {
  const changePrefix =
    stock.changePercent !== null && stock.changePercent > 0 ? '+' : '';
  const explanation =
    stock.summary ?? stock.headline ?? 'מניה פעילה בשוק לאחרונה';

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        sx={{
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
        }}
      >
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {stock.symbol} — {stock.name}
          </Typography>
          <Stack direction="row" spacing={0.75} sx={{ mt: 0.75, flexWrap: 'wrap', gap: 0.75 }}>
            {stock.reasons.map((reason) => (
              <Chip
                key={reason}
                size="small"
                label={REASON_LABELS[reason]}
                color="warning"
                variant="outlined"
              />
            ))}
          </Stack>
        </Box>

        <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
          {getTrendIcon(stock.changePercent)}
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            ${formatNumber(stock.price)}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: getTrendColor(stock.changePercent) }}
          >
            {changePrefix}
            {formatNumber(stock.changePercent)}%
          </Typography>
        </Stack>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {explanation}
      </Typography>
    </Box>
  );
}

export function HotStocksCard({ data }: HotStocksCardProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
          <LocalFireDepartmentOutlinedIcon color="warning" fontSize="small" />
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {data.stocks.length} מניות חמות ({data.region})
          </Typography>
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {data.overview}
        </Typography>

        <Stack divider={<Divider flexItem />} spacing={2}>
          {data.stocks.map((stock) => (
            <HotStockRow key={stock.symbol} stock={stock} />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
