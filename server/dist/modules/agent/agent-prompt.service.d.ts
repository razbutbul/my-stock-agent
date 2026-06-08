import { OnModuleInit } from '@nestjs/common';
export declare class AgentPromptService implements OnModuleInit {
    private systemPrompt;
    onModuleInit(): void;
    getSystemPrompt(): string;
}
