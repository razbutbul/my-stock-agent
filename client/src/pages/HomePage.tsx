import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined";
import {
  Alert,
  Box,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { StockInsightsCard } from "../components/StockInsightsCard";
import { StockLookupForm } from "../components/StockLookupForm";
import { useStockAnalysis } from "../hooks/useStockAnalysis";
import { YahooToolsExplorer } from "../components/YahooToolsExplorer";

export function HomePage() {
  const {
    data: insight,
    loading: analysisLoading,
    error: analysisError,
    analyze,
  } = useStockAnalysis();

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <QueryStatsOutlinedIcon color="primary" />
            <Box>
              <Typography variant="h5">ניתוח הזדמנות</Typography>
              <Typography variant="body2" color="text.secondary">
                הזן סימול מניה לקבלת הערכה מובנית: נרות ומומנטום, חדשות,
                פוטנציאל עסקי, חוזים, מנועי צמיחה, מתחרות, סיכונים והחלטות
              </Typography>
            </Box>
          </Stack>

          <StockLookupForm
            loading={analysisLoading}
            onSubmit={analyze}
            submitLabel="נתח מניה"
            loadingLabel="מנתח..."
            inputId="analysis-symbol"
          />

          {analysisLoading && <LinearProgress />}
          {analysisError && <Alert severity="error">{analysisError}</Alert>}
        </Stack>
      </Paper>

      {insight && !analysisLoading && !analysisError && (
        <StockInsightsCard data={insight} />
      )}
      <YahooToolsExplorer />
    </Stack>
  );
}
