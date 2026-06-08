import { Injectable, OnModuleInit } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class AgentPromptService implements OnModuleInit {
  private systemPrompt = '';

  onModuleInit(): void {
    const promptPath = join(__dirname, 'prompts', 'system.prompt.md');
    this.systemPrompt = readFileSync(promptPath, 'utf-8').trim();

    if (!this.systemPrompt) {
      throw new Error(
        'system.prompt.md is empty. Fill in the prompt sections before starting the server.',
      );
    }
  }

  getSystemPrompt(): string {
    return this.systemPrompt;
  }
}
