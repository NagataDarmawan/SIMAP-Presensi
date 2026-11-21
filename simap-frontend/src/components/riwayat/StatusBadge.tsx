'use client';

import { getStatusBadgeClass } from '@/lib/statusBadge';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const label = status?.toUpperCase() || 'ALPHA';

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusBadgeClass(label)}`}
    >
      {label}
    </span>
  );
}