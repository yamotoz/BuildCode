import { Shield, Clock, Code2, Scale, Trophy } from 'lucide-react';
import { useTheme } from './useTheme';

interface RepoData {
  name: string;
  description: string;
  stars: number;
  forks: number;
  openIssues: number;
  language: string;
  pushedAt: string;
  commitsLast30Days: number;
  commitActivity: number[];
}

interface AIInsightProps {
  dataA: RepoData;
  dataB: RepoData;
  nameA: string;
  nameB: string;
}

function calcHealthScore(data: RepoData): number {
  let score = 0;
  score += Math.min(25, (data.stars / 5000) * 25);
  score += Math.min(25, (data.commitsLast30Days / 200) * 25);
  score += Math.min(20, (data.forks / 3000) * 20);
  const daysSincePush = Math.floor((Date.now() - new Date(data.pushedAt).getTime()) / (1000 * 60 * 60 * 24));
  score += daysSincePush <= 1 ? 15 : daysSincePush <= 7 ? 12 : daysSincePush <= 30 ? 8 : 3;
  const activeWeeks = data.commitActivity.slice(-12).filter(w => w > 0).length;
  score += (activeWeeks / 12) * 15;
  return Math.min(100, Math.round(score));
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#2E748B';
  if (score >= 40) return '#F2AB6D';
  return '#ef4444';
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excelente';
  if (score >= 60) return 'Saudável';
  if (score >= 40) return 'Moderado';
  return 'Atenção';
}

function timeAgo(dateStr: string): string {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Hoje';
  if (days === 1) return 'Ontem';
  if (days < 7) return `${days} dias`;
  if (days < 30) return `${Math.floor(days / 7)} sem`;
  return `${Math.floor(days / 30)} meses`;
}

interface BarProps {
  label: string;
  valA: number;
  valB: number;
  nameA: string;
  nameB: string;
  trackBg: string;
}

function CompareBar({ label, valA, valB, nameA, nameB, trackBg }: BarProps) {
  const max = Math.max(valA, valB, 1);
  const pctA = (valA / max) * 100;
  const pctB = (valB / max) * 100;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[10px] font-semibold uppercase tracking-wider">
        <span className="text-slate-500">{label}</span>
        <div className="flex gap-3">
          <span className="text-[#2E748B]">{nameA}</span>
          <span className="text-[#F2AB6D]">{nameB}</span>
        </div>
      </div>
      <div className="flex gap-1 h-2">
        <div className="flex-1 rounded-full overflow-hidden" style={{ background: trackBg }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pctA}%`, background: '#2E748B' }}
          />
        </div>
        <div className="flex-1 rounded-full overflow-hidden" style={{ background: trackBg }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pctB}%`, background: '#F2AB6D' }}
          />
        </div>
      </div>
    </div>
  );
}

export function AIInsight({ dataA, dataB, nameA, nameB }: AIInsightProps) {
  const t = useTheme();
  const scoreA = calcHealthScore(dataA);
  const scoreB = calcHealthScore(dataB);
  const winner = scoreA >= scoreB ? nameA : nameB;
  const winnerScore = Math.max(scoreA, scoreB);

  return (
    <div
      className="rounded-2xl p-6 relative overflow-hidden h-full flex flex-col"
      style={{ background: t.cardBg, border: `1px solid ${t.border}` }}
    >
      {/* Glow */}
      <div
        className="absolute -top-16 -right-16 w-44 h-44 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${getScoreColor(winnerScore)}15 0%, transparent 70%)` }}
      />

      <div className="relative z-10 flex flex-col h-full gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{ background: 'rgba(46, 116, 139, 0.1)', color: '#2E748B', border: '1px solid rgba(46, 116, 139, 0.2)' }}
          >
            <Shield className="w-3.5 h-3.5" />
            Saúde do Projeto
          </div>
          <Trophy className="w-4 h-4 text-[#F2AB6D]/40" />
        </div>

        {/* Score circles */}
        <div className="flex items-center justify-center gap-6">
          {[
            { name: nameA, score: scoreA, color: '#2E748B' },
            { name: nameB, score: scoreB, color: '#F2AB6D' },
          ].map(({ name, score, color }) => (
            <div key={name} className="flex flex-col items-center gap-1.5">
              <div className="relative w-16 h-16">
                <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
                  <circle cx="32" cy="32" r="28" fill="none" stroke={t.trackBg} strokeWidth="4" />
                  <circle
                    cx="32" cy="32" r="28"
                    fill="none"
                    stroke={getScoreColor(score)}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${(score / 100) * 175.9} 175.9`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold" style={{ color: t.textPrimary }}>{score}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color }}>
                {name}
              </span>
              <span className="text-[9px] font-medium" style={{ color: getScoreColor(score) }}>
                {getScoreLabel(score)}
              </span>
            </div>
          ))}
        </div>

        {/* Metric bars */}
        <div className="space-y-3 flex-1">
          <CompareBar label="Popularidade" valA={dataA.stars} valB={dataB.stars} nameA={nameA} nameB={nameB} trackBg={t.trackBg} />
          <CompareBar label="Atividade" valA={dataA.commitsLast30Days} valB={dataB.commitsLast30Days} nameA={nameA} nameB={nameB} trackBg={t.trackBg} />
          <CompareBar label="Comunidade" valA={dataA.forks} valB={dataB.forks} nameA={nameA} nameB={nameB} trackBg={t.trackBg} />
        </div>

        {/* Quick facts */}
        <div className="grid grid-cols-2 gap-2 pt-4" style={{ borderTop: `1px solid ${t.border}` }}>
          {[
            { icon: <Code2 className="w-3 h-3" />, label: dataA.language || '—', sub: nameA },
            { icon: <Code2 className="w-3 h-3" />, label: dataB.language || '—', sub: nameB },
            { icon: <Clock className="w-3 h-3" />, label: timeAgo(dataA.pushedAt), sub: 'Último push' },
            { icon: <Clock className="w-3 h-3" />, label: timeAgo(dataB.pushedAt), sub: 'Último push' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded-lg" style={{ background: t.controlBg }}>
              <span style={{ color: t.tickFill }}>{item.icon}</span>
              <div>
                <div className="text-[11px] font-semibold leading-tight" style={{ color: t.textPrimary }}>{item.label}</div>
                <div className="text-[9px]" style={{ color: t.tickFill }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Verdict */}
        <div
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs"
          style={{ background: t.controlBg, border: `1px solid ${t.controlBorder}` }}
        >
          <span className="font-medium" style={{ color: t.textSecondary }}>Vencedor geral</span>
          <span className="font-bold" style={{ color: getScoreColor(winnerScore) }}>
            {winner} ({winnerScore}/100)
          </span>
        </div>
      </div>
    </div>
  );
}
