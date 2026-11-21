import React from 'react';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
  isEmpty?: boolean;
  emptyMessage?: string;
}

export const Table: React.FC<TableProps> = ({
  headers,
  children,
  isEmpty = false,
  emptyMessage = 'Belum ada data tersedia.',
}) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--border-color)] bg-white shadow-sm">
      <table className="w-full text-left text-sm text-slate-800">
        <thead className="bg-slate-100 border-b border-[var(--border-color)] text-xs uppercase font-semibold text-slate-700">
          <tr>
            {headers.map((head, idx) => (
              <th key={idx} className="px-6 py-3">
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-color)] text-slate-800">
          {isEmpty ? (
            <tr>
              <td colSpan={headers.length} className="px-6 py-4 text-center text-xs text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
};