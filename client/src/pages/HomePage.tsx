import AutoGraphOutlinedIcon from "@mui/icons-material/AutoGraphOutlined";
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined";
import {
  Alert,
  AppBar,
  Box,
  Container,
  LinearProgress,
  Link,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { StatusCard } from "../components/StatusCard";
import { StockInsightsCard } from "../components/StockInsightsCard";
import { StockLookupForm } from "../components/StockLookupForm";
import { YahooToolsExplorer } from "../components/YahooToolsExplorer";
import { useHealth } from "../hooks/useHealth";
import { useStockAnalysis } from "../hooks/useStockAnalysis";

export function HomePage() {
  const {
    data: health,
    loading: healthLoading,
    error: healthError,
  } = useHealth();
  const {
    data: insight,
    loading: analysisLoading,
    error: analysisError,
    analyze,
  } = useStockAnalysis();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="sticky" elevation={0} color="transparent">
        <Toolbar sx={{ borderBottom: 1, borderColor: "divider" }}>
          <AutoGraphOutlinedIcon color="primary" sx={{ ml: 1 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6">Smart Stock Insight Agent</Typography>
            <Typography variant="caption" color="text.secondary">
              Developed by{" "}
              <Link
                href="https://www.linkedin.com/in/raz-butbul-07b465259/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "primary.main",
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                  "&:hover": {
                    color: "primary.light",
                    textDecoration: "none",
                  },
                }}
              >
                Raz Butbul
              </Link>
            </Typography>
          </Box>
          {!healthLoading && !healthError && health && (
            <StatusCard data={health} />
          )}
          {healthError && (
            <Typography variant="caption" color="error.main">
              שרת לא זמין
            </Typography>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        <Stack spacing={3}>
          <Paper sx={{ p: { xs: 2, md: 3 } }}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
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
      </Container>
    </Box>
  );
}
