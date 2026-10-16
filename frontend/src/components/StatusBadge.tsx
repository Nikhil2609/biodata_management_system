import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'enabled' | 'disabled';
  onClick?: () => void;
  interactive?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, onClick, interactive = false }) => {
  const isEnabled = status === 'enabled';

  return (
    <button
      type="button"
      onClick={interactive ? onClick : undefined}
      disabled={!interactive}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all shadow-sm ${
        isEnabled
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
          : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
      } ${interactive ? 'cursor-pointer' : 'cursor-default'}`}
    >
      {isEnabled ? (
        <>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>સક્રિય (Enabled)</span>
        </>
      ) : (
        <>
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>નિષ્ક્રિય (Disabled)</span>
        </>
      )}
    </button>
  );
};
