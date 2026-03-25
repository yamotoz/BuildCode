import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { validateTargetUrl, validateScanAccess, createScanRecord, generateMockSerenityResults } from '../../../lib/scan-utils';
import { rateLimit, getClientIp } from '../../../lib/rate-limit';

export const prerender = false;

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  // 1. Rate limit (10/hour)
  const ip = getClientIp(request);
  const blocked = await rateLimit(`serenity_scan:${ip}`, 10, 3600 * 1000);
  if (blocked) return blocked;

  // 2. Validate scan access (auth + plan + usage)
  const access = await validateScanAccess(request, 'serenity');
  if (!access.ok) {
    return json({ error: access.error }, access.status || 403);
  }

  // 3. Parse body
  let body: { url?: string; domains?: string[] };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'JSON invalido.' }, 400);
  }

  const { url, domains } = body;
  if (!url) {
    return json({ error: 'URL is required' }, 400);
  }

  // 4. Validate URL
  const urlCheck = validateTargetUrl(url);
  if (!urlCheck.valid) {
    return json({ error: urlCheck.error }, 400);
  }

  // 5. Create scan record
  const selectedDomains = domains || ['infrastructure', 'performance', 'seo', 'click_agent', 'forms', 'functionality', 'responsiveness', 'accessibility', 'content'];
  const scanId = await createScanRecord(access.userId!, 'serenity', url, { domains: selectedDomains });

  // 6. Generate mock results (future: real QA engine)
  const results = generateMockSerenityResults(scanId, url, selectedDomains);

  // 7. Log usage
  try {
    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    await adminClient.from('usage_logs').insert({
      user_id: access.userId,
      action: 'serenity_scan',
      tokens_used: 0,
      cost_usd: 0,
    });
  } catch (err: any) {
    console.error('[serenity/scan] Erro ao registrar uso:', err.message);
  }

  // 8. Return results
  return json({
    scan_id: scanId,
    remaining: (access.remaining || 0) - 1,
    ...results,
  });
};
