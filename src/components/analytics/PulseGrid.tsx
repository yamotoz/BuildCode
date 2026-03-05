import { useMemo } from 'react';

interface PulseGridProps {
  activityA: number[];
  activityB: number[];
  nameA: string;
  nameB: string;
}

function getIntensityClass(value: number, max: number): string {
  if (max === 0 || value === 0) return 'bg-[#2A3135]';
  const ratio = value / max;
  if (ratio < 0.2) return 'bg-[#2E748B]/20';
  if (ratio < 0.4) return 'bg-[#2E748B]/40';
  if (ratio < 0.7) return 'bg-[#2E748B]/70';
  return 'bg-[#2E748B]';
}

export function PulseGrid({ activityA, activityB, nameA, nameB }: PulseGridProps) {
  // Combine both activities into a merged visual (use A as primary)
  const combined = useMemo(() => {
    const maxVal = Math.max(...activityA, ...activityB, 1);
    // Fill 52 weeks, padded with zeros if needed
    const weeks: { valueA: number; valueB: number; intensity: string }[] = [];
    for (let i = 0; i < 52; i++) {
      const vA = activityA[activityA.length - 52 + i] || 0;
      const vB = activityB[activityB.length - 52 + i] || 0;
      weeks.push({
        valueA: vA,
        valueB: vB,
        intensity: getIntensityClass(vA + vB, maxVal * 2),
      });
    }
    return { weeks, maxVal };
  }, [activityA, activityB]);

  // Expand to 7 rows x 52 cols (simulate daily from weekly data)
  const grid = useMemo(() => {
    const cells: string[] = [];
    const maxVal = combined.maxVal * 2;
    for (let w = 0; w < 52; w++) {
      const weekData = combined.weeks[w];
      const total = weekData.valueA + weekData.valueB;
      for (let d = 0; d < 7; d++) {
        // Add some variation per day
        const jitter = 0.5 + Math.random();
        const dayVal = (total / 7) * jitter;
        cells.push(getIntensityClass(dayVal, maxVal / 7));
      }
    }
    return cells;
  }, [combined]);

  return (
    <div
      className="rounded-2xl p-8 h-full"
      style={{
        background: '#121212',
        border: '1px solid #2A3135',
      }}
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-lg font-bold text-white" data-i18n="analytics.pulse">
            Atividade de Pulso
          </h3>
          <p className="text-sm text-slate-400" data-i18n="analytics.pulse.sub">
            Intensidade de contribuição nas últimas 52 semanas
          </p>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
          <span data-i18n="analytics.less">MENOS</span>
          <div className="flex gap-1 mx-2">
            <div className="w-3 h-3 rounded-sm bg-[#2A3135]" />
            <div className="w-3 h-3 rounded-sm bg-[#2E748B]/20" />
            <div className="w-3 h-3 rounded-sm bg-[#2E748B]/40" />
            <div className="w-3 h-3 rounded-sm bg-[#2E748B]/70" />
            <div className="w-3 h-3 rounded-sm bg-[#2E748B]" />
          </div>
          <span data-i18n="analytics.more">MAIS</span>
        </div>
      </div>
      <div className="grid gap-[3px]" style={{ gridTemplateColumns: 'repeat(52, minmax(0, 1fr))' }}>
        {grid.map((cls, i) => (
          <div
            key={i}
            className={`aspect-square rounded-sm ${cls} opacity-80 hover:opacity-100 transition-opacity cursor-pointer`}
            title={`Semana ${Math.floor(i / 7) + 1}`}
          />
        ))}
      </div>
      <div className="mt-4 flex gap-4 text-[10px] text-slate-500 font-mono">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#2E748B]" />
          {nameA}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#F2AB6D]" />
          {nameB}
        </span>
      </div>
    </div>
  );
}
