import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationMeta } from '../types/biodata.types';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (newPage: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ meta, onPageChange }) => {
  const { page, totalPages, total } = meta;

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 px-4 bg-white border border-stone-200 rounded-2xl shadow-sm">
      <div className="text-sm text-stone-500">
        કુલ રેકોર્ડ્સ: <span className="font-semibold text-stone-900">{total}</span> | પૃષ્ઠ{' '}
        <span className="font-semibold text-stone-900">{page}</span> of{' '}
        <span className="font-semibold text-stone-900">{totalPages}</span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-stone-700 bg-stone-50 border border-stone-200 rounded-xl hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>પાછળ (Prev)</span>
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
          .map((p, idx, arr) => {
            const prev = arr[idx - 1];
            return (
              <React.Fragment key={p}>
                {prev && p - prev > 1 && <span className="px-2 text-stone-400">...</span>}
                <button
                  type="button"
                  onClick={() => onPageChange(p)}
                  className={`w-9 h-9 text-sm font-semibold rounded-xl transition-all ${
                    p === page
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {p}
                </button>
              </React.Fragment>
            );
          })}

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-stone-700 bg-stone-50 border border-stone-200 rounded-xl hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <span>આગળ (Next)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
