export type HotStockReason =
  | 'trending'
  | 'most_active'
  | 'day_gainer';

export interface HotStockItemDto {
  symbol: string;
  name: string;
  price: number | null;
  changePercent: number | null;
  volume: number | null;
  reasons: HotStockReason[];
  headline: string | null;
  summary: string | null;
}

export interface HotStocksDto {
  region: string;
  updatedAt: string;
  overview: string;
  stocks: HotStockItemDto[];
}
