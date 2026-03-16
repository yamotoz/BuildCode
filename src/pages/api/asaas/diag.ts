import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const key = import.meta.env.ASAAS_API_KEY || '';
  const base = 'https://api.asaas.com/v3';

  const result: any = {
    keyPresent: !!key,
    keyLength: key.length,
    keyPrefix: key.slice(0, 15),
    keySuffix: key.slice(-6),
  };

  try {
    const res = await fetch(`${base}/finance/balance`, {
      headers: { 'access_token': key },
    });
    result.httpStatus = res.status;
    result.responseText = await res.text();
  } catch (err: any) {
    result.fetchError = err.message;
  }

  return new Response(JSON.stringify(result, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
