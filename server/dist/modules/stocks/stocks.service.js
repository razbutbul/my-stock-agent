"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StocksService = void 0;
const common_1 = require("@nestjs/common");
const yahoo_finance2_1 = __importDefault(require("yahoo-finance2"));
let StocksService = class StocksService {
    yahooFinance = new yahoo_finance2_1.default();
    async getStockQuote(symbol) {
        const normalizedSymbol = symbol.trim().toUpperCase();
        if (!normalizedSymbol) {
            throw new common_1.BadRequestException('Stock symbol is required');
        }
        try {
            const quote = (await this.yahooFinance.quote(normalizedSymbol, {
                fields: [
                    'symbol',
                    'shortName',
                    'longName',
                    'regularMarketPrice',
                    'currency',
                    'regularMarketChange',
                    'regularMarketChangePercent',
                    'marketState',
                    'regularMarketPreviousClose',
                    'regularMarketDayHigh',
                    'regularMarketDayLow',
                    'regularMarketVolume',
                ],
            }));
            if (!quote?.regularMarketPrice) {
                throw new common_1.NotFoundException(`No data found for symbol "${normalizedSymbol}"`);
            }
            return {
                symbol: quote.symbol ?? normalizedSymbol,
                name: quote.longName ?? quote.shortName ?? normalizedSymbol,
                price: quote.regularMarketPrice,
                currency: quote.currency ?? 'USD',
                change: quote.regularMarketChange ?? null,
                changePercent: quote.regularMarketChangePercent ?? null,
                marketState: quote.marketState ?? 'UNKNOWN',
                previousClose: quote.regularMarketPreviousClose ?? null,
                dayHigh: quote.regularMarketDayHigh ?? null,
                dayLow: quote.regularMarketDayLow ?? null,
                volume: quote.regularMarketVolume ?? null,
            };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.NotFoundException(`Could not fetch data for symbol "${normalizedSymbol}"`);
        }
    }
};
exports.StocksService = StocksService;
exports.StocksService = StocksService = __decorate([
    (0, common_1.Injectable)()
], StocksService);
//# sourceMappingURL=stocks.service.js.map