export interface StockFinancialPeriodDto {
  date: string;
  totalRevenue: number | null;
  netIncome: number | null;
  operatingIncome: number | null;
  grossProfit: number | null;
  freeCashFlow: number | null;
  totalAssets: number | null;
  totalDebt: number | null;
}

export interface StockFinancialsDto {
  symbol: string;
  quarterly: StockFinancialPeriodDto[];
  quartersAvailable: number;
  maxQuartersRequested: number;
  dataSources: Array<'yahoo' | 'sec'>;
  dataNote: string;
  revenueGrowthYoY: number | null;
  netIncomeGrowthYoY: number | null;
}
