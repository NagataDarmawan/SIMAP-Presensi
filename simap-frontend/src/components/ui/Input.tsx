import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="block text-xs font-medium text-[var(--text-main)]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full rounded-md border border-[var(--border-color)] bg-white px-3 py-2 text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all ${
            error ? 'border-[var(--danger)] focus:ring-[var(--danger)]' : ''
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-[var(--danger)]">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';