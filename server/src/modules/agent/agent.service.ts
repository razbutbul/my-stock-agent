import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import OpenAI from 'openai';
import type {
  ChatCompletionMessageParam,
  ChatCompletionMessageToolCall,
} from 'openai/resources/chat/completions';
import { openaiConfig } from '../../config/openai.config';
import { StockQuoteDto } from '../stocks/stock-quote.dto';
import { StocksService } from '../stocks/stocks.service';
import { AgentResponseDto } from './agent-response.dto';
import { StockInsightDto } from './stock-insight.dto';
import { AgentPromptService } from './agent-prompt.service';
import { AgentToolsService } from './tools/agent-tools.service';

const MAX_AGENT_ITERATIONS = 12;

@Injectable()
export class AgentService {
  constructor(
    private readonly agentToolsService: AgentToolsService,
    private readonly agentPromptService: AgentPromptService,
    private readonly stocksService: StocksService,
  ) {}

  async chat(message: string): Promise<AgentResponseDto> {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      throw new BadRequestException('Message is required');
    }

    const client = this.createOpenAiClient();
    const toolsUsed: string[] = [];
    let stock: StockQuoteDto | undefined;

    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: this.agentPromptService.getSystemPrompt() },
      { role: 'user', content: trimmedMessage },
    ];

    for (let step = 0; step < MAX_AGENT_ITERATIONS; step += 1) {
      const completion = await client.chat.completions.create({
        model: openaiConfig.model,
        messages,
        tools: this.agentToolsService.getToolDefinitions(),
        temperature: 0.4,
      });

      const assistantMessage = completion.choices[0]?.message;

      if (!assistantMessage) {
        throw new ServiceUnavailableException(
          'OpenAI returned an empty response',
        );
      }

      const toolCalls = assistantMessage.tool_calls;

      if (toolCalls?.length) {
        messages.push(assistantMessage);

        for (const toolCall of toolCalls) {
          const toolResult = await this.runToolCall(toolCall, toolsUsed);
          const toolPayload = JSON.stringify(toolResult);

          if (this.isStockQuote(toolResult)) {
            stock = toolResult;
          }

          console.log('[Agent->LLM] tool result:', {
            tool: toolCall.type === 'function' ? toolCall.function.name : toolCall.type,
            toolCallId: toolCall.id,
            arguments:
              toolCall.type === 'function' ? toolCall.function.arguments : undefined,
            payload: toolPayload,
          });

          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: toolPayload,
          });
        }

        continue;
      }

      const content = assistantMessage.content?.trim();

      if (!content) {
        throw new ServiceUnavailableException(
          'OpenAI returned an empty response',
        );
      }

      console.log('[Agent->Client] final LLM response:', {
        toolsUsed,
        stockSymbol: stock?.symbol,
        messageLength: content.length,
        messagePreview: content.slice(0, 300),
      });

      return {
        message: content,
        toolsUsed,
        stock,
      };
    }

    throw new ServiceUnavailableException(
      'Agent exceeded the maximum number of tool calls',
    );
  }

  async analyzeStock(symbol: string): Promise<StockInsightDto> {
    const normalizedSymbol = symbol.trim().toUpperCase();

    if (!normalizedSymbol) {
      throw new BadRequestException('יש להזין סימול מניה');
    }

    await this.ensureSymbolExistsOnYahoo(normalizedSymbol);

    const result = await this.chat(
      `Analyze the stock symbol ${normalizedSymbol} for a full investment assessment.

Before writing your answer, you MUST call ALL of these tools:
- get_stock_quote
- get_stock_chart
- get_stock_fundamentals
- get_stock_financials
- get_stock_news
- get_stock_competitors

Base technical analysis only on chart data.
Base catalysts and deals only on news data.
Base competitor analysis only on competitors tool data.
Never invent contracts, partnerships, or news.`,
    );

    return {
      symbol: result.stock?.symbol ?? normalizedSymbol,
      name: result.stock?.name ?? normalizedSymbol,
      stock: result.stock,
      insights: result.message,
      toolsUsed: result.toolsUsed,
    };
  }

  private async ensureSymbolExistsOnYahoo(symbol: string): Promise<void> {
    try {
      await this.stocksService.getStockQuote(symbol);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw new BadRequestException(
          `שם המניה "${symbol}" לא תקין — לא נמצאו נתונים ב-Yahoo Finance`,
        );
      }

      throw error;
    }
  }

  private createOpenAiClient(): OpenAI {
    if (!openaiConfig.apiKey) {
      throw new ServiceUnavailableException(
        'OpenAI API key is not configured. Set AGENT_API_KEY in server/.env',
      );
    }

    return new OpenAI({ apiKey: openaiConfig.apiKey });
  }

  private async runToolCall(
    toolCall: ChatCompletionMessageToolCall,
    toolsUsed: string[],
  ): Promise<unknown> {
    if (toolCall.type !== 'function') {
      throw new ServiceUnavailableException('Unsupported tool call type');
    }

    const toolName = toolCall.function.name;
    toolsUsed.push(toolName);

    let parsedArgs: Record<string, unknown>;

    try {
      parsedArgs = JSON.parse(toolCall.function.arguments) as Record<
        string,
        unknown
      >;
    } catch {
      throw new ServiceUnavailableException(
        `Tool "${toolName}" received invalid arguments`,
      );
    }

    try {
      return await this.agentToolsService.executeTool(toolName, parsedArgs);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Tool execution failed';

      console.warn(`[Agent] tool failed: ${toolName}`, message);

      return {
        error: true,
        tool: toolName,
        message,
      };
    }
  }

  private isStockQuote(value: unknown): value is StockQuoteDto {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const candidate = value as StockQuoteDto;
    return (
      typeof candidate.symbol === 'string' &&
      typeof candidate.price === 'number'
    );
  }
}
