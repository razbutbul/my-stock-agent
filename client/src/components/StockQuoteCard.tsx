import type { StockQuote } from '../types/stock';

interface StockQuoteCardProps {
  data: StockQuote;
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

export function StockQuoteCard({ data }: StockQuoteCardProps) {
  const changePrefix = data.change !== null && data.change > 0 ? '+' : '';

  return (
    <div className="status-card stock-card">
      <h2>
        {data.symbol} — {data.name}
      </h2>
      <p>
        <strong>Price:</strong> {formatNumber(data.price)} {data.currency}
      </p>
      <p>
        <strong>Change:</strong> {changePrefix}
        {formatNumber(data.change)} ({changePrefix}
        {formatNumber(data.changePercent)}%)
      </p>
      <p>
        <strong>Market state:</strong> {data.marketState}
      </p>
      <p>
        <strong>Previous close:</strong> {formatNumber(data.previousClose)}
      </p>
      <p>
        <strong>Day range:</strong> {formatNumber(data.dayLow)} –{' '}
        {formatNumber(data.dayHigh)}
      </p>
      <p>
        <strong>Volume:</strong> {formatNumber(data.volume, 0)}
      </p>
    </div>
  );
}
