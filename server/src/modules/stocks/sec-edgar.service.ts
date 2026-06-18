import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { StockFinancialPeriodDto } from './stock-financials.dto';

const SEC_TICKERS_URL = 'https://www.sec.gov/files/company_tickers.json';
const SEC_COMPANY_FACTS_URL = 'https://data.sec.gov/api/xbrl/companyfacts/CIK';
const SEC_USER_AGENT =
  process.env.SEC_USER_AGENT ?? 'stock-agent my-stock-agent/1.0 (dev@localhost)';
const FRAMED_QUARTER_PATTERN = /^CY\d{4}Q[1-4]$/;

const METRIC_KEYS: Array<{
  field: keyof StockFinancialPeriodDto;
  tags: string[];
}> = [
  { field: 'totalRevenue', tags: ['Revenues', 'RevenueFromContractWithCustomerExcludingAssessedTax'] },
  { field: 'netIncome', tags: ['NetIncomeLoss'] },
  { field: 'operatingIncome', tags: ['OperatingIncomeLoss'] },
  { field: 'grossProfit', tags: ['GrossProfit'] },
  { field: 'totalAssets', tags: ['Assets'] },
  { field: 'totalDebt', tags: ['LongTermDebt', 'LongTermDebtNoncurrent'] },
];

interface SecFactEntry {
  end: string;
  val: number;
  filed?: string;
  frame?: string;
  form?: string;
  fp?: string;
}

interface SecCompanyFactsResponse {
  facts?: {
    'us-gaap'?: Record<
      string,
      {
        units?: {
          USD?: SecFactEntry[];
        };
      }
    >;
  };
}

@Injectable()
export class SecEdgarService implements OnModuleInit {
  private readonly logger = new Logger(SecEdgarService.name);
  private readonly tickerToCik = new Map<string, string>();

  async onModuleInit(): Promise<void> {
    await this.loadTickerMap();
  }

  async getQuarterlyFinancials(
    symbol: string,
    maxQuarters = 12,
  ): Promise<StockFinancialPeriodDto[] | null> {
    const cik = this.tickerToCik.get(symbol.trim().toUpperCase());

    if (!cik) {
      return null;
    }

    try {
      const response = await fetch(`${SEC_COMPANY_FACTS_URL}${cik}.json`, {
        headers: { 'User-Agent': SEC_USER_AGENT },
      });

      if (!response.ok) {
        this.logger.warn(`SEC facts request failed for ${symbol}: ${response.status}`);
        return null;
      }

      const payload = (await response.json()) as SecCompanyFactsResponse;
      const gaap = payload.facts?.['us-gaap'];

      if (!gaap) {
        return null;
      }

      const byDate = new Map<string, StockFinancialPeriodDto>();

      for (const metric of METRIC_KEYS) {
        for (const tag of metric.tags) {
          const entries = gaap[tag]?.units?.USD;

          if (!entries?.length) {
            continue;
          }

          for (const value of this.pickFramedQuarterlyValues(entries)) {
            const existing = byDate.get(value.end) ?? {
              date: value.end,
              totalRevenue: null,
              netIncome: null,
              operatingIncome: null,
              grossProfit: null,
              freeCashFlow: null,
              totalAssets: null,
              totalDebt: null,
            };

            if (existing[metric.field] === null) {
              this.setFinancialField(existing, metric.field, value.val);
            }

            byDate.set(value.end, existing);
          }
        }
      }

      const quarters = [...byDate.values()]
        .filter((period) => this.hasFinancialData(period))
        .sort(
          (left, right) =>
            new Date(left.date).getTime() - new Date(right.date).getTime(),
        )
        .slice(-maxQuarters);

      return quarters.length ? quarters : null;
    } catch (error) {
      this.logger.warn(
        `SEC facts fetch failed for ${symbol}: ${error instanceof Error ? error.message : 'unknown error'}`,
      );
      return null;
    }
  }

  private async loadTickerMap(): Promise<void> {
    try {
      const response = await fetch(SEC_TICKERS_URL, {
        headers: { 'User-Agent': SEC_USER_AGENT },
      });

      if (!response.ok) {
        this.logger.warn(`Failed to load SEC ticker map: ${response.status}`);
        return;
      }

      const payload = (await response.json()) as Record<
        string,
        { ticker: string; cik_str: number }
      >;

      for (const entry of Object.values(payload)) {
        const cik = String(entry.cik_str).padStart(10, '0');
        this.tickerToCik.set(entry.ticker.toUpperCase(), cik);
      }

      this.logger.log(`Loaded ${this.tickerToCik.size} SEC ticker mappings`);
    } catch (error) {
      this.logger.warn(
        `SEC ticker map unavailable: ${error instanceof Error ? error.message : 'unknown error'}`,
      );
    }
  }

  private pickFramedQuarterlyValues(entries: SecFactEntry[]): SecFactEntry[] {
    const byEnd = new Map<string, SecFactEntry>();

    for (const entry of entries) {
      if (!entry.frame || !FRAMED_QUARTER_PATTERN.test(entry.frame)) {
        continue;
      }

      if (!['10-Q', '10-K'].includes(entry.form ?? '')) {
        continue;
      }

      const existing = byEnd.get(entry.end);

      if (!existing || (entry.filed ?? '') > (existing.filed ?? '')) {
        byEnd.set(entry.end, entry);
      }
    }

    return [...byEnd.values()];
  }

  private setFinancialField(
    period: StockFinancialPeriodDto,
    field: keyof StockFinancialPeriodDto,
    value: number,
  ): void {
    switch (field) {
      case 'totalRevenue':
        period.totalRevenue = value;
        break;
      case 'netIncome':
        period.netIncome = value;
        break;
      case 'operatingIncome':
        period.operatingIncome = value;
        break;
      case 'grossProfit':
        period.grossProfit = value;
        break;
      case 'totalAssets':
        period.totalAssets = value;
        break;
      case 'totalDebt':
        period.totalDebt = value;
        break;
      default:
        break;
    }
  }

  private hasFinancialData(period: StockFinancialPeriodDto): boolean {
    return [
      period.totalRevenue,
      period.netIncome,
      period.operatingIncome,
      period.grossProfit,
      period.totalAssets,
      period.totalDebt,
    ].some((value) => value !== null);
  }
}
