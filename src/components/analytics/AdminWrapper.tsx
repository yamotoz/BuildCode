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
      // Verificação de autenticação
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setState('unauth'); return; }

      const { data: profile } = await supabase
        .from('profiles').select('role, can_access_dashboard').eq('id', session.user.id).single();

      if (!profile) { setState('unauth'); return; }
      const hasAccess = ['master', 'admin'].includes(profile.role) || profile.can_access_dashboard === true;
      if (!hasAccess) { setState('unauth'); return; }

      // Busca todos os dados
      const [subsRes, costsRes, profsRes, usageRes, usersRes, usageFullRes] = await Promise.all([
        supabase.from('subscriptions').select('plan, status, created_at, current_period_end, user_id, profiles!inner(role)'),
        supabase.from('api_costs').select('*').order('period_date', { ascending: true }).limit(365),
        supabase.from('profiles').select('seniority, created_at'),
        supabase.from('usage_logs').select('cost_usd, created_at').order('created_at', { ascending: true }).limit(1000),
        supabase.from('profiles').select('id, full_name, avatar_url, role, seniority, agent, llm_model, created_at, can_access_dashboard'),
        supabase.from('usage_logs').select('user_id, action, llm_model, tokens_used, cost_usd, created_at').order('created_at', { ascending: false }).limit(5000),
      ]);

      const subs = subsRes.data || [];
      const costs = costsRes.data || [];
      const profs = profsRes.data || [];
      const usage = usageRes.data || [];
      const users = usersRes.data || [];
      const usageFull = usageFullRes.data || [];

      // Filtra subscriptions: exclui master/admin via join direto com profiles
      const getSubRole = (s: any) => s.profiles?.role || '';
      const isPayingSub = (s: any) => !['master', 'admin'].includes(getSubRole(s));

      const active = subs.filter((s: any) => s.status === 'active');
      const canceled = subs.filter((s: any) => s.status === 'canceled');
      const prices: Record<string, number> = { explorador: 0, consultor: 35, arquiteto: 50 };

      // ── MRR Real (exclui master/admin) ──
      const activeExternal = active.filter(isPayingSub);
      const mrr = activeExternal.reduce((s: number, x: any) => s + (prices[x.plan] || 0), 0);

      // ── Taxa de Churn Real (exclui master/admin) ──
      const externalSubs = subs.filter(isPayingSub);
      const externalCanceled = canceled.filter(isPayingSub);
      const totalSubs = externalSubs.length;
      const churnRate = totalSubs > 0 ? (externalCanceled.length / totalSubs) * 100 : 0;

      // ── ARPU & LTV Reais (exclui master/admin) ──
      const payingUsers = activeExternal.filter((s: any) => prices[s.plan] > 0).length;
      const arpu = payingUsers > 0 ? mrr / payingUsers : 0;
      const ltv = churnRate > 0 ? (arpu / (churnRate / 100)) : arpu * 12;

      // ── Custos de API (dados reais da tabela api_costs) ──
      const apiCosts = [
        { provider: 'OpenAI', cost: 0 }, { provider: 'OpenRouter', cost: 0 },
        { provider: 'Supabase', cost: 0 }, { provider: 'Vercel', cost: 0 },
      ];
      costs.forEach((c: any) => {
        const e = apiCosts.find(a => a.provider.toLowerCase() === c.provider?.toLowerCase());
        if (e) e.cost += Number(c.total_cost_usd) || 0;
      });

      // ── Constrói histórico mensal a partir de dados reais ──
      const monthNames = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
      const now = new Date();
      const monthlyHistory: Record<string, { revenue: number; cost: number; users: number }> = {};

      // Inicializa últimos 6 meses
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        monthlyHistory[key] = { revenue: 0, cost: 0, users: 0 };
      }

      // Receita: conta assinaturas ativas em cada mês
      Object.keys(monthlyHistory).forEach(monthKey => {
        const [y, m] = monthKey.split('-').map(Number);
        const monthStart = new Date(y, m - 1, 1);
        const monthEnd = new Date(y, m, 0, 23, 59, 59);

        subs.filter(isPayingSub).forEach((s: any) => {
          const createdAt = new Date(s.created_at);
          const isActiveInMonth = createdAt <= monthEnd && (s.status === 'active' || (s.current_period_end && new Date(s.current_period_end) >= monthStart));
          if (isActiveInMonth) {
            monthlyHistory[monthKey].revenue += prices[s.plan] || 0;
          }
        });
      });

      // Custos: agrega api_costs por mês
      costs.forEach((c: any) => {
        if (!c.period_date) return;
        const d = new Date(c.period_date);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        if (monthlyHistory[key]) {
          monthlyHistory[key].cost += Number(c.total_cost_usd) || 0;
        }
      });

      // Fallback de custos (se api_costs vazio, usa usage_logs)
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

      // Usuários: conta perfis criados até cada mês
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
          churn: churnRate, // estático por enquanto — sem snapshots mensais de churn
        };
      });

      // ── Constrói histórico diário (últimos 30 dias) ──
      const dailyHistory: Record<string, { revenue: number; cost: number; users: number }> = {};
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        dailyHistory[key] = { revenue: 0, cost: 0, users: 0 };
      }

      Object.keys(dailyHistory).forEach(dayKey => {
        const dayDate = new Date(dayKey + 'T23:59:59');
        // Receita: assinaturas ativas naquele dia (exclui master/admin)
        subs.filter(isPayingSub).forEach((s: any) => {
          const createdAt = new Date(s.created_at);
          if (createdAt <= dayDate && (s.status === 'active' || (s.current_period_end && new Date(s.current_period_end) >= dayDate))) {
            dailyHistory[dayKey].revenue += (prices[s.plan] || 0) / 30; // rateio diário
          }
        });
        // Custos
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
        // Usuários
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

      // ── Distribuição de Planos ──
      const planDistribution = [
        { plan: 'Explorador', count: active.filter((s: any) => s.plan === 'explorador').length },
        { plan: 'Consultor', count: active.filter((s: any) => s.plan === 'consultor').length },
        { plan: 'Arquiteto', count: active.filter((s: any) => s.plan === 'arquiteto').length },
      ].filter(p => p.count > 0); // exibe apenas planos com usuários

      // ── Segmentação de Usuários ──
      const userSegmentation = [
        { seniority: 'Junior', count: profs.filter((p: any) => p.seniority === 'junior').length },
        { seniority: 'Pleno', count: profs.filter((p: any) => p.seniority === 'pleno').length },
        { seniority: 'Senior', count: profs.filter((p: any) => p.seniority === 'senior').length },
      ].filter(s => s.count > 0);

      // Monta lista de usuários com dados de assinatura
      const usersList = users.map((u: any) => {
        const sub = subs.find((s: any) => s.user_id === u.id);
        const userLogs = usageFull.filter((l: any) => l.user_id === u.id);
        return {
          ...u,
          plan: sub?.plan || 'explorador',
          subStatus: sub?.status || 'none',
          usageLogs: userLogs,
        };
      });

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
        usersList,
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
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#f1f5f9', marginBottom: '8px' }}>Acesso Restrito</h2>
        <p style={{ color: '#cbd5e1', marginBottom: '24px' }}>Apenas administradores podem acessar esta página.</p>
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
