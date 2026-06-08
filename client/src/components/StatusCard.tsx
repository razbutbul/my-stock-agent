import type { HealthResponse } from '../types/health';

interface StatusCardProps {
  data: HealthResponse;
}

export function StatusCard({ data }: StatusCardProps) {
  return (
    <div className="status-card">
      <p>
        <strong>Status:</strong> {data.status}
      </p>
      <p>
        <strong>Service:</strong> {data.service}
      </p>
    </div>
  );
}
