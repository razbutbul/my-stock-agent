export interface StockNewsItemDto {
  title: string;
  publisher: string | null;
  link: string | null;
  publishedAt: string | null;
  summary: string | null;
}

export interface StockNewsDto {
  symbol: string;
  articles: StockNewsItemDto[];
}
