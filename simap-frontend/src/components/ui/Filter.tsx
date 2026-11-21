import React from 'react';

interface Option {
  label: string;
  value: string | number;
}

interface FilterProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  label?: string;
}

export const Filter: React.FC<FilterProps> = ({ options, label, className = '', ...props }) => {
  return (
    <div className="flex items-center space-x-2">
      {label && <span className="text-xs font-medium text-[var(--text-muted)]">{label}:</span>}
      <select
        className={`rounded-md border border-[var(--border-color)] bg-white px-3 py-1.5 text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${className}`}
        {...props}
      >
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};