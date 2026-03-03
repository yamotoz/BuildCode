-- ==========================================
-- BUILDCODE 
-- Supabase Schema Inicial MVP
-- ==========================================

-- 1. Tabela de Perfis de Usuário (Estendendo auth.users)
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  plan_type text default 'starter', -- starter, pro, agency
  prompts_remaining integer default 3,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- 2. Tabela de Projetos/PRDs (Salvos pelo usuário)
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  business_context text,
  scale text,
  nature text,
  generated_prd text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- SECURITY: Row Level Security (RLS)
-- ==========================================
alter table public.profiles enable row level security;
alter table public.projects enable row level security;

-- Policies for 'profiles'
create policy "Usuários podem ver o próprio perfil" 
on profiles for select 
using ( auth.uid() = id );

create policy "Usuários podem atualizar seu próprio perfil" 
on profiles for update 
using ( auth.uid() = id );

-- Policies for 'projects'
create policy "Usuários podem ver seus próprios projetos" 
on projects for select 
using ( auth.uid() = user_id );

create policy "Usuários podem inserir seus próprios projetos" 
on projects for insert 
with check ( auth.uid() = user_id );

create policy "Usuários podem deletar seus próprios projetos" 
on projects for delete 
using ( auth.uid() = user_id );

-- ==========================================
-- TRIGGERS E FUNÇÕES
-- ==========================================
-- Função para criar um perfil automaticamente ao ter um novo registro no Supabase Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

-- Trigger atrelada à função acima
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
