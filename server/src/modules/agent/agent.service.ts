import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import OpenAI from 'openai';
import type {
  ChatCompletionMessageParam,
  ChatCompletionMessageToolCall,
} from 'openai/resources/chat/completions';
import { openaiConfig } from '../../config/openai.config';
import { StockQuoteDto } from '../stocks/stock-quote.dto';
import { AgentResponseDto } from './agent-response.dto';
import { StockInsightDto } from './stock-insight.dto';
import { AgentPromptService } from './agent-prompt.service';
import { AgentToolsService } from './tools/agent-tools.service';

const MAX_AGENT_ITERATIONS = 6;

@Injectable()
export class AgentService {
  constructor(
    private readonly agentToolsService: AgentToolsService,
    private readonly agentPromptService: AgentPromptService,
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

          if (this.isStockQuote(toolResult)) {
            stock = toolResult;
          }

          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(toolResult),
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
    const result = await this.chat(
      `Provide insights and analysis for the stock symbol ${normalizedSymbol}.`,
    );

    return {
      symbol: result.stock?.symbol ?? normalizedSymbol,
      name: result.stock?.name ?? normalizedSymbol,
      stock: result.stock,
      insights: result.message,
      toolsUsed: result.toolsUsed,
    };
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

    return this.agentToolsService.executeTool(toolName, parsedArgs);
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
