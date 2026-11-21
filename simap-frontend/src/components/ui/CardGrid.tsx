import React from 'react';

interface CardGridProps {
  children: React.ReactNode;
  isEmpty?: boolean;
  emptyMessage?: string;
  cols?: 1 | 2 | 3 | 4;
}

export const CardGrid: React.FC<CardGridProps> = ({
  children,
  isEmpty = false,
  emptyMessage = 'Belum ada data tersedia.',
  cols = 3,
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  if (isEmpty) {
    return (
      <div className="flex min-h-[200px] w-full items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
        {emptyMessage}
      </div>
    );
  }

  return <div className={`grid gap-4 ${gridCols[cols]}`}>{children}</div>;
};