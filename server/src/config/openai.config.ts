export const openaiConfig = {
  apiKey: process.env.AGENT_API_KEY ?? '',
  model: process.env.AGENT_MODEL ?? 'gpt-4o-mini',
};
