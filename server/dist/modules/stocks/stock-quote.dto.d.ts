export interface StockQuoteDto {
    symbol: string;
    name: string;
    price: number;
    currency: string;
    change: number | null;
    changePercent: number | null;
    marketState: string;
    previousClose: number | null;
    dayHigh: number | null;
    dayLow: number | null;
    volume: number | null;
}
