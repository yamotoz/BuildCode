import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar,
} from 'recharts';

// ── Types ────────────────────────────────────────────────────────────────────

interface AdminDashboardProps {
  metrics: {
    mrr: number;
    mrrTrend: number;
    churnRate: number;
    churnTrend: number;
    arpu: number;
    ltv: number;
    totalUsers: number;
    apiCosts: { provider: string; cost: number }[];
    planDistribution: { plan: string; count: number }[];
    revenueHistory: { month: string; revenue: number; cost: number }[];
    userSegmentation: { seniority: string; count: number }[];
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const PLAN_COLORS: Record<string, string> = {
  Explorador: '#10B981',
  Consultor: '#2E748B',
  Arquiteto: '#F2AB6D',
};

const PRIMARY = '#2E748B';
const ACCENT = '#F2AB6D';

function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatPercent(value: number): string {
  return value.toFixed(1) + '%';
}

// ── Sub-components ───────────────────────────────────────────────────────────

function TrendBadge({ value, suffix = '%', invert = false }: { value: number; suffix?: string; invert?: boolean }) {
  const positive = invert ? value <= 0 : value >= 0;
  const color = positive ? '#10B981' : '#EF4444';
  const arrow = value >= 0 ? '\u2191' : '\u2193';

  return (
    <span
      className="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold"
      style={{ background: `${color}20`, color }}
    >
      {arrow} {Math.abs(value)}{suffix}
    </span>
  );
}

function StatCard({
  icon,
  label,
  value,
  trend,
  invertTrend = false,
}: {
  icon: string;
  label: string;
  value: string;
  trend?: { value: number; suffix?: string };
  invertTrend?: boolean;
}) {
  return (
    <div
      className="flex flex-col justify-between rounded-2xl p-5 transition-colors hover:border-[#2E748B]/50"
      style={{ background: '#121212', border: '1px solid #2A3135', minHeight: 140 }}
    >
      <div className="flex items-start justify-between">
        <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-slate-400">
          {label}
        </span>
        <span
          className="material-symbols-outlined text-xl"
          style={{ color: PRIMARY, filter: 'drop-shadow(0 0 8px rgba(46,116,139,0.4))' }}
        >
          {icon}
        </span>
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold tracking-tight text-white">{value}</div>
        {trend && (
          <div className="mt-1">
            <TrendBadge value={trend.value} suffix={trend.suffix} invert={invertTrend} />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Tooltip styles ───────────────────────────────────────────────────────────

const tooltipStyle = {
  contentStyle: {
    background: '#1E1E1E',
    border: '1px solid #2A3135',
    borderRadius: 8,
    fontSize: 12,
    color: '#e2e8f0',
  },
  itemStyle: { color: '#e2e8f0' },
  cursor: { stroke: PRIMARY, strokeWidth: 1 },
};

// ── Custom Pie Label ─────────────────────────────────────────────────────────

function renderPieLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  name,
  percent,
}: any) {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 1.4;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#e2e8f0"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {name} ({(percent * 100).toFixed(0)}%)
    </text>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function AdminDashboard({ metrics }: AdminDashboardProps) {
  const totalApiCost = metrics.apiCosts.reduce((sum, c) => sum + c.cost, 0);
  const maxCost = Math.max(...metrics.apiCosts.map((c) => c.cost), 1);

  return (
    <div className="w-full space-y-6 p-4 md:p-6" style={{ background: '#0A0A0A', minHeight: '100vh' }}>
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Painel Administrativo</h1>
          <p className="text-sm text-slate-400">
            Visão geral das métricas SaaS &middot; {metrics.totalUsers} usuários ativos
          </p>
        </div>
      </div>

      {/* ── Top metric cards ────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon="attach_money"
          label="MRR"
          value={formatBRL(metrics.mrr)}
          trend={{ value: metrics.mrrTrend, suffix: '%' }}
        />
        <StatCard
          icon="trending_down"
          label="Churn Rate"
          value={formatPercent(metrics.churnRate)}
          trend={{ value: metrics.churnTrend, suffix: '%' }}
          invertTrend
        />
        <StatCard
          icon="person"
          label="ARPU"
          value={formatBRL(metrics.arpu)}
        />
        <StatCard
          icon="timeline"
          label="LTV"
          value={formatBRL(metrics.ltv)}
        />
      </div>

      {/* ── API Burn Rate ───────────────────────────────────────── */}
      <div
        className="rounded-2xl p-5 md:p-6"
        style={{ background: '#121212', border: '1px solid #2A3135' }}
      >
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">Custo de API este mês</h2>
            <p className="text-xs text-slate-400">Breakdown por provedor</p>
          </div>
          <span className="text-xl font-bold text-white">{formatBRL(totalApiCost)}</span>
        </div>

        <div className="mt-5 space-y-3">
          {metrics.apiCosts.map((item) => {
            const pct = (item.cost / maxCost) * 100;
            return (
              <div key={item.provider}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-300">{item.provider}</span>
                  <span className="text-slate-400">{formatBRL(item.cost)}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: '#1E1E1E' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${PRIMARY}, ${ACCENT})`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Charts row ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Plan Distribution (Donut) */}
        <div
          className="rounded-2xl p-5 md:p-6"
          style={{ background: '#121212', border: '1px solid #2A3135' }}
        >
          <h2 className="mb-4 text-sm font-semibold text-white">Distribuição de Planos</h2>
          <div className="flex items-center justify-center" style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.planDistribution}
                  dataKey="count"
                  nameKey="plan"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={4}
                  label={renderPieLabel}
                  labelLine={false}
                  stroke="none"
                >
                  {metrics.planDistribution.map((entry) => (
                    <Cell
                      key={entry.plan}
                      fill={PLAN_COLORS[entry.plan] ?? PRIMARY}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle.contentStyle}
                  itemStyle={tooltipStyle.itemStyle}
                  formatter={(value: number) => [`${value} usuários`, 'Total']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="mt-2 flex flex-wrap justify-center gap-4">
            {metrics.planDistribution.map((entry) => (
              <div key={entry.plan} className="flex items-center gap-1.5 text-xs text-slate-300">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ background: PLAN_COLORS[entry.plan] ?? PRIMARY }}
                />
                {entry.plan}
              </div>
            ))}
          </div>
        </div>

        {/* Revenue vs Cost (Line) */}
        <div
          className="rounded-2xl p-5 md:p-6"
          style={{ background: '#121212', border: '1px solid #2A3135' }}
        >
          <h2 className="mb-4 text-sm font-semibold text-white">Receita vs Custo</h2>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.revenueHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A3135" />
                <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={tooltipStyle.contentStyle}
                  itemStyle={tooltipStyle.itemStyle}
                  formatter={(value: number) => formatBRL(value)}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Receita"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#10B981' }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="cost"
                  name="Custo"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#EF4444' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="mt-2 flex justify-center gap-5">
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: '#10B981' }} />
              Receita
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: '#EF4444' }} />
              Custo
            </div>
          </div>
        </div>
      </div>

      {/* ── User Segmentation (Horizontal Bar) ──────────────────── */}
      <div
        className="rounded-2xl p-5 md:p-6"
        style={{ background: '#121212', border: '1px solid #2A3135' }}
      >
        <h2 className="mb-4 text-sm font-semibold text-white">Segmentação de Usuários</h2>
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics.userSegmentation} layout="vertical" barCategoryGap="28%">
              <CartesianGrid strokeDasharray="3 3" stroke="#2A3135" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="seniority"
                tick={{ fill: '#e2e8f0', fontSize: 12, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                width={70}
              />
              <Tooltip
                contentStyle={tooltipStyle.contentStyle}
                itemStyle={tooltipStyle.itemStyle}
                formatter={(value: number) => [`${value} usuários`, 'Total']}
              />
              <Bar dataKey="count" name="Usuários" radius={[0, 6, 6, 0]} maxBarSize={28}>
                {metrics.userSegmentation.map((_, i) => (
                  <Cell key={i} fill={i % 2 === 0 ? PRIMARY : ACCENT} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
