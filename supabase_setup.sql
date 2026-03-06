-- ═══════════════════════════════════════════════════════
-- BuildCode — Supabase SQL Setup (RESET COMPLETO)
-- Execute este SQL no Supabase SQL Editor (Dashboard > SQL Editor)
--
-- APÓS RODAR ESTE SQL, crie sua conta master no Dashboard:
--   Authentication > Users > Add User
--   Email: miguel@steniomello.com.br
--   Password: vaisefuder123#
--   Auto Confirm User: ON
-- ═══════════════════════════════════════════════════════

-- 0. LIMPAR TUDO (ordem importa!)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;

-- Limpar usuário master corrompido das tentativas anteriores
DO $$
BEGIN
  DELETE FROM auth.identities WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'miguel@steniomello.com.br');
  DELETE FROM auth.users WHERE email = 'miguel@steniomello.com.br';
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

DROP TABLE IF EXISTS public.profiles CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.set_user_role(UUID, TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.is_admin_or_master() CASCADE;
DROP FUNCTION IF EXISTS public.get_my_role() CASCADE;

-- 1. TABELA DE PERFIS
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT NOT NULL DEFAULT '',
  seniority TEXT NOT NULL DEFAULT 'junior' CHECK (seniority IN ('junior', 'pleno', 'senior')),
  theme TEXT NOT NULL DEFAULT 'dark' CHECK (theme IN ('dark', 'light')),
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('master', 'admin', 'user')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. HABILITAR RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. FUNÇÃO AUXILIAR: retorna o role do usuário logado (SECURITY DEFINER bypassa RLS)
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT AS $$
  SELECT COALESCE(
    (SELECT role FROM public.profiles WHERE id = auth.uid()),
    'user'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 4. POLÍTICAS RLS

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.get_my_role() IN ('master', 'admin'));

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Master can delete profiles"
  ON public.profiles FOR DELETE
  USING (public.get_my_role() = 'master');

-- 5. FUNÇÃO: Atualizar role (apenas master)
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

  UPDATE public.profiles SET role = new_role WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. TRIGGER: Criar perfil ao registrar
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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. TRIGGER: Atualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 8. STORAGE
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );

DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );

DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );

-- 9. RECARREGAR SCHEMA DO POSTGREST
NOTIFY pgrst, 'reload schema';
