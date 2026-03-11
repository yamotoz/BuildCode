-- ═══════════════════════════════════════════════════════════════════════
-- BuildCode — DATABASE COMPLETO (dataall.sql)
-- Arquivo unico com TUDO necessario para o funcionamento do back-end
-- Copie e cole no SQL Editor do Supabase para configurar tudo de uma vez
-- ═══════════════════════════════════════════════════════════════════════


-- ╔═══════════════════════════════════════════════════════╗
-- ║  1. RESET COMPLETO (opcional — descomente se quiser  ║
-- ║     recriar o banco do zero)                         ║
-- ╚═══════════════════════════════════════════════════════╝

-- CUIDADO: Apaga TODOS os dados! Descomente as linhas abaixo apenas se necessario.

-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
-- DROP TABLE IF EXISTS public.projects CASCADE;
-- DROP TABLE IF EXISTS public.profiles CASCADE;
-- DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
-- DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;
-- DROP FUNCTION IF EXISTS public.set_user_role(UUID, TEXT) CASCADE;
-- DROP FUNCTION IF EXISTS public.get_my_role() CASCADE;
-- DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
-- DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
-- DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
-- DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;


-- ╔═══════════════════════════════════════════════════════╗
-- ║  2. TABELAS (Schema)                                 ║
-- ╚═══════════════════════════════════════════════════════╝

-- Tabela de perfis de usuario (estende auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT NOT NULL DEFAULT '',
  seniority TEXT NOT NULL DEFAULT 'junior' CHECK (seniority IN ('junior', 'pleno', 'senior')),
  theme TEXT NOT NULL DEFAULT 'dark' CHECK (theme IN ('dark', 'light')),
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('master', 'admin', 'user')),
  agent TEXT NOT NULL DEFAULT 'theboss',
  llm_model TEXT NOT NULL DEFAULT 'google/gemma-3-4b-it:free',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de projetos salvos pelo usuario
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  business_context TEXT,
  scale TEXT,
  nature TEXT,
  generated_prd TEXT,
  generated_prompt TEXT,
  agent_used TEXT DEFAULT 'theboss',
  llm_model TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;


-- ╔═══════════════════════════════════════════════════════╗
-- ║  3. FUNCOES                                          ║
-- ╚═══════════════════════════════════════════════════════╝

-- Retorna o role do usuario logado (SECURITY DEFINER bypassa RLS)
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT AS $$
  SELECT COALESCE(
    (SELECT role FROM public.profiles WHERE id = auth.uid()),
    'user'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Alterar role de usuario (apenas master pode executar)
CREATE OR REPLACE FUNCTION public.set_user_role(target_user_id UUID, new_role TEXT)
RETURNS VOID AS $$
BEGIN
  IF public.get_my_role() != 'master' THEN
    RAISE EXCEPTION 'Apenas o master pode alterar roles';
  END IF;

  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Nao e possivel alterar seu proprio role';
  END IF;

  IF new_role = 'master' THEN
    RAISE EXCEPTION 'Nao e possivel criar outro master';
  END IF;

  IF new_role NOT IN ('user', 'admin') THEN
    RAISE EXCEPTION 'Role invalido. Use: user ou admin';
  END IF;

  UPDATE public.profiles SET role = new_role WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar perfil automaticamente ao registrar novo usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', NEW.raw_user_meta_data ->> 'picture', ''),
    CASE
      WHEN NEW.email = 'miguel@steniomello.com.br' THEN 'master'
      ELSE 'user'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ╔═══════════════════════════════════════════════════════╗
-- ║  4. TRIGGERS                                         ║
-- ╚═══════════════════════════════════════════════════════╝

-- Criar perfil ao registrar novo usuario no Auth
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Atualizar updated_at em profiles
DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ╔═══════════════════════════════════════════════════════╗
-- ║  5. POLITICAS RLS (Row Level Security)               ║
-- ╚═══════════════════════════════════════════════════════╝

-- ══════════════════════════════
--  PROFILES
-- ══════════════════════════════

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.get_my_role() IN ('master', 'admin'));

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Master can delete profiles" ON public.profiles;
CREATE POLICY "Master can delete profiles"
  ON public.profiles FOR DELETE
  USING (public.get_my_role() = 'master');

-- ══════════════════════════════
--  PROJECTS
-- ══════════════════════════════

DROP POLICY IF EXISTS "Users can view own projects" ON public.projects;
CREATE POLICY "Users can view own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own projects" ON public.projects;
CREATE POLICY "Users can insert own projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
CREATE POLICY "Users can update own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own projects" ON public.projects;
CREATE POLICY "Users can delete own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all projects" ON public.projects;
CREATE POLICY "Admins can view all projects"
  ON public.projects FOR SELECT
  USING (public.get_my_role() IN ('master', 'admin'));


-- ╔═══════════════════════════════════════════════════════╗
-- ║  6. STORAGE (Buckets e Politicas)                    ║
-- ╚═══════════════════════════════════════════════════════╝

-- Bucket de avatares (publico para leitura)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Avatares sao publicamente acessiveis (leitura)
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Usuarios podem fazer upload do proprio avatar
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );

-- Usuarios podem atualizar o proprio avatar
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );

-- Usuarios podem deletar o proprio avatar
DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );


-- ╔═══════════════════════════════════════════════════════╗
-- ║  7. TABELAS DE ASSINATURA E USO (SaaS)              ║
-- ╚═══════════════════════════════════════════════════════╝

-- Planos: explorador (free), consultor (R$35/mes), arquiteto (R$50/mes)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  plan TEXT NOT NULL DEFAULT 'explorador' CHECK (plan IN ('explorador', 'consultor', 'arquiteto')),
  billing_cycle TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_period_end TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Log de uso de creditos (cada geracao de PRD/Prompt, cada chat, cada TTS)
CREATE TABLE IF NOT EXISTS public.usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('prd_generation', 'chat_message', 'tts_audio', 'analytics_compare')),
  llm_model TEXT,
  tokens_used INTEGER DEFAULT 0,
  cost_usd NUMERIC(10,6) DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Custos de API agregados (para dashboard admin)
CREATE TABLE IF NOT EXISTS public.api_costs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  period_date DATE NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('openai', 'openrouter', 'supabase', 'vercel')),
  model TEXT,
  total_requests INTEGER NOT NULL DEFAULT 0,
  total_tokens INTEGER NOT NULL DEFAULT 0,
  total_cost_usd NUMERIC(12,6) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(period_date, provider, model)
);

-- RLS para novas tabelas
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_costs ENABLE ROW LEVEL SECURITY;

-- Subscriptions: usuario ve a propria, admin/master ve todas
DROP POLICY IF EXISTS "Users can view own subscription" ON public.subscriptions;
CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all subscriptions" ON public.subscriptions;
CREATE POLICY "Admins can view all subscriptions"
  ON public.subscriptions FOR SELECT
  USING (public.get_my_role() IN ('master', 'admin'));

DROP POLICY IF EXISTS "Users can insert own subscription" ON public.subscriptions;
CREATE POLICY "Users can insert own subscription"
  ON public.subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own subscription" ON public.subscriptions;
CREATE POLICY "Users can update own subscription"
  ON public.subscriptions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Usage logs: usuario ve os proprios, admin/master ve todos
DROP POLICY IF EXISTS "Users can view own usage" ON public.usage_logs;
CREATE POLICY "Users can view own usage"
  ON public.usage_logs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all usage" ON public.usage_logs;
CREATE POLICY "Admins can view all usage"
  ON public.usage_logs FOR SELECT
  USING (public.get_my_role() IN ('master', 'admin'));

DROP POLICY IF EXISTS "Users can insert own usage" ON public.usage_logs;
CREATE POLICY "Users can insert own usage"
  ON public.usage_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- API costs: apenas admin/master podem ver e inserir
DROP POLICY IF EXISTS "Admins can view api costs" ON public.api_costs;
CREATE POLICY "Admins can view api costs"
  ON public.api_costs FOR SELECT
  USING (public.get_my_role() IN ('master', 'admin'));

DROP POLICY IF EXISTS "Admins can insert api costs" ON public.api_costs;
CREATE POLICY "Admins can insert api costs"
  ON public.api_costs FOR INSERT
  WITH CHECK (public.get_my_role() IN ('master', 'admin'));

-- Triggers de updated_at
DROP TRIGGER IF EXISTS on_subscription_updated ON public.subscriptions;
CREATE TRIGGER on_subscription_updated
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Indexes para performance
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON public.usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON public.usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_usage_logs_action ON public.usage_logs(action);
CREATE INDEX IF NOT EXISTS idx_api_costs_period ON public.api_costs(period_date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan ON public.subscriptions(plan);

-- Adicionar coluna de idioma preferido ao perfil
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_language TEXT NOT NULL DEFAULT 'pt';


-- ╔═══════════════════════════════════════════════════════╗
-- ║  8. MIGRACOES (para bancos ja existentes)            ║
-- ╚═══════════════════════════════════════════════════════╝

-- Se o banco ja existe, rode estas linhas para adicionar colunas novas:
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS agent TEXT NOT NULL DEFAULT 'theboss';
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS llm_model TEXT NOT NULL DEFAULT 'google/gemma-3-4b-it:free';
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_language TEXT NOT NULL DEFAULT 'pt';


-- ╔═══════════════════════════════════════════════════════╗
-- ║  9. RECARREGAR SCHEMA                                ║
-- ╚═══════════════════════════════════════════════════════╝

NOTIFY pgrst, 'reload schema';
