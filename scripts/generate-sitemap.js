// Gera public/sitemap.xml baseado em SITE_URL e rotas/âncoras configuradas.
// Uso: SITE_URL=https://meusite.com node scripts/generate-sitemap.js
// No Windows PowerShell, use: $env:SITE_URL = "https://meusite.com"; node scripts/generate-sitemap.js

const fs = require('fs');
const path = require('path');

// Use SITE_URL env, first CLI arg, or fallback to the production domain used in the project.
// This makes the script safe to run during CI/deploys even if SITE_URL was not provided.
const siteUrl = process.env.SITE_URL || process.argv[2] || 'https://www.vintagedevstack.com.br';
if (!process.env.SITE_URL && !process.argv[2]) {
  console.warn('AVISO: SITE_URL não definido. Usando valor padrão:', siteUrl);
}

const routes = [
  '/',
  '/#about',
  '/#services',
  '/#portfolio',
  '/#contact'
];

const now = new Date().toISOString();

const urlset = routes.map(route => {
  const loc = (route === '/') ? `${siteUrl}/` : `${siteUrl}${route}`;
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.5</priority>\n  </url>`;
}).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>\n`;

const outPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(outPath, xml, 'utf8');
console.log('Sitemap gerado em', outPath);
