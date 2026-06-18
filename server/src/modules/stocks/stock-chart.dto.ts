export interface StockCandleDto {
  date: string;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
  volume: number | null;
}

export interface StockChartSummaryDto {
  candlesCount: number;
  periodHigh: number | null;
  periodLow: number | null;
  periodChangePercent: number | null;
  averageVolume: number | null;
  lastClose: number | null;
}

export interface StockChartTimeframeDto {
  interval: '1d' | '1wk';
  candles: StockCandleDto[];
  summary: StockChartSummaryDto;
}

export interface StockChartDto {
  symbol: string;
  currency: string;
  fiftyTwoWeekHigh: number | null;
  fiftyTwoWeekLow: number | null;
  daily: StockChartTimeframeDto;
  weekly: StockChartTimeframeDto;
}
