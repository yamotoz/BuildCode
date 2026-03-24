import { useState, useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { BarChart3, TrendingUp, Layers, Calendar, Clock, Timer } from 'lucide-react';
import { useTheme } from './useTheme';

interface StarsChartProps {
  dataA: number[];
  dataB: number[];
  nameA: string;
  nameB: string;
}

const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

type ChartType = 'area' | 'bar' | 'line';
type TimeRange = 'semana' | 'mes' | 'trimestre';

interface OptionBtnProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function OptionBtn({ active, onClick, children }: OptionBtnProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
        active
          ? 'bg-[#2E748B]/20 text-[#2E748B] border border-[#2E748B]/30'
          : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'
      }`}
    >
      {children}
    </button>
  );
}

export function StarsChart({ dataA, dataB, nameA, nameB }: StarsChartProps) {
  const t = useTheme();
  const [chartType, setChartType] = useState<ChartType>('area');
  const [timeRange, setTimeRange] = useState<TimeRange>('mes');
  const [showDots, setShowDots] = useState(false);
  const [smooth, setSmooth] = useState(true);

  const now = new Date();
  const weeksA = dataA.length > 0 ? dataA : [];
  const weeksB = dataB.length > 0 ? dataB : [];
  const totalWeeks = Math.max(weeksA.length, weeksB.length, 1);

  const chartData = useMemo(() => {
    if (timeRange === 'semana') {
      const data = [];
      const weekCount = Math.min(52, totalWeeks);
      for (let i = 0; i < weekCount; i++) {
        const weeksAgo = weekCount - i;
        data.push({
          label: weeksAgo <= 4 ? `${weeksAgo}s atrás` : `S${i + 1}`,
          [nameA]: weeksA[i] || 0,
          [nameB]: weeksB[i] || 0,
        });
      }
      return data;
    }

    if (timeRange === 'trimestre') {
      const data = [];
      const quarterCount = Math.min(4, Math.ceil(totalWeeks / 13));
      for (let q = 0; q < quarterCount; q++) {
        const startWeek = q * 13;
        const endWeek = Math.min(startWeek + 13, totalWeeks);
        let sumA = 0, sumB = 0;
        for (let w = startWeek; w < endWeek; w++) {
          sumA += weeksA[w] || 0;
          sumB += weeksB[w] || 0;
        }
        const monthsAgo = (quarterCount - 1 - q) * 3;
        const qDate = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
        const qLabel = `Q${Math.floor(qDate.getMonth() / 3) + 1} ${qDate.getFullYear().toString().slice(-2)}`;
        data.push({ label: qLabel, [nameA]: sumA, [nameB]: sumB });
      }
      return data;
    }

    // Visão mensal (padrão)
    const data = [];
    const monthCount = Math.min(12, Math.ceil(totalWeeks / 4));
    for (let m = 0; m < monthCount; m++) {
      const startWeek = m * 4;
      const endWeek = Math.min(startWeek + 4, totalWeeks);
      let sumA = 0, sumB = 0;
      for (let w = startWeek; w < endWeek; w++) {
        sumA += weeksA[w] || 0;
        sumB += weeksB[w] || 0;
      }
      const monthsAgo = monthCount - 1 - m;
      const monthDate = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
      const label = `${MONTH_NAMES[monthDate.getMonth()]} ${monthDate.getFullYear().toString().slice(-2)}`;
      data.push({ label, [nameA]: sumA, [nameB]: sumB });
    }
    return data;
  }, [timeRange, weeksA, weeksB, nameA, nameB, totalWeeks]);

  const curveType = smooth ? 'monotone' : 'linear';
  const tickInterval = timeRange === 'semana' ? Math.floor(chartData.length / 10) : undefined;

  const tooltipStyle = {
    background: t.tooltipBg,
    border: `1px solid ${t.tooltipBorder}`,
    borderRadius: '12px',
    color: t.tooltipColor,
    fontSize: '12px',
  };

  const periodLabel = timeRange === 'semana' ? 'semana' : timeRange === 'mes' ? 'mês' : 'trimestre';

  const renderChart = () => {
    const commonXAxis = (
      <XAxis
        dataKey="label"
        tick={{ fill: t.tickFill, fontSize: 10 }}
        axisLine={{ stroke: t.gridStroke }}
        tickLine={false}
        interval={tickInterval}
      />
    );
    const commonYAxis = (
      <YAxis tick={{ fill: t.tickFill, fontSize: 10 }} axisLine={false} tickLine={false} />
    );
    const commonTooltip = (
      <Tooltip
        contentStyle={tooltipStyle}
        labelFormatter={(l) => `${l}`}
        formatter={(value: number, name: string) => [`${value} commits`, name]}
      />
    );
    const commonGrid = <CartesianGrid strokeDasharray="3 3" stroke={t.gridStroke} />;

    if (chartType === 'bar') {
      return (
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          {commonGrid}
          {commonXAxis}
          {commonYAxis}
          {commonTooltip}
          <Bar dataKey={nameA} fill="#2E748B" radius={[4, 4, 0, 0]} opacity={0.85} />
          <Bar dataKey={nameB} fill="#F2AB6D" radius={[4, 4, 0, 0]} opacity={0.85} />
        </BarChart>
      );
    }

    if (chartType === 'line') {
      return (
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          {commonGrid}
          {commonXAxis}
          {commonYAxis}
          {commonTooltip}
          <Line
            type={curveType}
            dataKey={nameA}
            stroke="#2E748B"
            strokeWidth={2.5}
            dot={showDots ? { r: 3, fill: '#2E748B', stroke: t.dotStroke, strokeWidth: 2 } : false}
            activeDot={{ r: 4, fill: '#2E748B', stroke: t.dotStroke, strokeWidth: 2 }}
          />
          <Line
            type={curveType}
            dataKey={nameB}
            stroke="#F2AB6D"
            strokeWidth={2.5}
            dot={showDots ? { r: 3, fill: '#F2AB6D', stroke: t.dotStroke, strokeWidth: 2 } : false}
            activeDot={{ r: 4, fill: '#F2AB6D', stroke: t.dotStroke, strokeWidth: 2 }}
          />
        </LineChart>
      );
    }

    // Área (padrão)
    return (
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="gradA" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2E748B" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#2E748B" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradB" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F2AB6D" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#F2AB6D" stopOpacity={0} />
          </linearGradient>
        </defs>
        {commonGrid}
        {commonXAxis}
        {commonYAxis}
        {commonTooltip}
        <Area
          type={curveType}
          dataKey={nameA}
          stroke="#2E748B"
          strokeWidth={2.5}
          fill="url(#gradA)"
          dot={showDots ? { r: 3, fill: '#2E748B', stroke: t.dotStroke, strokeWidth: 2 } : false}
          activeDot={{ r: 4, fill: '#2E748B', stroke: t.dotStroke, strokeWidth: 2 }}
        />
        <Area
          type={curveType}
          dataKey={nameB}
          stroke="#F2AB6D"
          strokeWidth={2.5}
          fill="url(#gradB)"
          dot={showDots ? { r: 3, fill: '#F2AB6D', stroke: t.dotStroke, strokeWidth: 2 } : false}
          activeDot={{ r: 4, fill: '#F2AB6D', stroke: t.dotStroke, strokeWidth: 2 }}
        />
      </AreaChart>
    );
  };

  return (
    <div
      className="rounded-2xl overflow-hidden p-8 h-full"
      style={{
        background: t.cardBg,
        border: `1px solid ${t.border}`,
      }}
    >
      {/* Cabeçalho */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-bold" style={{ color: t.textPrimary }} data-i18n="analytics.adoption">
            Velocidade de Adoção
          </h2>
          <p className="text-sm" style={{ color: t.textSecondary }} data-i18n="analytics.adoption.sub">
            Atividade de commits comparativa por {periodLabel}
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2E748B]" />
            <span className="text-[10px] uppercase tracking-wider font-bold" style={{ color: t.textSecondary }}>{nameA}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F2AB6D]" />
            <span className="text-[10px] uppercase tracking-wider font-bold" style={{ color: t.textSecondary }}>{nameB}</span>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <div className="flex items-center gap-1 rounded-xl p-1" style={{ background: t.controlBg, border: `1px solid ${t.controlBorder}` }}>
          <OptionBtn active={chartType === 'area'} onClick={() => setChartType('area')}>
            <Layers className="w-3 h-3" /> Área
          </OptionBtn>
          <OptionBtn active={chartType === 'bar'} onClick={() => setChartType('bar')}>
            <BarChart3 className="w-3 h-3" /> Barras
          </OptionBtn>
          <OptionBtn active={chartType === 'line'} onClick={() => setChartType('line')}>
            <TrendingUp className="w-3 h-3" /> Linha
          </OptionBtn>
        </div>

        <div className="w-px h-5" style={{ background: t.border }} />

        <div className="flex items-center gap-1 rounded-xl p-1" style={{ background: t.controlBg, border: `1px solid ${t.controlBorder}` }}>
          <OptionBtn active={timeRange === 'semana'} onClick={() => setTimeRange('semana')}>
            <Clock className="w-3 h-3" /> Semana
          </OptionBtn>
          <OptionBtn active={timeRange === 'mes'} onClick={() => setTimeRange('mes')}>
            <Calendar className="w-3 h-3" /> Mês
          </OptionBtn>
          <OptionBtn active={timeRange === 'trimestre'} onClick={() => setTimeRange('trimestre')}>
            <Timer className="w-3 h-3" /> Trimestre
          </OptionBtn>
        </div>

        <div className="w-px h-5" style={{ background: t.border }} />

        <div className="flex items-center gap-1 rounded-xl p-1" style={{ background: t.controlBg, border: `1px solid ${t.controlBorder}` }}>
          <OptionBtn active={showDots} onClick={() => setShowDots(!showDots)}>
            Pontos {showDots ? 'ON' : 'OFF'}
          </OptionBtn>
          <OptionBtn active={smooth} onClick={() => setSmooth(!smooth)}>
            {smooth ? 'Suave' : 'Linear'}
          </OptionBtn>
        </div>
      </div>

      {/* Gráfico */}
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
