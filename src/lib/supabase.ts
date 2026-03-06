import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ══════════════════════════════
//  AUTH HELPERS
// ══════════════════════════════

export async function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
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
//  PROFILE HELPERS
// ══════════════════════════════

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  seniority: 'junior' | 'pleno' | 'senior';
  theme: 'dark' | 'light';
  role: 'master' | 'admin' | 'user';
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
//  USER MANAGEMENT (Master only)
// ══════════════════════════════

export async function listAllProfiles(): Promise<Profile[]> {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: true });
  return data || [];
}

export async function setUserRole(targetUserId: string, newRole: string) {
  return supabase.rpc('set_user_role', {
    target_user_id: targetUserId,
    new_role: newRole,
  });
}

export async function deleteUserProfile(targetUserId: string) {
  return supabase
    .from('profiles')
    .delete()
    .eq('id', targetUserId);
}

export async function inviteUser(email: string, fullName: string, role: 'user' | 'admin') {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { data: null, error: { message: 'Not authenticated' } };

  const res = await fetch('/api/invite-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ email, fullName, role }),
  });

  const result = await res.json();

  if (!res.ok) {
    return { data: null, error: { message: result.error || 'Failed to invite user' } };
  }

  return { data: result, error: null };
}
