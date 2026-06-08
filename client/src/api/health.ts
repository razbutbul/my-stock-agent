import { API_BASE_URL } from './config';
import type { HealthResponse } from '../types/health';

export async function fetchHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/health`);

  if (!response.ok) {
    throw new Error(`Health check failed (${response.status})`);
  }

  return response.json() as Promise<HealthResponse>;
}
