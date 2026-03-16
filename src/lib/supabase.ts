import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ══════════════════════════════
//  HELPERS DE AUTENTICAÇÃO
// ══════════════════════════════

export async function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/perfil`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function updatePassword(newPassword: string) {
  return supabase.auth.updateUser({ password: newPassword });
}

// ══════════════════════════════
//  HELPERS DE PERFIL
// ══════════════════════════════

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  seniority: 'junior' | 'pleno' | 'senior';
  theme: 'dark' | 'light';
  role: 'master' | 'admin' | 'user';
  agent?: string;
  llm_model?: string;
  preferred_language?: string;
  terms_accepted_at?: string | null;
  terms_version?: string | null;
  terms_ip?: string | null;
  plan?: string; // joined from subscriptions
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return data;
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  return supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
}

export async function uploadAvatar(userId: string, file: File): Promise<string | null> {
  const ext = file.name.split('.').pop();
  const filePath = `${userId}/avatar.${ext}`;

  await supabase.storage.from('avatars').remove([filePath]);

  const { error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });

  if (error) return null;

  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
  return data.publicUrl;
}

// ══════════════════════════════
//  GESTÃO DE USUÁRIOS (somente Master)
// ══════════════════════════════

export async function listAllProfiles(): Promise<Profile[]> {
  const { data } = await supabase
    .from('profiles')
    .select('*, subscriptions(plan, status)')
    .order('created_at', { ascending: true });
  // Flatten subscription plan onto profile
  return (data || []).map((p: any) => {
    const subs = Array.isArray(p.subscriptions) ? p.subscriptions : (p.subscriptions ? [p.subscriptions] : []);
    const activeSub = subs.find((s: any) => ['active', 'trialing'].includes(s.status));
    return { ...p, plan: activeSub?.plan || 'explorador' };
  });
}

export async function setUserRole(targetUserId: string, newRole: string) {
  return supabase.rpc('set_user_role', {
    target_user_id: targetUserId,
    new_role: newRole,
  });
}

export async function deleteOwnAccount() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { error: { message: 'Not authenticated' } };

  const res = await fetch('/api/delete-account', {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${session.access_token}` },
  });

  const result = await res.json();
  if (!res.ok) return { error: { message: result.error || 'Falha ao excluir conta' } };
  return { error: null };
}

export async function deleteUserProfile(targetUserId: string) {
  return supabase
    .from('profiles')
    .delete()
    .eq('id', targetUserId);
}

export async function inviteUser(email: string, fullName: string, role: 'user' | 'admin', plan?: string, canAccessDashboard?: boolean, password?: string) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { data: null, error: { message: 'Not authenticated' } };

  const res = await fetch('/api/invite-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ email, fullName, role, plan: plan || 'explorador', canAccessDashboard: canAccessDashboard || false, password }),
  });

  const result = await res.json();

  if (!res.ok) {
    return { data: null, error: { message: result.error || 'Failed to invite user' } };
  }

  return { data: result, error: null };
}

// ══════════════════════════════
//  ASSINATURA & USO
// ══════════════════════════════

export interface Subscription {
  id: string;
  user_id: string;
  plan: 'explorador' | 'consultor' | 'arquiteto' | 'vip';
  billing_cycle: 'monthly' | 'yearly';
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'pending';
  current_period_end: string;
  asaas_subscription_id?: string;
  asaas_customer_id?: string;
  last_payment_date?: string;
}

export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  const { data } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .in('status', ['active', 'trialing'])
    .single();
  return data;
}

export async function getUserUsageStats(userId: string) {
  const { data } = await supabase
    .from('usage_logs')
    .select('action, llm_model, tokens_used, cost_usd, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(500);
  return data || [];
}

// ══════════════════════════════
//  PROJETOS
// ══════════════════════════════

export interface Project {
  id: string;
  user_id: string;
  name: string;
  business_context: string;
  scale: string;
  nature: string;
  generated_prd: string;
  generated_prompt: string;
  prd_storage_path: string | null;
  prompt_storage_path: string | null;
  agent_used: string;
  llm_model: string;
  image_url: string;
  created_at: string;
}

export async function getUserProjects(userId: string): Promise<Project[]> {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);
  return (data as Project[]) || [];
}

export async function deleteProject(projectId: string) {
  return supabase.from('projects').delete().eq('id', projectId);
}
