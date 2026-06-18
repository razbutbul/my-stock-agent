import type { ChatCompletionTool } from 'openai/resources/chat/completions';

export type AgentToolName =
  | 'get_stock_quote'
  | 'get_stock_chart'
  | 'get_stock_fundamentals'
  | 'get_stock_financials'
  | 'get_stock_news'
  | 'get_stock_competitors';

export interface AgentToolHandler {
  name: AgentToolName;
  definition: ChatCompletionTool;
  execute: (args: Record<string, unknown>) => Promise<unknown>;
}
