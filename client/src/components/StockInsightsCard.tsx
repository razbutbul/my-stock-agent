import type { StockInsight } from '../types/agent';

interface StockInsightsCardProps {
  data: StockInsight;
}

export function StockInsightsCard({ data }: StockInsightsCardProps) {
  return (
    <div className="status-card insights-card">
      <h2>
        {data.symbol} — {data.name}
      </h2>

      {data.toolsUsed.length > 0 && (
        <p className="tools-used">
          <strong>Tools used:</strong> {data.toolsUsed.join(', ')}
        </p>
      )}

      <p className="insights-text">{data.insights}</p>
    </div>
  );
}
