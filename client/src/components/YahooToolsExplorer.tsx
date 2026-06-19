import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import { Box, Paper, Stack, Typography } from "@mui/material";
import {
  // fetchStockChart,
  // fetchStockCompetitors,
  // fetchStockFinancials,
  // fetchStockFundamentals,
  // fetchStockNews,
  fetchHotStocks,
  fetchStockQuote,
} from "../api/stocks";
import { useYahooToolAction } from "../hooks/useYahooToolAction";
import { useYahooToolFetch } from "../hooks/useYahooToolFetch";
// import { JsonDataCard } from "./JsonDataCard";
import { HotStocksCard } from "./HotStocksCard";
import { StockQuoteCard } from "./StockQuoteCard";
import { YahooToolSection } from "./YahooToolSection";

export function YahooToolsExplorer() {
  const quote = useYahooToolFetch(fetchStockQuote);
  const hotStocks = useYahooToolAction(fetchHotStocks);
  // const chart = useYahooToolFetch(fetchStockChart);
  // const fundamentals = useYahooToolFetch(fetchStockFundamentals);
  // const financials = useYahooToolFetch(fetchStockFinancials);
  // const news = useYahooToolFetch(fetchStockNews);
  // const competitors = useYahooToolFetch(fetchStockCompetitors);

  return (
    <Paper sx={{ p: { xs: 2, md: 3 } }}>
      <Stack spacing={2.5}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <StorageOutlinedIcon color="primary" />
          <Box>
            <Typography variant="h6">בדיקת נתונים</Typography>
            <Typography variant="body2" color="text.secondary">
              שליפת נתוני מניות{" "}
            </Typography>
          </Box>
        </Stack>

        <YahooToolSection
          toolName="get_hot_stocks"
          title="מניות חמות"
          description="מניות פעילות מהימים האחרונים — טרנדינג, נפח מסחר גבוה ועליות יומיות, עם הסבר קצר מחדשות"
          submitLabel="שלוף מניות חמות"
          loadingLabel="שולף..."
          requiresSymbol={false}
          loading={hotStocks.loading}
          error={hotStocks.error}
          onSubmit={hotStocks.fetch}
        >
          {hotStocks.data && <HotStocksCard data={hotStocks.data} />}
        </YahooToolSection>

        <YahooToolSection
          toolName="get_stock_quote"
          title="מחיר חי"
          description="מחיר נוכחי, שינוי יומי, volume, טווח יומי ומצב שוק"
          submitLabel="שלוף מחיר"
          loadingLabel="שולף..."
          inputId="yahoo-quote-symbol"
          loading={quote.loading}
          error={quote.error}
          onSubmit={quote.fetch}
        >
          {quote.data && <StockQuoteCard data={quote.data} />}
        </YahooToolSection>

        {/* <YahooToolSection
          toolName="get_stock_chart"
          title="נרות ומומנטום"
          description="60 נרות יומיים, 26 שבועיים, סיכום מגמה ו-52 שבוע"
          submitLabel="שלוף נרות"
          loadingLabel="שולף..."
          inputId="yahoo-chart-symbol"
          loading={chart.loading}
          error={chart.error}
          onSubmit={chart.fetch}
        >
          {chart.data && <JsonDataCard data={chart.data} />}
        </YahooToolSection>

        <YahooToolSection
          toolName="get_stock_fundamentals"
          title="פונדמנטלים ו-valuation"
          description="סקטור, שוליים, PE, הכנסות, חוב, יעדי אנליסטים ו-earnings"
          submitLabel="שלוף פונדמנטלים"
          loadingLabel="שולף..."
          inputId="yahoo-fundamentals-symbol"
          loading={fundamentals.loading}
          error={fundamentals.error}
          onSubmit={fundamentals.fetch}
        >
          {fundamentals.data && <JsonDataCard data={fundamentals.data} />}
        </YahooToolSection>

        <YahooToolSection
          toolName="get_stock_financials"
          title="היסטוריה פיננסית"
          description="עד 12 רבעונים: SEC EDGAR להיסטוריה + Yahoo ל-FCF ונתונים עדכניים"
          submitLabel="שלוף פיננסים"
          loadingLabel="שולף..."
          inputId="yahoo-financials-symbol"
          loading={financials.loading}
          error={financials.error}
          onSubmit={financials.fetch}
        >
          {financials.data && <JsonDataCard data={financials.data} />}
        </YahooToolSection>

        <YahooToolSection
          toolName="get_stock_news"
          title="חדשות וקטליזטורים"
          description="15 כתבות אחרונות — חוזים, שותפויות, earnings ועוד"
          submitLabel="שלוף חדשות"
          loadingLabel="שולף..."
          inputId="yahoo-news-symbol"
          loading={news.loading}
          error={news.error}
          onSubmit={news.fetch}
        >
          {news.data && <JsonDataCard data={news.data} />}
        </YahooToolSection>

        <YahooToolSection
          toolName="get_stock_competitors"
          title="מתחרות מובילות"
          description="מניות דומות לפי Yahoo recommendations"
          submitLabel="שלוף מתחרות"
          loadingLabel="שולף..."
          inputId="yahoo-competitors-symbol"
          loading={competitors.loading}
          error={competitors.error}
          onSubmit={competitors.fetch}
        >
          {competitors.data && <JsonDataCard data={competitors.data} />}
        </YahooToolSection> */}
      </Stack>
    </Paper>
  );
}
