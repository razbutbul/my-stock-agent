import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import { Chip, Stack, Typography } from '@mui/material';
import type { HealthResponse } from '../types/health';

interface StatusCardProps {
  data: HealthResponse;
}

export function StatusCard({ data }: StatusCardProps) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
      <Chip
        icon={<CheckCircleOutlineOutlinedIcon />}
        label={data.status}
        color="success"
        size="small"
        variant="outlined"
      />
      <Typography variant="body2" color="text.secondary">
        {data.service}
      </Typography>
    </Stack>
  );
}
