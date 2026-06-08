import { useState } from 'react';
import type { FormEvent } from 'react';

interface StockLookupFormProps {
  loading: boolean;
  onSubmit: (symbol: string) => void;
  submitLabel?: string;
  loadingLabel?: string;
  inputId?: string;
}

export function StockLookupForm({
  loading,
  onSubmit,
  submitLabel = 'Send',
  loadingLabel = 'Loading...',
  inputId = 'symbol',
}: StockLookupFormProps) {
  const [symbol, setSymbol] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(symbol);
  };

  return (
    <form className="stock-form" onSubmit={handleSubmit}>
      <label htmlFor={inputId}>Stock symbol</label>
      <div className="stock-form-row">
        <input
          id={inputId}
          type="text"
          value={symbol}
          onChange={(event) => setSymbol(event.target.value)}
          placeholder="e.g. AAPL"
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? loadingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}
