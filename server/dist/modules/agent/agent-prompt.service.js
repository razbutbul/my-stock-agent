"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentPromptService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
let AgentPromptService = class AgentPromptService {
    systemPrompt = '';
    onModuleInit() {
        const promptPath = (0, path_1.join)(__dirname, 'prompts', 'system.prompt.md');
        this.systemPrompt = (0, fs_1.readFileSync)(promptPath, 'utf-8').trim();
        if (!this.systemPrompt) {
            throw new Error('system.prompt.md is empty. Fill in the prompt sections before starting the server.');
        }
    }
    getSystemPrompt() {
        return this.systemPrompt;
    }
};
exports.AgentPromptService = AgentPromptService;
exports.AgentPromptService = AgentPromptService = __decorate([
    (0, common_1.Injectable)()
], AgentPromptService);
//# sourceMappingURL=agent-prompt.service.js.map