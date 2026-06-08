"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openaiConfig = void 0;
exports.openaiConfig = {
    apiKey: process.env.AGENT_API_KEY ?? '',
    model: process.env.AGENT_MODEL ?? 'gpt-4o-mini',
};
//# sourceMappingURL=openai.config.js.map