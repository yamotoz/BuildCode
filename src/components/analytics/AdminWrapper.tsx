import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import AdminDashboard from './AdminDashboard';

const supabase = createClient(
  (import.meta as any).env.PUBLIC_SUPABASE_URL,
  (import.meta as any).env.PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminWrapper() {
  const [state, setState] = useState<'loading' | 'unauth' | 'error' | 'ready'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      // Auth check
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setState('unauth'); return; }

      const { data: profile } = await supabase
        .from('profiles').select('role').eq('id', session.user.id).single();

      if (!profile || !['master', 'admin'].includes(profile.role)) {
        setState('unauth'); return;
      }

      // Fetch all data
      const [subsRes, costsRes, profsRes, usageRes] = await Promise.all([
        supabase.from('subscriptions').select('plan, status, created_at, current_period_end'),
        supabase.from('api_costs').select('*').order('period_date', { ascending: true }).limit(365),
        supabase.from('profiles').select('seniority, created_at'),
        supabase.from('usage_logs').select('cost_usd, created_at').order('created_at', { ascending: true }).limit(1000),
      ]);

      const subs = subsRes.data || [];
      const costs = costsRes.data || [];
      const profs = profsRes.data || [];
      const usage = usageRes.data || [];

      const active = subs.filter((s: any) => s.status === 'active');
      const canceled = subs.filter((s: any) => s.status === 'canceled');
      const prices: Record<string, number> = { explorador: 0, consultor: 35, arquiteto: 50 };

      // ── Real MRR ──
      const mrr = active.reduce((s: number, x: any) => s + (prices[x.plan] || 0), 0);

      // ── Real Churn Rate ──
      const totalSubs = subs.length;
      const churnRate = totalSubs > 0 ? (canceled.length / totalSubs) * 100 : 0;

      // ── Real ARPU & LTV ──
      const payingUsers = active.filter((s: any) => prices[s.plan] > 0).length;
      const arpu = payingUsers > 0 ? mrr / payingUsers : 0;
      const ltv = churnRate > 0 ? (arpu / (churnRate / 100)) : arpu * 12;

      // ── API Costs (real from api_costs table) ──
      const apiCosts = [
        { provider: 'OpenAI', cost: 0 }, { provider: 'OpenRouter', cost: 0 },
        { provider: 'Supabase', cost: 0 }, { provider: 'Vercel', cost: 0 },
      ];
      costs.forEach((c: any) => {
        const e = apiCosts.find(a => a.provider.toLowerCase() === c.provider?.toLowerCase());
        if (e) e.cost += Number(c.total_cost_usd) || 0;
      });

      // ── Build monthly history from real data ──
      const monthNames = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
      const now = new Date();
      const monthlyHistory: Record<string, { revenue: number; cost: number; users: number }> = {};

      // Initialize last 6 months
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        monthlyHistory[key] = { revenue: 0, cost: 0, users: 0 };
      }

      // Revenue: count active subs that existed in each month
      Object.keys(monthlyHistory).forEach(monthKey => {
        const [y, m] = monthKey.split('-').map(Number);
        const monthStart = new Date(y, m - 1, 1);
        const monthEnd = new Date(y, m, 0, 23, 59, 59);

        subs.forEach((s: any) => {
          const createdAt = new Date(s.created_at);
          const isActiveInMonth = createdAt <= monthEnd && (s.status === 'active' || (s.current_period_end && new Date(s.current_period_end) >= monthStart));
          if (isActiveInMonth) {
            monthlyHistory[monthKey].revenue += prices[s.plan] || 0;
          }
        });
      });

      // Costs: aggregate api_costs by month
      costs.forEach((c: any) => {
        if (!c.period_date) return;
        const d = new Date(c.period_date);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        if (monthlyHistory[key]) {
          monthlyHistory[key].cost += Number(c.total_cost_usd) || 0;
        }
      });

      // Usage costs fallback (if api_costs is empty, use usage_logs)
      if (costs.length === 0) {
        usage.forEach((u: any) => {
          if (!u.created_at) return;
          const d = new Date(u.created_at);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          if (monthlyHistory[key]) {
            monthlyHistory[key].cost += Number(u.cost_usd) || 0;
          }
        });
      }

      // Users: count profiles created up to each month
      Object.keys(monthlyHistory).forEach(monthKey => {
        const [y, m] = monthKey.split('-').map(Number);
        const monthEnd = new Date(y, m, 0, 23, 59, 59);
        monthlyHistory[monthKey].users = profs.filter((p: any) => new Date(p.created_at) <= monthEnd).length;
      });

      const revenueHistory = Object.entries(monthlyHistory).map(([key, data]) => {
        const [, m] = key.split('-').map(Number);
        const usersInMonth = data.users || 1;
        const monthMrr = data.revenue;
        return {
          month: monthNames[m - 1],
          mrr: monthMrr,
          cost: Number(data.cost.toFixed(2)),
          users: data.users,
          arpu: Number((monthMrr / usersInMonth).toFixed(2)),
          ltv: churnRate > 0
            ? Number(((monthMrr / usersInMonth) / (churnRate / 100)).toFixed(2))
            : Number(((monthMrr / usersInMonth) * 12).toFixed(2)),
          churn: churnRate, // static for now — no monthly churn snapshots
        };
      });

      // ── Build daily history (last 30 days) ──
      const dailyHistory: Record<string, { revenue: number; cost: number; users: number }> = {};
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        dailyHistory[key] = { revenue: 0, cost: 0, users: 0 };
      }

      Object.keys(dailyHistory).forEach(dayKey => {
        const dayDate = new Date(dayKey + 'T23:59:59');
        // Revenue: subs active on that day
        subs.forEach((s: any) => {
          const createdAt = new Date(s.created_at);
          if (createdAt <= dayDate && (s.status === 'active' || (s.current_period_end && new Date(s.current_period_end) >= dayDate))) {
            dailyHistory[dayKey].revenue += (prices[s.plan] || 0) / 30; // daily pro-rata
          }
        });
        // Costs
        costs.forEach((c: any) => {
          if (!c.period_date) return;
          const costDate = c.period_date.substring(0, 10);
          if (costDate === dayKey) {
            dailyHistory[dayKey].cost += Number(c.total_cost_usd) || 0;
          }
        });
        if (costs.length === 0) {
          usage.forEach((u: any) => {
            if (!u.created_at) return;
            const uDate = u.created_at.substring(0, 10);
            if (uDate === dayKey) {
              dailyHistory[dayKey].cost += Number(u.cost_usd) || 0;
            }
          });
        }
        // Users
        dailyHistory[dayKey].users = profs.filter((p: any) => new Date(p.created_at) <= dayDate).length;
      });

      const dailyHistoryArr = Object.entries(dailyHistory).map(([key, data]) => {
        const usersOnDay = data.users || 1;
        const dayMrr = Number(data.revenue.toFixed(2));
        return {
          day: key.substring(5), // MM-DD
          mrr: dayMrr,
          cost: Number(data.cost.toFixed(2)),
          users: data.users,
          arpu: Number((dayMrr / usersOnDay).toFixed(2)),
          ltv: churnRate > 0
            ? Number(((dayMrr / usersOnDay) / (churnRate / 100)).toFixed(2))
            : Number(((dayMrr / usersOnDay) * 12).toFixed(2)),
          churn: churnRate,
        };
      });

      // ── Plan Distribution ──
      const planDistribution = [
        { plan: 'Explorador', count: active.filter((s: any) => s.plan === 'explorador').length },
        { plan: 'Consultor', count: active.filter((s: any) => s.plan === 'consultor').length },
        { plan: 'Arquiteto', count: active.filter((s: any) => s.plan === 'arquiteto').length },
      ].filter(p => p.count > 0); // only show plans that have users

      // ── User Segmentation ──
      const userSegmentation = [
        { seniority: 'Junior', count: profs.filter((p: any) => p.seniority === 'junior').length },
        { seniority: 'Pleno', count: profs.filter((p: any) => p.seniority === 'pleno').length },
        { seniority: 'Senior', count: profs.filter((p: any) => p.seniority === 'senior').length },
      ].filter(s => s.count > 0);

      setMetrics({
        mrr,
        churnRate,
        arpu,
        ltv,
        totalUsers: profs.length,
        activeSubscriptions: active.length,
        canceledSubscriptions: canceled.length,
        payingUsers,
        totalApiCost: apiCosts.reduce((s, a) => s + a.cost, 0),
        apiCosts,
        planDistribution,
        revenueHistory,
        dailyHistory: dailyHistoryArr,
        userSegmentation,
      });

      setState('ready');
    } catch (err: any) {
      console.error('[AdminWrapper] error:', err);
      setErrorMsg(err?.message || 'Erro desconhecido');
      setState('error');
    }
  }

  if (state === 'loading') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '128px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '36px', color: '#2E748B', animation: 'spin 1s linear infinite' }}>progress_activity</span>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (state === 'unauth') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '128px 0', textAlign: 'center' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#475569', marginBottom: '16px' }}>lock</span>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>Acesso Restrito</h2>
        <p style={{ color: '#94a3b8', marginBottom: '24px' }}>Apenas administradores podem acessar esta página.</p>
        <a href="/perfil" style={{ padding: '12px 24px', borderRadius: '12px', background: '#2E748B', color: 'white', fontWeight: 600, textDecoration: 'none' }}>Voltar ao Perfil</a>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', textAlign: 'center' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#f87171', marginBottom: '16px' }}>error</span>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>Erro ao carregar dashboard</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '16px' }}>{errorMsg}</p>
        <button onClick={() => location.reload()} style={{ padding: '8px 24px', borderRadius: '12px', background: '#2E748B', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Tentar novamente</button>
      </div>
    );
  }

  if (metrics) {
    return <AdminDashboard metrics={metrics} />;
  }

  return null;
}
