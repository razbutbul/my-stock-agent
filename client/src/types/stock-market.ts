import type { StockQuote } from './stock';

export type { StockQuote };

export interface StockCandle {
  date: string;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
  volume: number | null;
}

export interface StockChart {
  symbol: string;
  currency: string;
  fiftyTwoWeekHigh: number | null;
  fiftyTwoWeekLow: number | null;
  daily: {
    interval: '1d';
    candles: StockCandle[];
    summary: {
      candlesCount: number;
      periodHigh: number | null;
      periodLow: number | null;
      periodChangePercent: number | null;
      averageVolume: number | null;
      lastClose: number | null;
    };
  };
  weekly: {
    interval: '1wk';
    candles: StockCandle[];
    summary: {
      candlesCount: number;
      periodHigh: number | null;
      periodLow: number | null;
      periodChangePercent: number | null;
      averageVolume: number | null;
      lastClose: number | null;
    };
  };
}

export interface StockFundamentals {
  symbol: string;
  name: string;
  sector: string | null;
  industry: string | null;
  country: string | null;
  employees: number | null;
  businessSummary: string | null;
  marketCap: number | null;
  enterpriseValue: number | null;
  trailingPe: number | null;
  forwardPe: number | null;
  pegRatio: number | null;
  priceToBook: number | null;
  beta: number | null;
  fiftyTwoWeekChangePercent: number | null;
  profitMargin: number | null;
  revenue: number | null;
  revenueGrowth: number | null;
  grossMargin: number | null;
  operatingMargin: number | null;
  ebitda: number | null;
  freeCashflow: number | null;
  debtToEquity: number | null;
  currentRatio: number | null;
  analystRecommendation: string | null;
  analystTargetMean: number | null;
  analystTargetHigh: number | null;
  analystTargetLow: number | null;
  analystCount: number | null;
  earningsGrowth: number | null;
  nextEarningsDate: string | null;
  exDividendDate: string | null;
  recommendationTrend: unknown;
  recentUpgradesDowngrades: Array<{
    firm: string;
    toGrade: string;
    fromGrade: string | null;
    action: string;
    date: string;
  }>;
  earningsTrend: unknown;
}

export interface StockFinancials {
  symbol: string;
  quartersAvailable: number;
  maxQuartersRequested: number;
  dataSources: Array<'yahoo' | 'sec'>;
  dataNote: string;
  quarterly: Array<{
    date: string;
    totalRevenue: number | null;
    netIncome: number | null;
    operatingIncome: number | null;
    grossProfit: number | null;
    freeCashFlow: number | null;
    totalAssets: number | null;
    totalDebt: number | null;
  }>;
  revenueGrowthYoY: number | null;
  netIncomeGrowthYoY: number | null;
}

export interface StockNews {
  symbol: string;
  articles: Array<{
    title: string;
    publisher: string | null;
    link: string | null;
    publishedAt: string | null;
    summary: string | null;
  }>;
}

export interface StockCompetitors {
  symbol: string;
  competitors: Array<{
    symbol: string;
    similarityScore: number;
  }>;
}

export type YahooToolId =
  | 'get_stock_quote'
  | 'get_stock_chart'
  | 'get_stock_fundamentals'
  | 'get_stock_financials'
  | 'get_stock_news'
  | 'get_stock_competitors';
