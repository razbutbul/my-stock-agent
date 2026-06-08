import type { ChatCompletionTool } from 'openai/resources/chat/completions';

export type AgentToolName = 'get_stock_quote';

export interface AgentToolContext {
  lastStockSymbol?: string;
}

export interface AgentToolHandler {
  name: AgentToolName;
  definition: ChatCompletionTool;
  execute: (args: Record<string, unknown>) => Promise<unknown>;
}
