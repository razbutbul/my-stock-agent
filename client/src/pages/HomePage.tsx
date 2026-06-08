import { StatusCard } from '../components/StatusCard';
import { StockInsightsCard } from '../components/StockInsightsCard';
import { StockLookupForm } from '../components/StockLookupForm';
import { StockQuoteCard } from '../components/StockQuoteCard';
import { useHealth } from '../hooks/useHealth';
import { useStockAnalysis } from '../hooks/useStockAnalysis';
import { useStockLookup } from '../hooks/useStockLookup';

export function HomePage() {
  const { data: health, loading: healthLoading, error: healthError } = useHealth();
  const {
    data: stock,
    loading: stockLoading,
    error: stockError,
    lookup,
  } = useStockLookup();
  const {
    data: insight,
    loading: analysisLoading,
    error: analysisError,
    analyze,
  } = useStockAnalysis();

  return (
    <main className="home-page">
      <h1>Stock Analyst Agent</h1>
      <p className="subtitle">Server connection status</p>

      {healthLoading && <p className="message loading">Loading server status...</p>}

      {healthError && (
        <p className="message error">Failed to reach server: {healthError}</p>
      )}

      {health && !healthLoading && !healthError && <StatusCard data={health} />}

      <section className="stock-section">
        <h2>Stock lookup</h2>
        <p className="subtitle">Enter a ticker symbol to fetch live data</p>

        <StockLookupForm loading={stockLoading} onSubmit={lookup} />

        {stockLoading && <p className="message loading">Fetching stock data...</p>}

        {stockError && <p className="message error">{stockError}</p>}

        {stock && !stockLoading && !stockError && <StockQuoteCard data={stock} />}
      </section>

      <section className="stock-section">
        <h2>AI stock insights</h2>
        <p className="subtitle">
          Get ChatGPT-powered analysis based on live stock data
        </p>

        <StockLookupForm
          loading={analysisLoading}
          onSubmit={analyze}
          submitLabel="Analyze"
          loadingLabel="Analyzing..."
          inputId="analysis-symbol"
        />

        {analysisLoading && (
          <p className="message loading">Generating insights with ChatGPT...</p>
        )}

        {analysisError && <p className="message error">{analysisError}</p>}

        {insight && !analysisLoading && !analysisError && (
          <StockInsightsCard data={insight} />
        )}
      </section>
    </main>
  );
}
