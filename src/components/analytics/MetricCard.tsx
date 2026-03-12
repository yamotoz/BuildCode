import type { ReactNode } from 'react';
import { TrendingUp, Minus } from 'lucide-react';
import { useTheme } from './useTheme';

interface MetricCardProps {
  label: string;
  labelKey: string;
  icon: ReactNode;
  valueA: number;
  valueB: number;
  nameA: string;
  nameB: string;
  format: (n: number) => string;
  accentColor: string;
  lowerIsBetter?: boolean;
}

export function MetricCard({
  label, labelKey, icon, valueA, valueB, nameA, nameB, format, accentColor, lowerIsBetter
}: MetricCardProps) {
  const t = useTheme();
  const winner = lowerIsBetter
    ? (valueA < valueB ? 'A' : valueA > valueB ? 'B' : 'tie')
    : (valueA > valueB ? 'A' : valueA < valueB ? 'B' : 'tie');

  const diff = valueB > 0 ? Math.round(((valueA - valueB) / valueB) * 100) : 0;

  return (
    <div
      className="p-6 rounded-2xl flex flex-col justify-between group transition-colors hover:border-[#2E748B]/50 h-full"
      style={{
        background: t.cardBg,
        border: `1px solid ${t.border}`,
      }}
    >
      <div className="flex justify-between items-start">
        <span
          className="text-[10px] uppercase tracking-[0.2em] font-semibold"
          style={{ color: t.textSecondary }}
          data-i18n={labelKey}
        >
          {label}
        </span>
        <span className="text-[#2E748B]" style={{ filter: 'drop-shadow(0 0 8px rgba(46,116,139,0.4))' }}>
          {icon}
        </span>
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex items-baseline gap-3">
          <div>
            <div className="text-[10px] text-[#2E748B] font-bold uppercase tracking-wider mb-0.5">{nameA}</div>
            <div className="text-2xl font-bold tracking-tight" style={{ color: t.textPrimary }}>{format(valueA)}</div>
          </div>
          <div className="text-xs" style={{ color: t.tickFill }}>vs</div>
          <div>
            <div className="text-[10px] text-[#F2AB6D] font-bold uppercase tracking-wider mb-0.5">{nameB}</div>
            <div className="text-2xl font-bold tracking-tight" style={{ color: t.textPrimary }}>{format(valueB)}</div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-medium">
          {winner === 'A' ? (
            <>
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">{nameA} lidera {diff !== 0 ? `(${Math.abs(diff)}%)` : ''}</span>
            </>
          ) : winner === 'B' ? (
            <>
              <TrendingUp className="w-3 h-3 text-[#F2AB6D]" />
              <span className="text-[#F2AB6D]">{nameB} lidera {diff !== 0 ? `(${Math.abs(diff)}%)` : ''}</span>
            </>
          ) : (
            <>
              <Minus className="w-3 h-3" style={{ color: t.textSecondary }} />
              <span style={{ color: t.textSecondary }}>Empate</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
