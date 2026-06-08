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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentService = void 0;
const common_1 = require("@nestjs/common");
const openai_1 = __importDefault(require("openai"));
const openai_config_1 = require("../../config/openai.config");
const agent_prompt_service_1 = require("./agent-prompt.service");
const agent_tools_service_1 = require("./tools/agent-tools.service");
const MAX_AGENT_ITERATIONS = 6;
let AgentService = class AgentService {
    agentToolsService;
    agentPromptService;
    constructor(agentToolsService, agentPromptService) {
        this.agentToolsService = agentToolsService;
        this.agentPromptService = agentPromptService;
    }
    async chat(message) {
        const trimmedMessage = message.trim();
        if (!trimmedMessage) {
            throw new common_1.BadRequestException('Message is required');
        }
        const client = this.createOpenAiClient();
        const toolsUsed = [];
        let stock;
        const messages = [
            { role: 'system', content: this.agentPromptService.getSystemPrompt() },
            { role: 'user', content: trimmedMessage },
        ];
        for (let step = 0; step < MAX_AGENT_ITERATIONS; step += 1) {
            const completion = await client.chat.completions.create({
                model: openai_config_1.openaiConfig.model,
                messages,
                tools: this.agentToolsService.getToolDefinitions(),
                temperature: 0.4,
            });
            const assistantMessage = completion.choices[0]?.message;
            if (!assistantMessage) {
                throw new common_1.ServiceUnavailableException('OpenAI returned an empty response');
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
                throw new common_1.ServiceUnavailableException('OpenAI returned an empty response');
            }
            return {
                message: content,
                toolsUsed,
                stock,
            };
        }
        throw new common_1.ServiceUnavailableException('Agent exceeded the maximum number of tool calls');
    }
    async analyzeStock(symbol) {
        const normalizedSymbol = symbol.trim().toUpperCase();
        const result = await this.chat(`Provide insights and analysis for the stock symbol ${normalizedSymbol}.`);
        return {
            symbol: result.stock?.symbol ?? normalizedSymbol,
            name: result.stock?.name ?? normalizedSymbol,
            stock: result.stock,
            insights: result.message,
            toolsUsed: result.toolsUsed,
        };
    }
    createOpenAiClient() {
        if (!openai_config_1.openaiConfig.apiKey) {
            throw new common_1.ServiceUnavailableException('OpenAI API key is not configured. Set AGENT_API_KEY in server/.env');
        }
        return new openai_1.default({ apiKey: openai_config_1.openaiConfig.apiKey });
    }
    async runToolCall(toolCall, toolsUsed) {
        if (toolCall.type !== 'function') {
            throw new common_1.ServiceUnavailableException('Unsupported tool call type');
        }
        const toolName = toolCall.function.name;
        toolsUsed.push(toolName);
        let parsedArgs;
        try {
            parsedArgs = JSON.parse(toolCall.function.arguments);
        }
        catch {
            throw new common_1.ServiceUnavailableException(`Tool "${toolName}" received invalid arguments`);
        }
        return this.agentToolsService.executeTool(toolName, parsedArgs);
    }
    isStockQuote(value) {
        if (!value || typeof value !== 'object') {
            return false;
        }
        const candidate = value;
        return (typeof candidate.symbol === 'string' &&
            typeof candidate.price === 'number');
    }
};
exports.AgentService = AgentService;
exports.AgentService = AgentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [agent_tools_service_1.AgentToolsService,
        agent_prompt_service_1.AgentPromptService])
], AgentService);
//# sourceMappingURL=agent.service.js.map