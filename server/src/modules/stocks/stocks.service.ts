import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import YahooFinance from 'yahoo-finance2';
import {
  StockChartDto,
  StockCandleDto,
  StockChartTimeframeDto,
} from './stock-chart.dto';
import { StockCompetitorsDto } from './stock-competitors.dto';
import {
  StockFinancialPeriodDto,
  StockFinancialsDto,
} from './stock-financials.dto';
import { StockFundamentalsDto } from './stock-fundamentals.dto';
import { StockNewsDto } from './stock-news.dto';
import { StockQuoteDto } from './stock-quote.dto';
import { SecEdgarService } from './sec-edgar.service';

interface YahooStockQuote {
  symbol?: string;
  shortName?: string;
  longName?: string;
  regularMarketPrice?: number;
  currency?: string;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  marketState?: string;
  regularMarketPreviousClose?: number;
  regularMarketDayHigh?: number;
  regularMarketDayLow?: number;
  regularMarketVolume?: number;
}

interface YahooChartQuote {
  date: Date;
  high: number | null;
  low: number | null;
  open: number | null;
  close: number | null;
  volume: number | null;
}

interface YahooChartMeta {
  currency?: string;
  symbol?: string;
  longName?: string;
  shortName?: string;
  regularMarketPrice?: number;
  chartPreviousClose?: number;
  regularMarketDayHigh?: number;
  regularMarketDayLow?: number;
  regularMarketVolume?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
}

interface YahooChartResult {
  meta?: YahooChartMeta;
  quotes?: YahooChartQuote[];
}

type YahooFinancialPeriod = Record<string, unknown> & {
  date?: Date | string;
};

interface YahooNewsArticle {
  title?: string;
  publisher?: string;
  link?: string;
  providerPublishTime?: Date | number | string;
  summary?: string;
}

interface YahooSearchQuote {
  symbol?: string;
  shortname?: string;
  longname?: string;
  sector?: string;
  industry?: string;
}

interface YahooSearchResult {
  quotes?: YahooSearchQuote[];
  news?: YahooNewsArticle[];
}

interface YahooUpgradeDowngrade {
  firm?: string;
  toGrade?: string;
  fromGrade?: string;
  action?: string;
  epochGradeDate?: Date | number;
}

const MAX_FINANCIAL_QUARTERS = 12;
const YAHOO_MODULE_OPTIONS = { validateResult: false as const };

@Injectable()
export class StocksService {
  private readonly yahooFinance = new YahooFinance({
    suppressNotices: ['yahooSurvey'],
    queue: { concurrency: 2, interval: 250 },
  });

  constructor(private readonly secEdgarService: SecEdgarService) {}

  async getStockQuote(symbol: string): Promise<StockQuoteDto> {
    const normalizedSymbol = this.normalizeSymbol(symbol);

    try {
      const quote = await this.fetchYahooQuote(normalizedSymbol);

      if (quote) {
        this.logYahoo('quote.mapped', normalizedSymbol, quote);
        return quote;
      }
    } catch (error) {
      this.rethrowKnownErrors(error);
    }

    try {
      const fallbackQuote = await this.buildQuoteFromChart(normalizedSymbol);

      if (fallbackQuote) {
        this.logYahoo('quote.fallback.chart', normalizedSymbol, fallbackQuote);
        return fallbackQuote;
      }
    } catch (error) {
      this.rethrowKnownErrors(error);
    }

    throw new NotFoundException(
      `Could not fetch quote for symbol "${normalizedSymbol}"`,
    );
  }

  async getStockChart(symbol: string): Promise<StockChartDto> {
    const normalizedSymbol = this.normalizeSymbol(symbol);

    try {
      const [dailyResult, weeklyResult] = await Promise.all([
        this.fetchChart(normalizedSymbol, '1d', 180),
        this.fetchChart(normalizedSymbol, '1wk', 365),
      ]);

      const chart: StockChartDto = {
        symbol: normalizedSymbol,
        currency:
          dailyResult.meta?.currency ?? weeklyResult.meta?.currency ?? 'USD',
        fiftyTwoWeekHigh:
          dailyResult.meta?.fiftyTwoWeekHigh ??
          weeklyResult.meta?.fiftyTwoWeekHigh ??
          null,
        fiftyTwoWeekLow:
          dailyResult.meta?.fiftyTwoWeekLow ??
          weeklyResult.meta?.fiftyTwoWeekLow ??
          null,
        daily: this.buildChartTimeframe('1d', dailyResult.quotes ?? [], 60),
        weekly: this.buildChartTimeframe('1wk', weeklyResult.quotes ?? [], 26),
      };

      this.logYahoo('chart.mapped', normalizedSymbol, chart);
      return chart;
    } catch (error) {
      this.rethrowKnownErrors(error);
      throw new NotFoundException(
        `Could not fetch chart data for symbol "${normalizedSymbol}"`,
      );
    }
  }

  async getStockFundamentals(symbol: string): Promise<StockFundamentalsDto> {
    const normalizedSymbol = this.normalizeSymbol(symbol);

    try {
      const fundamentals = await this.fetchYahooFundamentals(normalizedSymbol);

      if (fundamentals) {
        this.logYahoo('fundamentals.mapped', normalizedSymbol, fundamentals);
        return fundamentals;
      }
    } catch (error) {
      this.rethrowKnownErrors(error);
    }

    try {
      const fallbackFundamentals =
        await this.buildFundamentalsFallback(normalizedSymbol);

      if (fallbackFundamentals) {
        this.logYahoo(
          'fundamentals.fallback',
          normalizedSymbol,
          fallbackFundamentals,
        );
        return fallbackFundamentals;
      }
    } catch (error) {
      this.rethrowKnownErrors(error);
    }

    throw new NotFoundException(
      `Could not fetch fundamentals for symbol "${normalizedSymbol}"`,
    );
  }

  async getStockFinancials(symbol: string): Promise<StockFinancialsDto> {
    const normalizedSymbol = this.normalizeSymbol(symbol);
    const period1 = new Date();
    period1.setFullYear(period1.getFullYear() - 3);

    try {
      const [financialsRaw, balanceSheetRaw, cashFlowRaw] = await Promise.all([
        this.yahooFinance.fundamentalsTimeSeries(
          normalizedSymbol,
          { period1, type: 'quarterly', module: 'financials' },
          YAHOO_MODULE_OPTIONS,
        ),
        this.yahooFinance.fundamentalsTimeSeries(
          normalizedSymbol,
          { period1, type: 'quarterly', module: 'balance-sheet' },
          YAHOO_MODULE_OPTIONS,
        ),
        this.yahooFinance.fundamentalsTimeSeries(
          normalizedSymbol,
          { period1, type: 'quarterly', module: 'cash-flow' },
          YAHOO_MODULE_OPTIONS,
        ),
      ]);

      this.logYahoo('financials.raw.income', normalizedSymbol, financialsRaw);
      this.logYahoo(
        'financials.raw.balance',
        normalizedSymbol,
        balanceSheetRaw,
      );
      this.logYahoo('financials.raw.cashflow', normalizedSymbol, cashFlowRaw);

      const yahooQuarterly = this.mergeFinancialPeriods(
        financialsRaw as YahooFinancialPeriod[],
        balanceSheetRaw as YahooFinancialPeriod[],
        cashFlowRaw as YahooFinancialPeriod[],
      ).filter((period) => this.hasFinancialData(period));

      const secQuarterly = await this.secEdgarService.getQuarterlyFinancials(
        normalizedSymbol,
        MAX_FINANCIAL_QUARTERS,
      );

      this.logYahoo('financials.raw.sec', normalizedSymbol, secQuarterly);

      const dataSources: Array<'yahoo' | 'sec'> = [];
      if (yahooQuarterly.length) dataSources.push('yahoo');
      if (secQuarterly?.length) dataSources.push('sec');

      const quarterly = this.mergeFinancialSources(
        secQuarterly ?? [],
        yahooQuarterly,
      ).slice(-MAX_FINANCIAL_QUARTERS);

      if (!quarterly.length) {
        throw new NotFoundException(
          `No quarterly financial data found for symbol "${normalizedSymbol}"`,
        );
      }

      const financials: StockFinancialsDto = {
        symbol: normalizedSymbol,
        quarterly,
        quartersAvailable: quarterly.length,
        maxQuartersRequested: MAX_FINANCIAL_QUARTERS,
        dataSources,
        dataNote: this.buildFinancialsDataNote(dataSources),
        revenueGrowthYoY: this.calculateYoYGrowth(
          quarterly.map((period) => period.totalRevenue),
        ),
        netIncomeGrowthYoY: this.calculateYoYGrowth(
          quarterly.map((period) => period.netIncome),
        ),
      };

      this.logYahoo('financials.mapped', normalizedSymbol, financials);
      return financials;
    } catch (error) {
      this.rethrowKnownErrors(error);
      throw new NotFoundException(
        `Could not fetch financial history for symbol "${normalizedSymbol}"`,
      );
    }
  }

  async getStockNews(symbol: string): Promise<StockNewsDto> {
    const normalizedSymbol = this.normalizeSymbol(symbol);

    try {
      const searchResult = (await this.yahooFinance.search(
        normalizedSymbol,
        {
          quotesCount: 1,
          newsCount: 15,
        },
        YAHOO_MODULE_OPTIONS,
      )) as YahooSearchResult;

      this.logYahoo('news.raw', normalizedSymbol, searchResult.news);

      const articles = (searchResult.news ?? []).map((article) => ({
        title: article.title ?? 'Untitled',
        publisher: article.publisher ?? null,
        link: article.link ?? null,
        publishedAt: this.formatDate(article.providerPublishTime),
        summary: this.truncateText(
          typeof article.summary === 'string' ? article.summary : null,
          280,
        ),
      }));

      const news: StockNewsDto = {
        symbol: normalizedSymbol,
        articles,
      };

      this.logYahoo('news.mapped', normalizedSymbol, news);
      return news;
    } catch (error) {
      this.rethrowKnownErrors(error);
      throw new NotFoundException(
        `Could not fetch news for symbol "${normalizedSymbol}"`,
      );
    }
  }

  async getStockCompetitors(symbol: string): Promise<StockCompetitorsDto> {
    const normalizedSymbol = this.normalizeSymbol(symbol);

    try {
      const recommendations = await this.yahooFinance.recommendationsBySymbol(
        normalizedSymbol,
        undefined,
        YAHOO_MODULE_OPTIONS,
      );

      this.logYahoo('competitors.raw', normalizedSymbol, recommendations);

      const result = Array.isArray(recommendations)
        ? recommendations[0]
        : recommendations;

      const competitors: StockCompetitorsDto = {
        symbol: normalizedSymbol,
        competitors: (result?.recommendedSymbols ?? [])
          .slice(0, 10)
          .map((item: { symbol: string; score: number }) => ({
            symbol: item.symbol,
            similarityScore: item.score,
          })),
      };

      this.logYahoo('competitors.mapped', normalizedSymbol, competitors);
      return competitors;
    } catch (error) {
      this.rethrowKnownErrors(error);
      throw new NotFoundException(
        `Could not fetch competitors for symbol "${normalizedSymbol}"`,
      );
    }
  }

  private normalizeSymbol(symbol: string): string {
    const normalizedSymbol = symbol.trim().toUpperCase();

    if (!normalizedSymbol) {
      throw new BadRequestException('Stock symbol is required');
    }

    return normalizedSymbol;
  }

  private async fetchYahooQuote(symbol: string): Promise<StockQuoteDto | null> {
    const quote = (await this.yahooFinance.quote(
      symbol,
      {
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
      },
      YAHOO_MODULE_OPTIONS,
    )) as YahooStockQuote;

    this.logYahoo('quote.raw', symbol, quote);

    if (!quote?.regularMarketPrice) {
      return null;
    }

    return {
      symbol: quote.symbol ?? symbol,
      name: quote.longName ?? quote.shortName ?? symbol,
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

  private async buildQuoteFromChart(
    symbol: string,
  ): Promise<StockQuoteDto | null> {
    const chartResult = await this.fetchChart(symbol, '1d', 7);
    const meta = chartResult.meta;
    const candles = chartResult.quotes ?? [];
    const lastCandle = [...candles]
      .reverse()
      .find((candle) => candle.close !== null);
    const previousCandle = [...candles]
      .reverse()
      .filter((candle) => candle.close !== null)[1];

    const price = meta?.regularMarketPrice ?? lastCandle?.close ?? null;

    if (price === null) {
      return null;
    }

    const previousClose =
      meta?.chartPreviousClose ?? previousCandle?.close ?? null;
    const change = previousClose !== null ? price - previousClose : null;
    const changePercent =
      change !== null && previousClose ? (change / previousClose) * 100 : null;

    return {
      symbol: meta?.symbol ?? symbol,
      name: meta?.longName ?? meta?.shortName ?? symbol,
      price,
      currency: meta?.currency ?? 'USD',
      change,
      changePercent,
      marketState: 'UNKNOWN',
      previousClose,
      dayHigh: meta?.regularMarketDayHigh ?? lastCandle?.high ?? null,
      dayLow: meta?.regularMarketDayLow ?? lastCandle?.low ?? null,
      volume: meta?.regularMarketVolume ?? lastCandle?.volume ?? null,
    };
  }

  private async fetchYahooFundamentals(
    symbol: string,
  ): Promise<StockFundamentalsDto | null> {
    const summary = (await this.yahooFinance.quoteSummary(
      symbol,
      {
        modules: [
          'summaryProfile',
          'summaryDetail',
          'financialData',
          'defaultKeyStatistics',
          'recommendationTrend',
          'upgradeDowngradeHistory',
          'earningsTrend',
          'calendarEvents',
        ],
      },
      YAHOO_MODULE_OPTIONS,
    )) as Record<string, unknown>;

    this.logYahoo('fundamentals.raw', symbol, summary);

    const profile = summary.summaryProfile as
      | Record<string, unknown>
      | undefined;
    const detail = summary.summaryDetail as Record<string, unknown> | undefined;
    const financial = summary.financialData as
      | Record<string, unknown>
      | undefined;
    const stats = summary.defaultKeyStatistics as
      | Record<string, unknown>
      | undefined;
    const calendar = summary.calendarEvents as
      | Record<string, unknown>
      | undefined;
    const upgrades =
      (
        summary.upgradeDowngradeHistory as
          | { history?: YahooUpgradeDowngrade[] }
          | undefined
      )?.history ?? [];

    if (!profile && !detail && !financial && !stats) {
      return null;
    }

    return {
      symbol,
      name: this.asString(profile?.longName ?? profile?.shortName) ?? symbol,
      sector: this.asString(profile?.sector),
      industry: this.asString(profile?.industry),
      country: this.asString(profile?.country),
      employees: this.asNumber(profile?.fullTimeEmployees),
      businessSummary: this.truncateText(
        this.asString(profile?.longBusinessSummary),
        600,
      ),
      marketCap: this.asNumber(detail?.marketCap),
      enterpriseValue: this.asNumber(stats?.enterpriseValue),
      trailingPe: this.asNumber(stats?.trailingPE ?? detail?.trailingPE),
      forwardPe: this.asNumber(stats?.forwardPE ?? detail?.forwardPE),
      pegRatio: this.asNumber(stats?.pegRatio),
      priceToBook: this.asNumber(stats?.priceToBook),
      beta: this.asNumber(stats?.beta ?? detail?.beta),
      fiftyTwoWeekChangePercent: this.asNumber(stats?.['52WeekChange']),
      profitMargin: this.asNumber(
        financial?.profitMargins ?? stats?.profitMargins,
      ),
      revenue: this.asNumber(financial?.totalRevenue),
      revenueGrowth: this.asNumber(financial?.revenueGrowth),
      grossMargin: this.asNumber(financial?.grossMargins),
      operatingMargin: this.asNumber(financial?.operatingMargins),
      ebitda: this.asNumber(financial?.ebitda),
      freeCashflow: this.asNumber(financial?.freeCashflow),
      debtToEquity: this.asNumber(financial?.debtToEquity),
      currentRatio: this.asNumber(financial?.currentRatio),
      analystRecommendation: this.asString(financial?.recommendationKey),
      analystTargetMean: this.asNumber(financial?.targetMeanPrice),
      analystTargetHigh: this.asNumber(financial?.targetHighPrice),
      analystTargetLow: this.asNumber(financial?.targetLowPrice),
      analystCount: this.asNumber(financial?.numberOfAnalystOpinions),
      earningsGrowth: this.asNumber(stats?.earningsQuarterlyGrowth),
      nextEarningsDate: this.formatDate(
        (calendar?.earnings as { earningsDate?: unknown[] } | undefined)
          ?.earningsDate?.[0],
      ),
      exDividendDate: this.formatDate(calendar?.exDividendDate),
      recommendationTrend: summary.recommendationTrend ?? null,
      recentUpgradesDowngrades: upgrades.slice(0, 8).map((item) => ({
        firm: item.firm ?? 'Unknown',
        toGrade: item.toGrade ?? 'N/A',
        fromGrade: item.fromGrade ?? null,
        action: item.action ?? 'N/A',
        date: this.formatDate(item.epochGradeDate) ?? 'Unknown',
      })),
      earningsTrend: summary.earningsTrend ?? null,
    };
  }

  private async buildFundamentalsFallback(
    symbol: string,
  ): Promise<StockFundamentalsDto | null> {
    const [searchResult, chartResult, financials] = await Promise.all([
      this.yahooFinance.search(
        symbol,
        { quotesCount: 1, newsCount: 0 },
        YAHOO_MODULE_OPTIONS,
      ) as Promise<YahooSearchResult>,
      this.fetchChart(symbol, '1d', 30),
      this.getStockFinancials(symbol).catch(() => null),
    ]);

    const searchQuote =
      searchResult.quotes?.find(
        (quote) => quote.symbol?.toUpperCase() === symbol,
      ) ?? searchResult.quotes?.[0];
    const meta = chartResult.meta;
    const latestQuarter = financials?.quarterly.at(-1);
    const latestRevenue = latestQuarter?.totalRevenue ?? null;
    const latestNetIncome = latestQuarter?.netIncome ?? null;
    const profitMargin =
      latestRevenue && latestNetIncome ? latestNetIncome / latestRevenue : null;
    const price = meta?.regularMarketPrice ?? null;
    const fiftyTwoWeekChangePercent =
      price && meta?.fiftyTwoWeekLow
        ? ((price - meta.fiftyTwoWeekLow) / meta.fiftyTwoWeekLow) * 100
        : null;

    if (!searchQuote && !meta && !financials) {
      return null;
    }

    return {
      symbol,
      name:
        this.asString(searchQuote?.longname ?? searchQuote?.shortname) ??
        meta?.longName ??
        meta?.shortName ??
        symbol,
      sector: this.asString(searchQuote?.sector),
      industry: this.asString(searchQuote?.industry),
      country: null,
      employees: null,
      businessSummary: null,
      marketCap: null,
      enterpriseValue: null,
      trailingPe: null,
      forwardPe: null,
      pegRatio: null,
      priceToBook: null,
      beta: null,
      fiftyTwoWeekChangePercent,
      profitMargin,
      revenue: latestRevenue,
      revenueGrowth: financials?.revenueGrowthYoY ?? null,
      grossMargin:
        latestRevenue && latestQuarter?.grossProfit
          ? latestQuarter.grossProfit / latestRevenue
          : null,
      operatingMargin:
        latestRevenue && latestQuarter?.operatingIncome
          ? latestQuarter.operatingIncome / latestRevenue
          : null,
      ebitda: null,
      freeCashflow: latestQuarter?.freeCashFlow ?? null,
      debtToEquity:
        latestQuarter?.totalDebt && latestQuarter?.totalAssets
          ? latestQuarter.totalDebt / latestQuarter.totalAssets
          : null,
      currentRatio: null,
      analystRecommendation: null,
      analystTargetMean: null,
      analystTargetHigh: null,
      analystTargetLow: null,
      analystCount: null,
      earningsGrowth: financials?.netIncomeGrowthYoY ?? null,
      nextEarningsDate: null,
      exDividendDate: null,
      recommendationTrend: null,
      recentUpgradesDowngrades: [],
      earningsTrend: null,
    };
  }

  private async fetchChart(
    symbol: string,
    interval: '1d' | '1wk',
    daysBack: number,
  ): Promise<YahooChartResult> {
    const period1 = new Date();
    period1.setDate(period1.getDate() - daysBack);

    return (await this.yahooFinance.chart(
      symbol,
      {
        period1,
        interval,
      },
      YAHOO_MODULE_OPTIONS,
    )) as YahooChartResult;
  }

  private buildChartTimeframe(
    interval: '1d' | '1wk',
    quotes: YahooChartQuote[],
    maxCandles: number,
  ): StockChartTimeframeDto {
    const candles = quotes
      .slice(-maxCandles)
      .map((quote) => this.mapCandle(quote));

    return {
      interval,
      candles,
      summary: this.summarizeCandles(candles),
    };
  }

  private mapCandle(quote: YahooChartQuote): StockCandleDto {
    return {
      date: this.formatDate(quote.date) ?? 'Unknown',
      open: quote.open,
      high: quote.high,
      low: quote.low,
      close: quote.close,
      volume: quote.volume,
    };
  }

  private summarizeCandles(candles: StockCandleDto[]) {
    const validHighs = candles
      .map((candle) => candle.high)
      .filter((value): value is number => value !== null);
    const validLows = candles
      .map((candle) => candle.low)
      .filter((value): value is number => value !== null);
    const validVolumes = candles
      .map((candle) => candle.volume)
      .filter((value): value is number => value !== null);
    const firstClose = candles.find((candle) => candle.close !== null)?.close;
    const lastClose = [...candles]
      .reverse()
      .find((candle) => candle.close !== null)?.close;

    const periodChangePercent =
      firstClose && lastClose
        ? ((lastClose - firstClose) / firstClose) * 100
        : null;

    return {
      candlesCount: candles.length,
      periodHigh: validHighs.length ? Math.max(...validHighs) : null,
      periodLow: validLows.length ? Math.min(...validLows) : null,
      periodChangePercent,
      averageVolume: validVolumes.length
        ? validVolumes.reduce((sum, value) => sum + value, 0) /
          validVolumes.length
        : null,
      lastClose: lastClose ?? null,
    };
  }

  private mergeFinancialSources(
    secPeriods: StockFinancialPeriodDto[],
    yahooPeriods: StockFinancialPeriodDto[],
  ): StockFinancialPeriodDto[] {
    const byQuarter = new Map<string, StockFinancialPeriodDto>();

    for (const period of [...secPeriods, ...yahooPeriods]) {
      const quarterKey = this.getFiscalQuarterKey(period.date);
      const existing = byQuarter.get(quarterKey);

      byQuarter.set(
        quarterKey,
        existing ? this.mergeFinancialPeriod(existing, period) : { ...period },
      );
    }

    return [...byQuarter.values()]
      .filter((period) => this.hasFinancialData(period))
      .sort(
        (left, right) =>
          new Date(left.date).getTime() - new Date(right.date).getTime(),
      );
  }

  private getFiscalQuarterKey(date: string): string {
    const parsed = new Date(date);
    const year = parsed.getUTCFullYear();
    const quarter = Math.floor(parsed.getUTCMonth() / 3) + 1;
    return `${year}-Q${quarter}`;
  }

  private mergeFinancialPeriod(
    base: StockFinancialPeriodDto,
    overlay: StockFinancialPeriodDto,
  ): StockFinancialPeriodDto {
    return {
      date: overlay.date,
      totalRevenue: overlay.totalRevenue ?? base.totalRevenue,
      netIncome: overlay.netIncome ?? base.netIncome,
      operatingIncome: overlay.operatingIncome ?? base.operatingIncome,
      grossProfit: overlay.grossProfit ?? base.grossProfit,
      freeCashFlow: overlay.freeCashFlow ?? base.freeCashFlow,
      totalAssets: overlay.totalAssets ?? base.totalAssets,
      totalDebt: overlay.totalDebt ?? base.totalDebt,
    };
  }

  private buildFinancialsDataNote(dataSources: Array<'yahoo' | 'sec'>): string {
    if (dataSources.includes('yahoo') && dataSources.includes('sec')) {
      return 'Quarterly history combines SEC EDGAR framed 10-Q data for older quarters with Yahoo Finance for recent cash-flow and balance-sheet enrichment.';
    }

    if (dataSources.includes('sec')) {
      return 'Quarterly history is sourced from SEC EDGAR framed 10-Q filings.';
    }

    return 'Quarterly history is sourced from Yahoo Finance only. SEC EDGAR was unavailable for this symbol.';
  }

  private mergeFinancialPeriods(
    ...sources: YahooFinancialPeriod[][]
  ): StockFinancialPeriodDto[] {
    const byDate = new Map<string, YahooFinancialPeriod>();

    for (const source of sources) {
      for (const period of source) {
        const dateKey = this.formatDate(period.date);

        if (!dateKey) {
          continue;
        }

        const existing = byDate.get(dateKey) ?? {};
        byDate.set(dateKey, { ...existing, ...period, date: period.date });
      }
    }

    return [...byDate.entries()]
      .sort(
        ([leftDate], [rightDate]) =>
          new Date(leftDate).getTime() - new Date(rightDate).getTime(),
      )
      .map(([, period]) => this.mapFinancialPeriod(period));
  }

  private mapFinancialPeriod(
    period: YahooFinancialPeriod,
  ): StockFinancialPeriodDto {
    return {
      date: this.formatDate(period.date) ?? 'Unknown',
      totalRevenue: this.pickNumber(
        period,
        'totalRevenue',
        'quarterlyTotalRevenue',
        'operatingRevenue',
      ),
      netIncome: this.pickNumber(
        period,
        'netIncome',
        'quarterlyNetIncome',
        'netIncomeCommonStockholders',
      ),
      operatingIncome: this.pickNumber(
        period,
        'operatingIncome',
        'quarterlyOperatingIncome',
        'totalOperatingIncomeAsReported',
      ),
      grossProfit: this.pickNumber(
        period,
        'grossProfit',
        'quarterlyGrossProfit',
      ),
      freeCashFlow: this.pickNumber(
        period,
        'freeCashFlow',
        'quarterlyFreeCashFlow',
      ),
      totalAssets: this.pickNumber(
        period,
        'totalAssets',
        'quarterlyTotalAssets',
      ),
      totalDebt: this.pickNumber(
        period,
        'totalDebt',
        'quarterlyTotalDebt',
        'longTermDebt',
      ),
    };
  }

  private pickNumber(
    period: YahooFinancialPeriod,
    ...keys: string[]
  ): number | null {
    for (const key of keys) {
      const value = period[key];
      if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
      }
    }

    return null;
  }

  private hasFinancialData(period: StockFinancialPeriodDto): boolean {
    return [
      period.totalRevenue,
      period.netIncome,
      period.operatingIncome,
      period.grossProfit,
      period.freeCashFlow,
      period.totalAssets,
      period.totalDebt,
    ].some((value) => value !== null);
  }

  private calculateYoYGrowth(values: Array<number | null>): number | null {
    const validValues = values.filter(
      (value): value is number => value !== null,
    );

    if (validValues.length < 5) {
      return null;
    }

    const latest = validValues[validValues.length - 1];
    const yearAgo = validValues[validValues.length - 5];

    if (!yearAgo) {
      return null;
    }

    return ((latest - yearAgo) / yearAgo) * 100;
  }

  private formatDate(value: unknown): string | null {
    if (!value) {
      return null;
    }

    const date =
      value instanceof Date ? value : new Date(value as string | number);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return date.toISOString().slice(0, 10);
  }

  private asNumber(value: unknown): number | null {
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
  }

  private asString(value: unknown): string | null {
    return typeof value === 'string' && value.trim() ? value : null;
  }

  private truncateText(value: string | null | undefined, maxLength: number) {
    if (!value) {
      return null;
    }

    return value.length > maxLength
      ? `${value.slice(0, maxLength).trim()}...`
      : value;
  }

  private logYahoo(label: string, symbol: string, payload: unknown) {
    console.log(
      `[Yahoo] ${label} (${symbol}):`,
      JSON.stringify(payload, null, 2),
    );
  }

  private rethrowKnownErrors(error: unknown) {
    if (
      error instanceof BadRequestException ||
      error instanceof NotFoundException
    ) {
      throw error;
    }
  }
}
