import {
  Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer,
} from 'recharts';
import { useTheme } from './useTheme';

interface RepoData {
  stars: number;
  forks: number;
  openIssues: number;
  commitsLast30Days: number;
  commitActivity: number[];
  pushedAt: string;
}

interface RadarChartProps {
  dataA: RepoData;
  dataB: RepoData;
  nameA: string;
  nameB: string;
}

function normalize(val: number, max: number): number {
  if (max === 0) return 0;
  return Math.min(100, Math.round((val / max) * 100));
}

export function RadarChart({ dataA, dataB, nameA, nameB }: RadarChartProps) {
  const t = useTheme();
  const maxStars = Math.max(dataA.stars, dataB.stars);
  const maxForks = Math.max(dataA.forks, dataB.forks);
  const maxCommits = Math.max(dataA.commitsLast30Days, dataB.commitsLast30Days);
  const maxIssues = Math.max(dataA.openIssues, dataB.openIssues);

  const consistencyA = dataA.commitActivity.slice(-12).filter(w => w > 0).length;
  const consistencyB = dataB.commitActivity.slice(-12).filter(w => w > 0).length;
  const maxConsistency = Math.max(consistencyA, consistencyB);

  const radarData = [
    { metric: 'Popularidade', [nameA]: normalize(dataA.stars, maxStars), [nameB]: normalize(dataB.stars, maxStars) },
    { metric: 'Comunidade', [nameA]: normalize(dataA.forks, maxForks), [nameB]: normalize(dataB.forks, maxForks) },
    { metric: 'Atividade', [nameA]: normalize(dataA.commitsLast30Days, maxCommits), [nameB]: normalize(dataB.commitsLast30Days, maxCommits) },
    { metric: 'Consistência', [nameA]: normalize(consistencyA, maxConsistency), [nameB]: normalize(consistencyB, maxConsistency) },
    { metric: 'Engajamento', [nameA]: normalize(dataA.openIssues, maxIssues), [nameB]: normalize(dataB.openIssues, maxIssues) },
  ];

  const avgA = radarData.reduce((s, d) => s + (d[nameA] as number), 0) / radarData.length;
  const avgB = radarData.reduce((s, d) => s + (d[nameB] as number), 0) / radarData.length;
  const confidence = Math.round((avgA + avgB) / 2);

  return (
    <div
      className="rounded-2xl p-8 flex flex-col items-center justify-between h-full"
      style={{ background: t.cardBg, border: `1px solid ${t.border}` }}
    >
      <div className="w-full">
        <h2 className="text-lg font-bold" style={{ color: t.textPrimary }} data-i18n="analytics.performance">
          Matriz de Performance
        </h2>
        <p className="text-sm mb-4" style={{ color: t.textSecondary }} data-i18n="analytics.performance.sub">
          Análise dimensional de features
        </p>
      </div>
      <div className="w-full aspect-square px-2">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadar data={radarData} cx="50%" cy="50%" outerRadius="55%">
            <PolarGrid stroke={t.gridStroke} />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fill: t.textSecondary, fontSize: 11, fontWeight: 600 }}
              tickLine={false}
            />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar name={nameA} dataKey={nameA} stroke="#2E748B" fill="#2E748B" fillOpacity={0.25} strokeWidth={2} />
            <Radar name={nameB} dataKey={nameB} stroke="#F2AB6D" fill="#F2AB6D" fillOpacity={0.15} strokeWidth={2} />
          </RechartsRadar>
        </ResponsiveContainer>
      </div>
      <div
        className="w-full mt-2 flex items-center justify-between px-4 py-2 rounded-xl text-xs"
        style={{ background: t.controlBg, backdropFilter: 'blur(12px)', border: `1px solid ${t.controlBorder}` }}
      >
        <span className="font-medium" style={{ color: t.textSecondary }} data-i18n="analytics.confidence">Confiança Geral</span>
        <span className="text-[#2E748B] font-bold">{confidence}%</span>
      </div>
    </div>
  );
}
