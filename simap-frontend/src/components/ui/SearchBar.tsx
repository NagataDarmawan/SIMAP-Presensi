'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  className = '',
  placeholder = 'Cari data...',
  ...props
}) => {
  return (
    <div className="relative w-full max-w-xs">
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => onSearch?.(e.target.value)}
        className={`w-full rounded-md border border-slate-300 bg-white pl-9 pr-3 py-1.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--brand)] transition-all ${className}`}
        {...props}
      />
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
    </div>
  );
};