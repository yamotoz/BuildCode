import type { APIRoute } from 'astro';

export const prerender = false;

/**
 * Skills.sh search proxy — searches skills.sh for a technology
 * and returns the install command (npx skills add ...).
 *
 * GET /api/skills-search?q=astro
 */
export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get('q')?.trim();

  if (!query) {
    return new Response(JSON.stringify({ error: 'Query parameter "q" is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Fetch skills.sh search page
    const res = await fetch(`https://skills.sh/search?q=${encodeURIComponent(query)}`, {
      headers: {
        'User-Agent': 'BuildCode-Agent/2.0',
        'Accept': 'text/html',
      },
    });

    if (!res.ok) {
      // Fallback: construct the skill command based on known patterns
      return new Response(JSON.stringify({
        results: [{
          name: query,
          command: `npx skills add https://github.com/skills-sh/agent-skills --skill ${query.toLowerCase().replace(/[^a-z0-9-]/g, '-')}`,
          source: 'generated',
        }],
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const html = await res.text();

    // Parse skill links from HTML
    const skillRegex = /href="(\/skills\/[^"]+)"/g;
    const nameRegex = /<h[23][^>]*>([^<]+)<\/h[23]>/g;
    const results: { name: string; url: string; command: string }[] = [];

    let match;
    const urls: string[] = [];
    while ((match = skillRegex.exec(html)) !== null) {
      urls.push(match[1]);
    }

    const names: string[] = [];
    while ((match = nameRegex.exec(html)) !== null) {
      names.push(match[1].trim());
    }

    // Build results combining urls and names
    for (let i = 0; i < Math.min(urls.length, 5); i++) {
      const skillName = names[i] || query;
      const skillPath = urls[i];
      results.push({
        name: skillName,
        url: `https://skills.sh${skillPath}`,
        command: `npx skills add https://skills.sh${skillPath}`,
      });
    }

    // If no results parsed from HTML, provide a fallback
    if (results.length === 0) {
      results.push({
        name: query,
        url: `https://skills.sh/search?q=${encodeURIComponent(query)}`,
        command: `npx skills add https://github.com/skills-sh/agent-skills --skill ${query.toLowerCase().replace(/[^a-z0-9-]/g, '-')}`,
      });
    }

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    // Fallback on network error
    return new Response(JSON.stringify({
      results: [{
        name: query,
        command: `npx skills add https://github.com/skills-sh/agent-skills --skill ${query.toLowerCase().replace(/[^a-z0-9-]/g, '-')}`,
        source: 'fallback',
      }],
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
