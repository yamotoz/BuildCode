import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnon = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

// ══════════════════════════════════════════
// PLAN-BASED SCAN LIMITS (per month)
// ══════════════════════════════════════════

export const SCAN_LIMITS: Record<string, number> = {
  explorador: 1,
  consultor: 5,
  arquiteto: 15,
  vip: 999999,
};

// ══════════════════════════════════════════
// INTERFACES
// ══════════════════════════════════════════

export interface ScanFinding {
  id: string;
  module: string;       // for cyberdyne: xss, sqli, etc. For serenity: domain name
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
  affected_url?: string;
  element?: string;
  cvss?: number;        // cyberdyne only
  fix_suggestion?: string; // serenity only
  evidence?: string;
}

export interface ScanResult {
  scan_id: string;
  status: 'completed' | 'failed';
  score?: number;        // serenity only (0-100)
  verdict?: string;      // serenity only: REPROVADO/APROVADO/EXCELENTE
  summary: Record<string, number>; // severity counts
  domain_scores?: Record<string, { score: number; findings: ScanFinding[] }>; // serenity only
  findings: ScanFinding[];
  scanned_at: string;
}

// ══════════════════════════════════════════
// URL VALIDATION
// ══════════════════════════════════════════

export function validateTargetUrl(url: string): { valid: boolean; error?: string } {
  if (!url || typeof url !== 'string') {
    return { valid: false, error: 'URL é obrigatória.' };
  }

  const trimmed = url.trim();

  if (!trimmed.startsWith('https://')) {
    return { valid: false, error: 'URL deve começar com https://' };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { valid: false, error: 'URL inválida.' };
  }

  // Block localhost
  if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1' || parsed.hostname === '::1') {
    return { valid: false, error: 'Não é permitido escanear localhost.' };
  }

  // Block internal/private IPs
  const ipMatch = parsed.hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipMatch) {
    const [, a, b] = ipMatch.map(Number);
    if (
      a === 10 ||                          // 10.0.0.0/8
      (a === 172 && b >= 16 && b <= 31) || // 172.16.0.0/12
      (a === 192 && b === 168) ||          // 192.168.0.0/16
      a === 0 ||                           // 0.0.0.0/8
      a === 169 && b === 254               // 169.254.0.0/16 link-local
    ) {
      return { valid: false, error: 'Não é permitido escanear IPs internos/privados.' };
    }
  }

  // Must have a valid domain (at least one dot)
  if (!parsed.hostname.includes('.')) {
    return { valid: false, error: 'Domínio inválido.' };
  }

  return { valid: true };
}

// ══════════════════════════════════════════
// AUTH + PLAN + USAGE VALIDATION
// ══════════════════════════════════════════

export async function validateScanAccess(request: Request, scanType: 'cyberdyne' | 'serenity'): Promise<{
  ok: boolean;
  error?: string;
  status?: number;
  userId?: string;
  plan?: string;
  remaining?: number;
}> {
  // Extract Bearer token
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { ok: false, error: 'Não autenticado.', status: 401 };
  }

  const token = authHeader.replace('Bearer ', '');

  // Validate user via anon client
  const anonClient = createClient(supabaseUrl, supabaseAnon);
  const { data: { user } } = await anonClient.auth.getUser(token);
  if (!user) {
    return { ok: false, error: 'Token inválido.', status: 401 };
  }

  // Get subscription (active or trialing only)
  const adminClient = createClient(supabaseUrl, serviceRoleKey);
  const { data: sub } = await adminClient
    .from('subscriptions')
    .select('plan')
    .eq('user_id', user.id)
    .in('status', ['active', 'trialing'])
    .single();

  const userPlan = sub?.plan || 'explorador';
  const limit = SCAN_LIMITS[userPlan] ?? SCAN_LIMITS.explorador;

  // Count usage this month
  const usageCount = await getScanUsageCount(user.id, scanType);
  const remaining = Math.max(0, limit - usageCount);

  if (usageCount >= limit) {
    return {
      ok: false,
      error: `Limite de scans atingido (${usageCount}/${limit} este mês). Faça upgrade para mais scans.`,
      status: 429,
      userId: user.id,
      plan: userPlan,
      remaining: 0,
    };
  }

  return {
    ok: true,
    userId: user.id,
    plan: userPlan,
    remaining,
  };
}

// ══════════════════════════════════════════
// SCAN USAGE COUNT
// ══════════════════════════════════════════

export async function getScanUsageCount(userId: string, scanType: string): Promise<number> {
  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const { count } = await adminClient
    .from('usage_logs')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('action', `${scanType}_scan`)
    .gte('created_at', monthStart.toISOString());

  return count || 0;
}

// ══════════════════════════════════════════
// CREATE SCAN RECORD
// ══════════════════════════════════════════

export async function createScanRecord(
  userId: string,
  scanType: 'cyberdyne' | 'serenity',
  url: string,
  config: object,
): Promise<string> {
  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  const scanId = crypto.randomUUID();

  await adminClient.from('scan_requests').insert({
    id: scanId,
    user_id: userId,
    scan_type: scanType,
    target_url: url,
    config,
    status: 'running',
  });

  return scanId;
}

// ══════════════════════════════════════════
// MOCK CYBERDYNE RESULTS
// ══════════════════════════════════════════

export function generateMockCyberdyneResults(scanId: string, targetUrl: string): ScanResult {
  const findings: ScanFinding[] = [
    {
      id: crypto.randomUUID(),
      module: 'xss',
      severity: 'high',
      title: 'Reflected XSS no parâmetro de busca',
      description: 'Input do usuário no parâmetro "q" é refletido na resposta sem sanitização adequada, permitindo injeção de scripts maliciosos.',
      affected_url: `${targetUrl}/search?q=<script>alert(1)</script>`,
      element: '<input name="q" value="<script>alert(1)</script>">',
      cvss: 7.1,
      evidence: 'Payload <script>alert(1)</script> foi refletido sem encoding no HTML da resposta.',
    },
    {
      id: crypto.randomUUID(),
      module: 'sqli',
      severity: 'critical',
      title: 'SQL Injection no endpoint de login',
      description: 'O parâmetro "email" no endpoint de autenticação é vulnerável a SQL Injection baseado em erro. Dados do banco podem ser exfiltrados.',
      affected_url: `${targetUrl}/api/auth/login`,
      element: 'POST body: email=admin\'OR 1=1--',
      cvss: 9.8,
      evidence: 'Resposta contém mensagem de erro SQL: "syntax error at or near..."',
    },
    {
      id: crypto.randomUUID(),
      module: 'jwt',
      severity: 'critical',
      title: 'JWT aceita algoritmo "none"',
      description: 'O servidor aceita tokens JWT com algorithm "none", permitindo forjar tokens sem assinatura e escalar privilégios.',
      affected_url: `${targetUrl}/api/me`,
      element: 'Authorization: Bearer eyJ0eXAi...(alg:none)',
      cvss: 9.1,
      evidence: 'Token com header {"alg":"none","typ":"JWT"} retornou 200 OK com dados do admin.',
    },
    {
      id: crypto.randomUUID(),
      module: 'headers',
      severity: 'medium',
      title: 'Headers de segurança ausentes',
      description: 'A aplicação não define headers de segurança importantes: X-Content-Type-Options, X-Frame-Options, Content-Security-Policy, Strict-Transport-Security.',
      affected_url: targetUrl,
      element: 'Response Headers',
      cvss: 5.3,
      evidence: 'Headers ausentes: X-Content-Type-Options, X-Frame-Options, CSP, HSTS.',
    },
    {
      id: crypto.randomUUID(),
      module: 'idor',
      severity: 'high',
      title: 'IDOR no endpoint de perfil',
      description: 'É possível acessar dados de outros usuários alterando o parâmetro user_id na requisição. Sem validação de ownership no backend.',
      affected_url: `${targetUrl}/api/users/12345/profile`,
      element: 'GET /api/users/{id}/profile',
      cvss: 7.5,
      evidence: 'Requisição com user_id diferente do autenticado retornou dados completos do perfil alvo.',
    },
    {
      id: crypto.randomUUID(),
      module: 'redirect',
      severity: 'medium',
      title: 'Open Redirect no parâmetro return_url',
      description: 'O parâmetro "return_url" aceita URLs externas sem validação, permitindo redirecionar usuários para sites maliciosos após autenticação.',
      affected_url: `${targetUrl}/login?return_url=https://evil.com`,
      element: 'GET /login?return_url=https://evil.com',
      cvss: 4.7,
      evidence: 'Resposta 302 com Location: https://evil.com após login bem-sucedido.',
    },
    {
      id: crypto.randomUUID(),
      module: 'ssrf',
      severity: 'high',
      title: 'SSRF via funcionalidade de preview de URL',
      description: 'O endpoint de preview de links permite requisições a IPs internos e serviços cloud metadata, podendo expor credenciais da infraestrutura.',
      affected_url: `${targetUrl}/api/preview?url=http://169.254.169.254/latest/meta-data/`,
      element: 'GET /api/preview?url=http://169.254.169.254/...',
      cvss: 8.6,
      evidence: 'Requisição ao metadata endpoint retornou dados da instância EC2.',
    },
    {
      id: crypto.randomUUID(),
      module: 'info',
      severity: 'info',
      title: 'Divulgação de informações em headers de resposta',
      description: 'Headers de resposta expõem versões de tecnologias do servidor: X-Powered-By, Server. Informação útil para reconhecimento por atacantes.',
      affected_url: targetUrl,
      element: 'Server: nginx/1.24.0, X-Powered-By: Express',
      cvss: 0.0,
      evidence: 'Headers: Server: nginx/1.24.0, X-Powered-By: Express 4.18.2',
    },
  ];

  const summary: Record<string, number> = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
  for (const f of findings) {
    summary[f.severity]++;
  }

  return {
    scan_id: scanId,
    status: 'completed',
    summary,
    findings,
    scanned_at: new Date().toISOString(),
  };
}

// ══════════════════════════════════════════
// MOCK SERENITY RESULTS
// ══════════════════════════════════════════

const SERENITY_DOMAINS = [
  'Segurança de Headers',
  'Criptografia TLS/SSL',
  'Proteção contra Injection',
  'Autenticação e Sessão',
  'Controle de Acesso',
  'Proteção de Dados',
  'Configuração do Servidor',
  'Proteção contra XSS',
  'Compliance e Boas Práticas',
];

export function generateMockSerenityResults(scanId: string, targetUrl: string, domains: string[]): ScanResult {
  const activeDomains = domains.length > 0 ? domains : SERENITY_DOMAINS;

  const allFindings: ScanFinding[] = [];
  const domainScores: Record<string, { score: number; findings: ScanFinding[] }> = {};

  let totalScore = 0;

  for (const domain of activeDomains) {
    const domainFindings: ScanFinding[] = [];
    const numFindings = 1 + Math.floor(Math.random() * 3); // 1-3 findings per domain

    for (let i = 0; i < numFindings; i++) {
      const finding = generateSerenityFinding(domain, targetUrl);
      domainFindings.push(finding);
      allFindings.push(finding);
    }

    // Domain score: 60-98 range
    const domainScore = 60 + Math.floor(Math.random() * 39);
    domainScores[domain] = { score: domainScore, findings: domainFindings };
    totalScore += domainScore;
  }

  const score = Math.round(totalScore / activeDomains.length);

  let verdict: string;
  if (score < 60) verdict = 'REPROVADO';
  else if (score < 85) verdict = 'APROVADO';
  else verdict = 'EXCELENTE';

  const summary: Record<string, number> = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
  for (const f of allFindings) {
    summary[f.severity]++;
  }

  return {
    scan_id: scanId,
    status: 'completed',
    score,
    verdict,
    summary,
    domain_scores: domainScores,
    findings: allFindings,
    scanned_at: new Date().toISOString(),
  };
}

// ── Helper: generate a single Serenity finding per domain ──

function generateSerenityFinding(domain: string, targetUrl: string): ScanFinding {
  const findingsByDomain: Record<string, Array<Omit<ScanFinding, 'id' | 'module'>>> = {
    'Segurança de Headers': [
      { severity: 'medium', title: 'Content-Security-Policy ausente', description: 'A aplicação não define uma política CSP, permitindo execução de scripts inline e carregamento de recursos de origens não confiáveis.', affected_url: targetUrl, fix_suggestion: 'Adicione o header Content-Security-Policy com uma política restritiva: default-src \'self\'; script-src \'self\'.' },
      { severity: 'low', title: 'X-Frame-Options não definido', description: 'Sem proteção contra clickjacking. A página pode ser incorporada em iframes de sites maliciosos.', affected_url: targetUrl, fix_suggestion: 'Adicione X-Frame-Options: DENY ou SAMEORIGIN nos headers de resposta.' },
      { severity: 'medium', title: 'Strict-Transport-Security ausente', description: 'Sem HSTS, navegadores podem acessar via HTTP antes do redirect, permitindo ataques de downgrade.', affected_url: targetUrl, fix_suggestion: 'Adicione Strict-Transport-Security: max-age=31536000; includeSubDomains nos headers.' },
    ],
    'Criptografia TLS/SSL': [
      { severity: 'high', title: 'TLS 1.0/1.1 ainda habilitado', description: 'O servidor aceita conexões com TLS 1.0 e 1.1, versões obsoletas com vulnerabilidades conhecidas (BEAST, POODLE).', affected_url: targetUrl, fix_suggestion: 'Desabilite TLS 1.0 e 1.1. Aceite apenas TLS 1.2+ com cipher suites modernas.' },
      { severity: 'medium', title: 'Cipher suites fracas detectadas', description: 'O servidor aceita cipher suites com algoritmos fracos (RC4, DES, 3DES).', affected_url: targetUrl, fix_suggestion: 'Configure o servidor para usar apenas cipher suites com AES-GCM ou ChaCha20.' },
    ],
    'Proteção contra Injection': [
      { severity: 'high', title: 'Parâmetros sem sanitização adequada', description: 'Inputs de formulário não são sanitizados antes de serem processados, permitindo potencial injeção de comandos.', affected_url: `${targetUrl}/contact`, fix_suggestion: 'Use prepared statements/parameterized queries e sanitize todos os inputs no backend.' },
      { severity: 'medium', title: 'Sem proteção contra NoSQL Injection', description: 'Endpoints da API aceitam operadores MongoDB ($gt, $ne) em campos de input.', affected_url: `${targetUrl}/api/search`, fix_suggestion: 'Valide e sanitize inputs contra operadores NoSQL. Use schemas de validação (Zod, Joi).' },
    ],
    'Autenticação e Sessão': [
      { severity: 'high', title: 'Cookies de sessão sem flags de segurança', description: 'Cookies de sessão não possuem as flags Secure, HttpOnly e SameSite, vulneráveis a intercepção e XSS.', affected_url: targetUrl, fix_suggestion: 'Configure cookies com: Secure; HttpOnly; SameSite=Strict; Path=/.' },
      { severity: 'medium', title: 'Sem proteção contra brute force', description: 'O endpoint de login não possui rate limiting ou lockout após tentativas falhas.', affected_url: `${targetUrl}/login`, fix_suggestion: 'Implemente rate limiting (ex: 5 tentativas/min) e lockout temporário após 10 falhas.' },
    ],
    'Controle de Acesso': [
      { severity: 'high', title: 'Endpoints da API sem autenticação', description: 'Alguns endpoints da API retornam dados sem exigir token de autenticação.', affected_url: `${targetUrl}/api/users`, fix_suggestion: 'Adicione middleware de autenticação em todas as rotas protegidas da API.' },
      { severity: 'medium', title: 'CORS permissivo demais', description: 'O header Access-Control-Allow-Origin está configurado como wildcard (*), permitindo requisições de qualquer origem.', affected_url: targetUrl, fix_suggestion: 'Restrinja CORS para domínios específicos da aplicação.' },
    ],
    'Proteção de Dados': [
      { severity: 'medium', title: 'Dados sensíveis em logs do cliente', description: 'Console.log expõe tokens e dados de usuário no navegador em ambiente de produção.', affected_url: targetUrl, fix_suggestion: 'Remova todos os console.log com dados sensíveis. Use um logger com níveis (debug só em dev).' },
      { severity: 'low', title: 'Sem política de retenção de dados', description: 'Não há mecanismo automático de limpeza de dados pessoais ou logs antigos.', affected_url: targetUrl, fix_suggestion: 'Implemente políticas de retenção com TTL no banco e cron jobs de limpeza.' },
    ],
    'Configuração do Servidor': [
      { severity: 'medium', title: 'Directory listing habilitado', description: 'O servidor expõe listagem de diretórios, revelando estrutura de arquivos da aplicação.', affected_url: `${targetUrl}/assets/`, fix_suggestion: 'Desabilite directory listing no nginx/apache. Adicione "autoindex off" no nginx.' },
      { severity: 'info', title: 'Versão do servidor exposta', description: 'Headers de resposta revelam a versão exata do servidor web e runtime.', affected_url: targetUrl, fix_suggestion: 'Remova ou ofusque headers Server e X-Powered-By.' },
    ],
    'Proteção contra XSS': [
      { severity: 'high', title: 'Stored XSS em campo de comentários', description: 'Conteúdo HTML é armazenado e renderizado sem sanitização, permitindo XSS persistente.', affected_url: `${targetUrl}/comments`, fix_suggestion: 'Sanitize HTML com DOMPurify antes de renderizar. Use CSP para bloquear inline scripts.' },
      { severity: 'medium', title: 'DOM XSS via manipulação de hash', description: 'JavaScript da aplicação usa location.hash sem sanitização para atualizar o DOM.', affected_url: `${targetUrl}/#<img onerror=alert(1)>`, fix_suggestion: 'Nunca use innerHTML com dados de URL. Use textContent ou sanitize com DOMPurify.' },
    ],
    'Compliance e Boas Práticas': [
      { severity: 'low', title: 'Sem cabeçalho Permissions-Policy', description: 'Sem controle explícito sobre APIs do navegador (câmera, microfone, geolocalização).', affected_url: targetUrl, fix_suggestion: 'Adicione Permissions-Policy: camera=(), microphone=(), geolocation=() nos headers.' },
      { severity: 'info', title: 'Robots.txt expõe caminhos internos', description: 'O arquivo robots.txt lista diretórios sensíveis como /admin, /api/internal.', affected_url: `${targetUrl}/robots.txt`, fix_suggestion: 'Remova caminhos sensíveis do robots.txt. Use autenticação para proteger áreas restritas.' },
    ],
  };

  const domainFindings = findingsByDomain[domain];

  if (!domainFindings || domainFindings.length === 0) {
    // Fallback for unknown domains
    return {
      id: crypto.randomUUID(),
      module: domain,
      severity: 'info',
      title: `Verificação do domínio ${domain}`,
      description: `Análise básica do domínio "${domain}" concluída sem achados críticos.`,
      affected_url: targetUrl,
      fix_suggestion: 'Nenhuma ação necessária.',
    };
  }

  const picked = domainFindings[Math.floor(Math.random() * domainFindings.length)];

  return {
    id: crypto.randomUUID(),
    module: domain,
    ...picked,
  };
}
