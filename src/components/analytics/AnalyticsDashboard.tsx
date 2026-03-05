import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, GitFork, AlertCircle, Activity,
  ArrowRight, Zap, TrendingUp, Loader2, Search
} from 'lucide-react';
import { StarsChart } from './StarsChart';
import { RadarChart } from './RadarChart';
import { PulseGrid } from './PulseGrid';
import { MetricCard } from './MetricCard';
import { AIInsight } from './AIInsight';

interface RepoData {
  name: string;
  description: string;
  stars: number;
  forks: number;
  openIssues: number;
  language: string;
  pushedAt: string;
  createdAt: string;
  license: string | null;
  commitActivity: number[];
  commitsLast30Days: number;
}

interface ComparisonData {
  a: RepoData;
  b: RepoData;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n.toString();
}

// All available stacks (display names mapped to search keys)
const STACK_OPTIONS = [
  { label: 'React', category: 'Frontend' },
  { label: 'Next.js', category: 'Frontend' },
  { label: 'Vue', category: 'Frontend' },
  { label: 'Nuxt', category: 'Frontend' },
  { label: 'Angular', category: 'Frontend' },
  { label: 'Svelte', category: 'Frontend' },
  { label: 'SvelteKit', category: 'Frontend' },
  { label: 'Astro', category: 'Frontend' },
  { label: 'Solid', category: 'Frontend' },
  { label: 'Remix', category: 'Frontend' },
  { label: 'Gatsby', category: 'Frontend' },
  { label: 'Preact', category: 'Frontend' },
  { label: 'Qwik', category: 'Frontend' },
  { label: 'Lit', category: 'Frontend' },
  { label: 'HTMX', category: 'Frontend' },
  { label: 'Alpine.js', category: 'Frontend' },
  { label: 'Ember', category: 'Frontend' },
  { label: 'Node.js', category: 'Backend' },
  { label: 'Deno', category: 'Backend' },
  { label: 'Bun', category: 'Backend' },
  { label: 'Express', category: 'Backend' },
  { label: 'Fastify', category: 'Backend' },
  { label: 'NestJS', category: 'Backend' },
  { label: 'Django', category: 'Backend' },
  { label: 'Flask', category: 'Backend' },
  { label: 'FastAPI', category: 'Backend' },
  { label: 'Spring Boot', category: 'Backend' },
  { label: 'Rails', category: 'Backend' },
  { label: 'Laravel', category: 'Backend' },
  { label: 'Phoenix', category: 'Backend' },
  { label: 'Gin', category: 'Backend' },
  { label: 'Fiber', category: 'Backend' },
  { label: 'Hono', category: 'Backend' },
  { label: 'Elysia', category: 'Backend' },
  { label: 'Koa', category: 'Backend' },
  { label: 'AdonisJS', category: 'Backend' },
  { label: 'React Native', category: 'Mobile' },
  { label: 'Flutter', category: 'Mobile' },
  { label: 'Expo', category: 'Mobile' },
  { label: 'Ionic', category: 'Mobile' },
  { label: 'Tauri', category: 'Desktop' },
  { label: 'Electron', category: 'Desktop' },
  { label: 'PostgreSQL', category: 'Database' },
  { label: 'MySQL', category: 'Database' },
  { label: 'MongoDB', category: 'Database' },
  { label: 'Redis', category: 'Database' },
  { label: 'Supabase', category: 'Database' },
  { label: 'Firebase', category: 'Database' },
  { label: 'Prisma', category: 'ORM' },
  { label: 'Drizzle', category: 'ORM' },
  { label: 'TypeORM', category: 'ORM' },
  { label: 'Sequelize', category: 'ORM' },
  { label: 'Mongoose', category: 'ORM' },
  { label: 'Docker', category: 'DevOps' },
  { label: 'Kubernetes', category: 'DevOps' },
  { label: 'Terraform', category: 'DevOps' },
  { label: 'Grafana', category: 'DevOps' },
  { label: 'Prometheus', category: 'DevOps' },
  { label: 'TailwindCSS', category: 'CSS' },
  { label: 'Bootstrap', category: 'CSS' },
  { label: 'Shadcn', category: 'CSS' },
  { label: 'Vite', category: 'Tooling' },
  { label: 'Webpack', category: 'Tooling' },
  { label: 'Turborepo', category: 'Tooling' },
  { label: 'ESBuild', category: 'Tooling' },
  { label: 'SWC', category: 'Tooling' },
  { label: 'Biome', category: 'Tooling' },
  { label: 'ESLint', category: 'Tooling' },
  { label: 'Prettier', category: 'Tooling' },
  { label: 'Jest', category: 'Testing' },
  { label: 'Vitest', category: 'Testing' },
  { label: 'Playwright', category: 'Testing' },
  { label: 'Cypress', category: 'Testing' },
  { label: 'Storybook', category: 'Testing' },
  { label: 'Redux', category: 'State' },
  { label: 'Zustand', category: 'State' },
  { label: 'tRPC', category: 'API' },
  { label: 'GraphQL', category: 'API' },
  { label: 'TensorFlow', category: 'AI/ML' },
  { label: 'PyTorch', category: 'AI/ML' },
  { label: 'LangChain', category: 'AI/ML' },
  { label: 'TypeScript', category: 'Linguagem' },
  { label: 'Rust', category: 'Linguagem' },
  { label: 'Go', category: 'Linguagem' },
  { label: 'Python', category: 'Linguagem' },
  { label: 'Kotlin', category: 'Linguagem' },
  { label: 'Swift', category: 'Linguagem' },
  { label: 'Zig', category: 'Linguagem' },
];

const CATEGORY_COLORS: Record<string, string> = {
  'Frontend': '#2E748B',
  'Backend': '#22c55e',
  'Mobile': '#a855f7',
  'Desktop': '#6366f1',
  'Database': '#F2AB6D',
  'ORM': '#f59e0b',
  'DevOps': '#ef4444',
  'CSS': '#ec4899',
  'Tooling': '#64748b',
  'Testing': '#14b8a6',
  'State': '#8b5cf6',
  'API': '#06b6d4',
  'AI/ML': '#f43f5e',
  'Linguagem': '#84cc16',
};

interface AutocompleteInputProps {
  value: string;
  onChange: (val: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  placeholder: string;
  color: string;
  label: string;
  side: 'A' | 'B';
}

function AutocompleteInput({ value, onChange, onKeyDown, placeholder, color, label, side }: AutocompleteInputProps) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = value.trim().length === 0
    ? STACK_OPTIONS
    : STACK_OPTIONS.filter(s =>
        s.label.toLowerCase().includes(value.toLowerCase()) ||
        s.category.toLowerCase().includes(value.toLowerCase())
      );

  // Group by category
  const grouped = filtered.reduce<Record<string, typeof STACK_OPTIONS>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const flatList = filtered;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setHighlighted(-1);
  }, [value]);

  const handleSelect = (label: string) => {
    onChange(label);
    setOpen(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setHighlighted(prev => Math.min(prev + 1, flatList.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && highlighted >= 0 && open) {
      e.preventDefault();
      handleSelect(flatList[highlighted].label);
    } else if (e.key === 'Escape') {
      setOpen(false);
    } else {
      onKeyDown(e);
    }
  };

  return (
    <div className="flex-1 relative" ref={containerRef}>
      <div className="flex items-center bg-white/5 rounded-xl px-4 py-3 gap-3">
        <span className="text-sm font-bold" style={{ color }}>{label}</span>
        <input
          className="bg-transparent border-none focus:ring-0 p-0 text-sm font-medium w-full outline-none text-white placeholder-slate-500"
          type="text"
          value={value}
          onChange={e => { onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          {...(side === 'B' ? { 'data-i18n-placeholder': 'analytics.inputB.placeholder' } : {})}
        />
      </div>

      <AnimatePresence>
        {open && filtered.length > 0 && (
          <motion.div
            ref={listRef}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 top-full mt-2 w-full max-h-[320px] overflow-y-auto rounded-xl py-2"
            style={{
              background: '#1a1a1a',
              border: '1px solid #2A3135',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            }}
          >
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <div className="px-3 pt-2 pb-1 flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: CATEGORY_COLORS[category] || '#64748b' }}
                  />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                    {category}
                  </span>
                </div>
                {items.map((item) => {
                  const idx = flatList.indexOf(item);
                  return (
                    <button
                      key={item.label}
                      type="button"
                      className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer flex items-center justify-between ${
                        idx === highlighted
                          ? 'bg-white/10 text-white'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                      onMouseDown={() => handleSelect(item.label)}
                      onMouseEnter={() => setHighlighted(idx)}
                    >
                      <span className="font-medium">{item.label}</span>
                      <span
                        className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                        style={{
                          color: CATEGORY_COLORS[item.category] || '#64748b',
                          background: (CATEGORY_COLORS[item.category] || '#64748b') + '15',
                        }}
                      >
                        {item.category}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AnalyticsDashboard() {
  const [techA, setTechA] = useState('Next.js');
  const [techB, setTechB] = useState('Astro');
  const [data, setData] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasCompared, setHasCompared] = useState(false);

  const compare = useCallback(async () => {
    if (!techA.trim() || !techB.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/github?a=${encodeURIComponent(techA)}&b=${encodeURIComponent(techB)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setData(json);
      setHasCompared(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [techA, techB]);

  useEffect(() => {
    compare();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') compare();
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12 flex flex-col items-center text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight mb-6 text-white" data-i18n="analytics.title">
          Compare Stacks Modernas
        </h1>

        <div className="w-full max-w-2xl rounded-2xl p-2 flex items-center gap-3"
          style={{
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <AutocompleteInput
            value={techA}
            onChange={setTechA}
            onKeyDown={handleKeyDown}
            placeholder="Ex: Next.js"
            color="#2E748B"
            label="A"
            side="A"
          />
          <div className="text-slate-500 font-mono text-xs uppercase tracking-widest select-none">VS</div>
          <AutocompleteInput
            value={techB}
            onChange={setTechB}
            onKeyDown={handleKeyDown}
            placeholder="Comparar com..."
            color="#F2AB6D"
            label="B"
            side="B"
          />
          <button
            onClick={compare}
            disabled={loading}
            className="bg-[#2E748B] hover:bg-[#367f97] text-white p-3 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          </button>
        </div>
      </motion.div>

      {/* Loading */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <Loader2 className="w-10 h-10 text-[#2E748B] animate-spin mb-4" />
            <p className="text-slate-400 text-sm" data-i18n="analytics.loading">Buscando dados do GitHub...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      {error && !loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-10"
        >
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
          <p className="text-red-400 text-sm">{error}</p>
        </motion.div>
      )}

      {/* Dashboard */}
      {data && !loading && (
        <motion.div
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div custom={0} variants={fadeUp}>
              <MetricCard
                label="Estrelas GitHub"
                labelKey="analytics.stars"
                icon={<Star className="w-5 h-5" />}
                valueA={data.a.stars}
                valueB={data.b.stars}
                nameA={techA}
                nameB={techB}
                format={formatNumber}
                accentColor="#2E748B"
              />
            </motion.div>
            <motion.div custom={1} variants={fadeUp}>
              <MetricCard
                label="Vitalidade de Commits"
                labelKey="analytics.commits"
                icon={<Activity className="w-5 h-5" />}
                valueA={data.a.commitsLast30Days}
                valueB={data.b.commitsLast30Days}
                nameA={techA}
                nameB={techB}
                format={formatNumber}
                accentColor="#2E748B"
              />
            </motion.div>
            <motion.div custom={2} variants={fadeUp}>
              <MetricCard
                label="Issues Abertas"
                labelKey="analytics.issues"
                icon={<AlertCircle className="w-5 h-5" />}
                valueA={data.a.openIssues}
                valueB={data.b.openIssues}
                nameA={techA}
                nameB={techB}
                format={formatNumber}
                accentColor="#2E748B"
                lowerIsBetter
              />
            </motion.div>
            <motion.div custom={3} variants={fadeUp}>
              <MetricCard
                label="Forks"
                labelKey="analytics.forks"
                icon={<GitFork className="w-5 h-5" />}
                valueA={data.a.forks}
                valueB={data.b.forks}
                nameA={techA}
                nameB={techB}
                format={formatNumber}
                accentColor="#2E748B"
              />
            </motion.div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div custom={4} variants={fadeUp} className="lg:col-span-2">
              <StarsChart
                dataA={data.a.commitActivity}
                dataB={data.b.commitActivity}
                nameA={techA}
                nameB={techB}
              />
            </motion.div>
            <motion.div custom={5} variants={fadeUp}>
              <RadarChart
                dataA={data.a}
                dataB={data.b}
                nameA={techA}
                nameB={techB}
              />
            </motion.div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <motion.div custom={6} variants={fadeUp} className="md:col-span-8">
              <PulseGrid
                activityA={data.a.commitActivity}
                activityB={data.b.commitActivity}
                nameA={techA}
                nameB={techB}
              />
            </motion.div>
            <motion.div custom={7} variants={fadeUp} className="md:col-span-4">
              <AIInsight
                dataA={data.a}
                dataB={data.b}
                nameA={techA}
                nameB={techB}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
