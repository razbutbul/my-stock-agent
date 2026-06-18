export interface StockCompetitorDto {
  symbol: string;
  similarityScore: number;
}

export interface StockCompetitorsDto {
  symbol: string;
  competitors: StockCompetitorDto[];
}
