import { useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, ComposedChart, Area,
} from 'recharts';

// ── Types ────────────────────────────────────────────────────────────────────

interface Metrics {
  mrr: number;
  churnRate: number;
  arpu: number;
  ltv: number;
  totalUsers: number;
  activeSubscriptions: number;
  canceledSubscriptions: number;
  payingUsers: number;
  totalApiCost: number;
  apiCosts: { provider: string; cost: number }[];
  planDistribution: { plan: string; count: number }[];
  revenueHistory: {
    month: string;
    mrr: number;
    cost: number;
    users: number;
    arpu: number;
    ltv: number;
    churn: number;
  }[];
  dailyHistory?: {
    day: string;
    mrr: number;
    cost: number;
    users: number;
    arpu: number;
    ltv: number;
    churn: number;
  }[];
  userSegmentation: { seniority: string; count: number }[];
}

// ── Colors & Helpers ─────────────────────────────────────────────────────────

const PLAN_COLORS: Record<string, string> = {
  Explorador: '#10B981',
  Consultor: '#2E748B',
  Arquiteto: '#F2AB6D',
};

const SEG_COLORS: Record<string, string> = {
  Junior: '#2E748B',
  Pleno: '#F2AB6D',
  Senior: '#8B5CF6',
};

const PRIMARY = '#2E748B';
const ACCENT = '#F2AB6D';
const GREEN = '#10B981';
const RED = '#EF4444';
const PURPLE = '#8B5CF6';

function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// ── Info Tooltip ─────────────────────────────────────────────────────────────

const METRIC_INFO: Record<string, string> = {
  MRR: 'Monthly Recurring Revenue — Receita recorrente mensal. Soma de todas as assinaturas ativas.',
  'Churn Rate': 'Taxa de cancelamento. Percentual de assinantes que cancelaram em relação ao total.',
  ARPU: 'Average Revenue Per User — Receita média por usuário pagante.',
  LTV: 'Lifetime Value — Valor total estimado que um cliente gera durante toda sua permanência.',
};

function InfoBadge({ term }: { term: string }) {
  const [show, setShow] = useState(false);
  const info = METRIC_INFO[term];
  if (!info) return null;

  return (
    <span className="relative inline-block ml-1.5" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <span
        className="inline-flex items-center justify-center rounded-full cursor-help select-none"
        style={{ width: 16, height: 16, fontSize: 10, fontWeight: 700, background: '#2A3135', color: '#94a3b8', lineHeight: 1 }}
      >
        i
      </span>
      {show && (
        <div
          className="absolute z-50 left-1/2 bottom-full mb-2 -translate-x-1/2 w-64 rounded-lg p-3 text-xs text-slate-200 leading-relaxed shadow-xl pointer-events-none"
          style={{ background: '#1E1E1E', border: '1px solid #2A3135' }}
        >
          <strong className="text-white">{term}</strong>
          <br />
          {info}
        </div>
      )}
    </span>
  );
}

// ── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub }: {
  icon: string; label: string; value: string; sub?: string;
}) {
  return (
    <div
      className="flex flex-col justify-between rounded-2xl p-5 transition-colors hover:border-[#2E748B]/50"
      style={{ background: '#121212', border: '1px solid #2A3135', minHeight: 130 }}
    >
      <div className="flex items-start justify-between">
        <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-slate-400 flex items-center">
          {label}
          <InfoBadge term={label} />
        </span>
        <span className="material-symbols-outlined text-xl" style={{ color: PRIMARY, filter: 'drop-shadow(0 0 8px rgba(46,116,139,0.4))' }}>{icon}</span>
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold tracking-tight text-white">{value}</div>
        {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
      </div>
    </div>
  );
}

// ── Mini Chart Switcher ──────────────────────────────────────────────────────

type MiniChartType = 'donut' | 'bar' | 'table';
const miniChartIcons: Record<MiniChartType, string> = { donut: 'donut_large', bar: 'bar_chart', table: 'table_rows' };

function ChartSwitcher({ active, onChange }: { active: MiniChartType; onChange: (t: MiniChartType) => void }) {
  return (
    <div className="flex gap-1">
      {(['donut', 'bar', 'table'] as MiniChartType[]).map(t => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className="p-1 rounded transition-all"
          style={{ background: active === t ? '#2A3135' : 'transparent', color: active === t ? 'white' : '#64748b' }}
          title={t === 'donut' ? 'Rosca' : t === 'bar' ? 'Barras' : 'Tabela'}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{miniChartIcons[t]}</span>
        </button>
      ))}
    </div>
  );
}

// ── Period Switcher ──────────────────────────────────────────────────────────

type Period = 'month' | 'day';

function PeriodSwitcher({ active, onChange }: { active: Period; onChange: (p: Period) => void }) {
  return (
    <div className="flex gap-1 rounded-lg p-0.5" style={{ background: '#1E1E1E' }}>
      {(['month', 'day'] as Period[]).map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className="px-3 py-1 rounded-md text-xs font-semibold transition-all"
          style={{ background: active === p ? PRIMARY : 'transparent', color: active === p ? 'white' : '#94a3b8' }}
        >
          {p === 'month' ? 'Mensal' : 'Diário'}
        </button>
      ))}
    </div>
  );
}

// ── Tooltip style ────────────────────────────────────────────────────────────

const tooltipStyle = {
  contentStyle: { background: '#1E1E1E', border: '1px solid #2A3135', borderRadius: 8, fontSize: 12, color: '#e2e8f0' },
  itemStyle: { color: '#e2e8f0' },
};

// ── Chart Tabs ───────────────────────────────────────────────────────────────

type ChartTab = 'overview' | 'mrr' | 'churn' | 'arpu' | 'ltv' | 'costs';

const chartTabs: { key: ChartTab; label: string; icon: string }[] = [
  { key: 'overview', label: 'Visão Geral', icon: 'dashboard' },
  { key: 'mrr', label: 'MRR', icon: 'attach_money' },
  { key: 'costs', label: 'Receita vs Custo', icon: 'balance' },
  { key: 'arpu', label: 'ARPU', icon: 'person' },
  { key: 'ltv', label: 'LTV', icon: 'timeline' },
  { key: 'churn', label: 'Churn', icon: 'trending_down' },
];

// ── Data Table ───────────────────────────────────────────────────────────────

function DataTable({ data, nameKey, valueKey, colors }: {
  data: { [key: string]: any }[];
  nameKey: string;
  valueKey: string;
  colors: Record<string, string>;
}) {
  const total = data.reduce((s, d) => s + (d[valueKey] || 0), 0);
  return (
    <div className="space-y-2 py-2">
      {data.map((item) => {
        const name = item[nameKey];
        const count = item[valueKey] || 0;
        const pct = total > 0 ? ((count / total) * 100).toFixed(1) : '0.0';
        return (
          <div key={name} className="flex items-center justify-between px-1 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: colors[name] ?? PRIMARY }} />
              <span className="text-sm text-slate-200">{name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-white">{count}</span>
              <span className="text-xs text-slate-500 w-12 text-right">{pct}%</span>
            </div>
          </div>
        );
      })}
      <div className="flex items-center justify-between px-1 pt-2 border-t border-white/5">
        <span className="text-xs font-semibold text-slate-400">Total</span>
        <span className="text-sm font-bold text-white">{total}</span>
      </div>
    </div>
  );
}

// ── Vertical Bar Chart for mini sections ─────────────────────────────────────

function VerticalBarMini({ data, nameKey, valueKey, colors }: {
  data: { [key: string]: any }[];
  nameKey: string;
  valueKey: string;
  colors: Record<string, string>;
}) {
  return (
    <div style={{ height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke="#2A3135" vertical={false} />
          <XAxis dataKey={nameKey} tick={{ fill: '#e2e8f0', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip contentStyle={tooltipStyle.contentStyle} itemStyle={tooltipStyle.itemStyle} formatter={(v: number) => [`${v}`, 'Total']} />
          <Bar dataKey={valueKey} radius={[6, 6, 0, 0]} maxBarSize={40}>
            {data.map((item, i) => (
              <Cell key={i} fill={colors[item[nameKey]] ?? [PRIMARY, ACCENT, PURPLE][i % 3]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function AdminDashboard({ metrics }: { metrics: Metrics }) {
  const [activeChart, setActiveChart] = useState<ChartTab>('overview');
  const [period, setPeriod] = useState<Period>('month');
  const [planView, setPlanView] = useState<MiniChartType>('donut');
  const [segView, setSegView] = useState<MiniChartType>('bar');

  const maxCost = Math.max(...metrics.apiCosts.map((c) => c.cost), 0.01);

  // Use daily or monthly data
  const chartData = period === 'day' && metrics.dailyHistory ? metrics.dailyHistory : metrics.revenueHistory;
  const xKey = period === 'day' ? 'day' : 'month';

  return (
    <div className="admin-dashboard w-full space-y-6 p-4 md:p-6" style={{ background: '#0A0A0A', minHeight: '100vh' }}>
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Painel Administrativo</h1>
          <p className="text-sm text-slate-400">
            Dados reais do sistema &middot; {metrics.totalUsers} usuários cadastrados
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="material-symbols-outlined text-sm">update</span>
          Atualizado agora
        </div>
      </div>

      {/* ── Top metric cards ────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon="attach_money"
          label="MRR"
          value={formatBRL(metrics.mrr)}
          sub={`${metrics.payingUsers} assinantes pagantes`}
        />
        <StatCard
          icon="trending_down"
          label="Churn Rate"
          value={metrics.churnRate.toFixed(1) + '%'}
          sub={`${metrics.canceledSubscriptions} cancelamentos de ${metrics.activeSubscriptions + metrics.canceledSubscriptions} total`}
        />
        <StatCard
          icon="person"
          label="ARPU"
          value={formatBRL(metrics.arpu)}
          sub={metrics.payingUsers > 0 ? 'Receita por pagante' : 'Nenhum pagante ainda'}
        />
        <StatCard
          icon="timeline"
          label="LTV"
          value={formatBRL(metrics.ltv)}
          sub={metrics.churnRate > 0 ? `Baseado no churn de ${metrics.churnRate.toFixed(1)}%` : 'Estimativa 12 meses'}
        />
      </div>

      {/* ── Chart Selector Tabs + Period ──────────────────────────── */}
      <div
        className="rounded-2xl p-5 md:p-6"
        style={{ background: '#121212', border: '1px solid #2A3135' }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
          <div className="flex flex-wrap gap-2">
            {chartTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveChart(tab.key)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: activeChart === tab.key ? PRIMARY : '#1E1E1E',
                  color: activeChart === tab.key ? 'white' : '#94a3b8',
                  border: `1px solid ${activeChart === tab.key ? PRIMARY : '#2A3135'}`,
                }}
              >
                <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
          <PeriodSwitcher active={period} onChange={setPeriod} />
        </div>

        {/* ── Overview: combined chart ── */}
        {activeChart === 'overview' && (
          <div>
            <h2 className="text-sm font-semibold text-white mb-1 flex items-center">
              Métricas SaaS {period === 'day' ? '— Últimos 30 dias' : '— Últimos 6 meses'}
              <InfoBadge term="MRR" />
            </h2>
            <p className="text-xs text-slate-500 mb-4">MRR, ARPU e LTV consolidados</p>
            <div style={{ height: 340 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A3135" />
                  <XAxis dataKey={xKey} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle.contentStyle} itemStyle={tooltipStyle.itemStyle} formatter={(value: number, name: string) => {
                    if (name === 'Usuários') return [value, name];
                    return [formatBRL(value), name];
                  }} />
                  <Area yAxisId="left" type="monotone" dataKey="mrr" name="MRR" fill={PRIMARY + '30'} stroke={PRIMARY} strokeWidth={2} />
                  <Line yAxisId="left" type="monotone" dataKey="arpu" name="ARPU" stroke={GREEN} strokeWidth={2} dot={{ r: 3, fill: GREEN }} />
                  <Line yAxisId="left" type="monotone" dataKey="ltv" name="LTV" stroke={ACCENT} strokeWidth={2} dot={{ r: 3, fill: ACCENT }} strokeDasharray="5 5" />
                  <Bar yAxisId="right" dataKey="users" name="Usuários" fill={PURPLE + '60'} radius={[4, 4, 0, 0]} maxBarSize={24} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── MRR chart ── */}
        {activeChart === 'mrr' && (
          <div>
            <h2 className="text-sm font-semibold text-white mb-1 flex items-center">
              MRR — Receita Recorrente Mensal <InfoBadge term="MRR" />
            </h2>
            <p className="text-xs text-slate-500 mb-4">Evolução da receita mensal recorrente</p>
            <div style={{ height: 340 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A3135" />
                  <XAxis dataKey={xKey} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle.contentStyle} itemStyle={tooltipStyle.itemStyle} formatter={(v: number) => formatBRL(v)} />
                  <Area type="monotone" dataKey="mrr" name="MRR" fill={GREEN + '25'} stroke={GREEN} strokeWidth={2.5} />
                  <Line type="monotone" dataKey="mrr" name="MRR" stroke={GREEN} strokeWidth={2.5} dot={{ r: 4, fill: GREEN, strokeWidth: 2, stroke: '#121212' }} activeDot={{ r: 6 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── Receita vs Custo ── */}
        {activeChart === 'costs' && (
          <div>
            <h2 className="text-sm font-semibold text-white mb-1">Receita vs Custo Operacional</h2>
            <p className="text-xs text-slate-500 mb-4">Comparativo de receita e custos de API</p>
            <div style={{ height: 340 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A3135" />
                  <XAxis dataKey={xKey} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle.contentStyle} itemStyle={tooltipStyle.itemStyle} formatter={(v: number) => formatBRL(v)} />
                  <Area type="monotone" dataKey="mrr" name="Receita" fill={GREEN + '20'} stroke={GREEN} strokeWidth={2} />
                  <Area type="monotone" dataKey="cost" name="Custo" fill={RED + '20'} stroke={RED} strokeWidth={2} />
                  <Line type="monotone" dataKey="mrr" name="Receita" stroke={GREEN} strokeWidth={2} dot={{ r: 3, fill: GREEN }} />
                  <Line type="monotone" dataKey="cost" name="Custo" stroke={RED} strokeWidth={2} dot={{ r: 3, fill: RED }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── ARPU chart ── */}
        {activeChart === 'arpu' && (
          <div>
            <h2 className="text-sm font-semibold text-white mb-1 flex items-center">
              ARPU — Receita Média por Usuário <InfoBadge term="ARPU" />
            </h2>
            <p className="text-xs text-slate-500 mb-4">Quanto cada usuário gera de receita em média</p>
            <div style={{ height: 340 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A3135" />
                  <XAxis dataKey={xKey} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle.contentStyle} itemStyle={tooltipStyle.itemStyle} formatter={(v: number) => formatBRL(v)} />
                  <Line type="monotone" dataKey="arpu" name="ARPU" stroke={PURPLE} strokeWidth={2.5} dot={{ r: 4, fill: PURPLE, strokeWidth: 2, stroke: '#121212' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── LTV chart ── */}
        {activeChart === 'ltv' && (
          <div>
            <h2 className="text-sm font-semibold text-white mb-1 flex items-center">
              LTV — Lifetime Value <InfoBadge term="LTV" />
            </h2>
            <p className="text-xs text-slate-500 mb-4">Valor estimado de cada cliente ao longo do tempo</p>
            <div style={{ height: 340 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A3135" />
                  <XAxis dataKey={xKey} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle.contentStyle} itemStyle={tooltipStyle.itemStyle} formatter={(v: number) => formatBRL(v)} />
                  <Area type="monotone" dataKey="ltv" name="LTV" fill={ACCENT + '20'} stroke={ACCENT} strokeWidth={2.5} />
                  <Line type="monotone" dataKey="ltv" name="LTV" stroke={ACCENT} strokeWidth={2.5} dot={{ r: 4, fill: ACCENT, strokeWidth: 2, stroke: '#121212' }} activeDot={{ r: 6 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── Churn chart ── */}
        {activeChart === 'churn' && (
          <div>
            <h2 className="text-sm font-semibold text-white mb-1 flex items-center">
              Churn Rate <InfoBadge term="Churn Rate" />
            </h2>
            <p className="text-xs text-slate-500 mb-4">Taxa de cancelamento de assinaturas</p>
            <div style={{ height: 340 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A3135" />
                  <XAxis dataKey={xKey} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip contentStyle={tooltipStyle.contentStyle} itemStyle={tooltipStyle.itemStyle} formatter={(v: number) => [v.toFixed(1) + '%', 'Churn']} />
                  <Area type="monotone" dataKey="churn" name="Churn" fill={RED + '20'} stroke={RED} strokeWidth={2.5} />
                  <Line type="monotone" dataKey="churn" name="Churn" stroke={RED} strokeWidth={2.5} dot={{ r: 4, fill: RED, strokeWidth: 2, stroke: '#121212' }} activeDot={{ r: 6 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* ── API Costs + Plan Distribution + Segmentation ──────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* API Burn Rate */}
        <div className="rounded-2xl p-5 md:p-6" style={{ background: '#121212', border: '1px solid #2A3135' }}>
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-white">Custo de API</h2>
            <span className="text-lg font-bold text-white">{formatBRL(metrics.totalApiCost)}</span>
          </div>
          <p className="text-xs text-slate-500 mb-4">Total acumulado por provedor</p>

          <div className="space-y-3">
            {metrics.apiCosts.map((item) => {
              const pct = maxCost > 0 ? (item.cost / maxCost) * 100 : 0;
              return (
                <div key={item.provider}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-300">{item.provider}</span>
                    <span className="text-slate-400">{formatBRL(item.cost)}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: '#1E1E1E' }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${Math.max(pct, item.cost > 0 ? 3 : 0)}%`, background: `linear-gradient(90deg, ${PRIMARY}, ${ACCENT})` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {metrics.totalApiCost === 0 && (
            <p className="text-xs text-slate-600 mt-4 text-center">Nenhum custo registrado ainda</p>
          )}
        </div>

        {/* Plan Distribution — 3 views */}
        <div className="rounded-2xl p-5 md:p-6" style={{ background: '#121212', border: '1px solid #2A3135' }}>
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-white">Distribuição de Planos</h2>
            <ChartSwitcher active={planView} onChange={setPlanView} />
          </div>
          <p className="text-xs text-slate-500 mb-2">{metrics.activeSubscriptions} assinaturas ativas</p>

          {metrics.planDistribution.length > 0 ? (
            <>
              {planView === 'donut' && (
                <div className="flex items-center justify-center" style={{ height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={metrics.planDistribution}
                        dataKey="count"
                        nameKey="plan"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                        stroke="none"
                      >
                        {metrics.planDistribution.map((entry) => (
                          <Cell key={entry.plan} fill={PLAN_COLORS[entry.plan] ?? PRIMARY} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={tooltipStyle.contentStyle}
                        itemStyle={tooltipStyle.itemStyle}
                        formatter={(value: number, name: string) => [`${value} usuários`, name]}
                      />
                      <Legend
                        verticalAlign="bottom"
                        iconType="circle"
                        iconSize={8}
                        formatter={(value: string) => <span style={{ color: '#e2e8f0', fontSize: 11 }}>{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {planView === 'bar' && (
                <VerticalBarMini data={metrics.planDistribution} nameKey="plan" valueKey="count" colors={PLAN_COLORS} />
              )}

              {planView === 'table' && (
                <DataTable data={metrics.planDistribution} nameKey="plan" valueKey="count" colors={PLAN_COLORS} />
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="material-symbols-outlined text-3xl text-slate-600 mb-2">pie_chart</span>
              <p className="text-xs text-slate-500">Nenhuma assinatura ativa</p>
            </div>
          )}
        </div>

        {/* User Segmentation — 3 views */}
        <div className="rounded-2xl p-5 md:p-6" style={{ background: '#121212', border: '1px solid #2A3135' }}>
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-white">Segmentação de Usuários</h2>
            <ChartSwitcher active={segView} onChange={setSegView} />
          </div>
          <p className="text-xs text-slate-500 mb-2">Por nível de senioridade</p>

          {metrics.userSegmentation.length > 0 ? (
            <>
              {segView === 'donut' && (
                <div className="flex items-center justify-center" style={{ height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={metrics.userSegmentation}
                        dataKey="count"
                        nameKey="seniority"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                        stroke="none"
                      >
                        {metrics.userSegmentation.map((entry) => (
                          <Cell key={entry.seniority} fill={SEG_COLORS[entry.seniority] ?? PRIMARY} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={tooltipStyle.contentStyle}
                        itemStyle={tooltipStyle.itemStyle}
                        formatter={(value: number, name: string) => [`${value} usuários`, name]}
                      />
                      <Legend
                        verticalAlign="bottom"
                        iconType="circle"
                        iconSize={8}
                        formatter={(value: string) => <span style={{ color: '#e2e8f0', fontSize: 11 }}>{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {segView === 'bar' && (
                <VerticalBarMini data={metrics.userSegmentation} nameKey="seniority" valueKey="count" colors={SEG_COLORS} />
              )}

              {segView === 'table' && (
                <DataTable data={metrics.userSegmentation} nameKey="seniority" valueKey="count" colors={SEG_COLORS} />
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="material-symbols-outlined text-3xl text-slate-600 mb-2">group</span>
              <p className="text-xs text-slate-500">Nenhum usuário com senioridade definida</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
