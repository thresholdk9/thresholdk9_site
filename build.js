// Zero-dependency static build: src/pages/*.html + src/layout.html -> dist/
// Each page starts with an HTML comment holding JSON: <!-- {"title":"…","description":"…","path":"/about/"} -->
const fs = require('fs');
const path = require('path');

const site = JSON.parse(fs.readFileSync('site.json', 'utf8'));
site.year = String(new Date().getFullYear());
site.phoneHref = site.phone.replace(/[^\d+]/g, '');
site.robots = site.indexable ? 'index,follow' : 'noindex,nofollow';

const fill = (html, vars) =>
  html.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (m, key) => {
    if (!(key in vars)) throw new Error(`Unknown placeholder {{${key}}}`);
    return vars[key];
  });

// {{#if key}}…{{/if}} blocks drop out when the value is empty
const conditionals = (html, vars) =>
  html.replace(/\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (m, key, body) => (vars[key] ? body : ''));

fs.rmSync('dist', { recursive: true, force: true });
fs.mkdirSync('dist', { recursive: true });
fs.cpSync('src/assets', 'dist/assets', { recursive: true });

const layout = fs.readFileSync('src/layout.html', 'utf8');
const urls = [];

for (const file of fs.readdirSync('src/pages').filter((f) => f.endsWith('.html'))) {
  const raw = fs.readFileSync(path.join('src/pages', file), 'utf8');
  const match = raw.match(/^<!--\s*(\{[\s\S]*?\})\s*-->/);
  if (!match) throw new Error(`${file} is missing its front-matter comment`);
  const meta = JSON.parse(match[1]);
  const vars = { ...site, ...meta, canonical: site.url + meta.path };
  vars.content = fill(conditionals(raw.slice(match[0].length), vars), vars);
  for (const p of ['/', '/services/', '/about/', '/contact/']) {
    vars['nav:' + p] = p === meta.path ? ' aria-current="page"' : '';
  }
  const html = fill(conditionals(layout, vars), vars).replace(/\{\{\s*nav:([^\s}]+)\s*\}\}/g, (m, p) => vars['nav:' + p] || '');
  const out = path.join('dist', meta.path, 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  urls.push(site.url + meta.path);
}

fs.writeFileSync('dist/robots.txt', site.indexable ? `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n');
fs.writeFileSync(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}\n</urlset>\n`
);
console.log(`Built ${urls.length} pages into dist/`);
