import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined';
import { Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

export type PortfolioViewMode = 'detailed' | 'compact';

interface PortfolioViewToggleProps {
  value: PortfolioViewMode;
  onChange: (value: PortfolioViewMode) => void;
}

export function PortfolioViewToggle({ value, onChange }: PortfolioViewToggleProps) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1}
      sx={{ alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between' }}
    >
      <Typography variant="subtitle1" color="text.secondary">
        תצוגה
      </Typography>

      <ToggleButtonGroup
        value={value}
        exclusive
        size="small"
        aria-label="בחירת תצוגת תיק"
        onChange={(_event, nextValue: PortfolioViewMode | null) => {
          if (nextValue) {
            onChange(nextValue);
          }
        }}
        sx={{
          '& .MuiToggleButton-root': {
            px: 1.5,
            gap: 1,
          },
        }}
      >
        <ToggleButton value="detailed" aria-label="תצוגה מפורטת">
          <ViewListOutlinedIcon fontSize="small" />
          מפורט
        </ToggleButton>
        <ToggleButton value="compact" aria-label="תצוגת קוביות">
          <GridViewOutlinedIcon fontSize="small" />
          קוביות
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );
}
