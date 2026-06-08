"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentToolsService = void 0;
const common_1 = require("@nestjs/common");
const stocks_service_1 = require("../../stocks/stocks.service");
let AgentToolsService = class AgentToolsService {
    stocksService;
    handlers;
    constructor(stocksService) {
        this.stocksService = stocksService;
        this.handlers = {
            get_stock_quote: {
                name: 'get_stock_quote',
                definition: {
                    type: 'function',
                    function: {
                        name: 'get_stock_quote',
                        description: 'Fetch live stock quote data (price, volume, daily change, market state) for a ticker symbol. Use this whenever the user asks for stock insights, analysis, price, or performance of a specific company.',
                        parameters: {
                            type: 'object',
                            properties: {
                                symbol: {
                                    type: 'string',
                                    description: 'Stock ticker symbol, for example AAPL, MSFT, TSLA, NVDA',
                                },
                            },
                            required: ['symbol'],
                        },
                    },
                },
                execute: (args) => this.getStockQuote(args),
            },
        };
    }
    getToolDefinitions() {
        return Object.values(this.handlers).map((handler) => handler.definition);
    }
    async executeTool(name, args) {
        const handler = this.handlers[name];
        if (!handler) {
            throw new Error(`Unknown tool: ${name}`);
        }
        return handler.execute(args);
    }
    getStockQuote(args) {
        const symbol = args.symbol;
        if (typeof symbol !== 'string' || !symbol.trim()) {
            throw new Error('get_stock_quote requires a non-empty symbol');
        }
        return this.stocksService.getStockQuote(symbol);
    }
};
exports.AgentToolsService = AgentToolsService;
exports.AgentToolsService = AgentToolsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [stocks_service_1.StocksService])
], AgentToolsService);
//# sourceMappingURL=agent-tools.service.js.map