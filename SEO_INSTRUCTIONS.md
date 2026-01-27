# Instruções básicas para SEO e indexação

Este arquivo descreve os passos recomendados para preparar e indexar o site Vintage DevStack.

1) Ajuste dos placeholders

- Os placeholders em `index.html` foram atualizados para `https://www.vintagedevstack.com.br`.
- Atualize `og:image` e `logo` caso precise apontar para imagens diferentes das colocadas em `https://www.vintagedevstack.com.br/og-image.png` e `https://www.vintagedevstack.com.br/logo.png`.

2) Gerar sitemap automaticamente

- Local: `scripts/generate-sitemap.js` — gera `public/sitemap.xml` a partir da variável de ambiente `SITE_URL`.
- Exemplo no Windows PowerShell:

```powershell
$env:SITE_URL = "https://www.vintagedevstack.com.br"; npm run generate-sitemap
```

- Ou usar no bash:

```bash
SITE_URL=https://www.vintagedevstack.com.br npm run generate-sitemap
```

3) robots.txt

- `public/robots.txt` já aponta para `https://www.vintagedevstack.com.br/sitemap.xml`.

4) Submeter o site para indexação

- Google Search Console:
  - Verifique/adicione sua propriedade (domínio ou prefixo de URL).
  - No menu "Sitemaps", envie `/sitemap.xml` (ex: `https://www.vintagedevstack.com.br/sitemap.xml`).
  - Use a ferramenta "Inspeção de URL" para solicitar indexação de páginas específicas.

- Bing Webmaster Tools: passos similares — adicione site, envie sitemap e solicite reindexação.

5) Testes e validações

- Use o Google Rich Results Test para validar o JSON-LD presente no `index.html`.
- Use Mobile-Friendly Test do Google para checar responsividade.
- Verifique o `robots.txt` público em `https://www.vintagedevstack.com.br/robots.txt`.

6) Boas práticas on-page adicionais

- Tenha título único e descrição clara em cada página (no SPA, considere usar SSR ou prerender para páginas importantes).
- Garanta marcação semântica (h1, h2...).
- Tempo de carregamento: otimize imagens, use cache e compressão; o Vite já ajuda no bundle.
- Adicione tags Open Graph e Twitter (já incluídas no `index.html`).

7) Automação no deploy

- Se possível, configure o deploy para exportar `public/` como raiz do site e execute `npm run generate-sitemap` antes ou depois do build (o projeto já tem `postbuild` configurado para gerar sitemap se `SITE_URL` estiver definido).

8) Observações finais

- Para sites de uma página (SPA) o Google costuma indexar a homepage; se você precisa de páginas indexáveis separadas, considere:
  - Adotar SSR (Server Side Rendering) ou prerendering de rotas estáticas.
  - Criar páginas estáticas (ex: `about.html`) no `public/` para conteúdo importante.

Se quiser, posso:
- Ajustar imagens OG e logo usando URLs que você fornecer.
- Configurar prerender para as seções principais.
# Instruções básicas para SEO e indexação

Este arquivo descreve os passos recomendados para preparar e indexar o site Vintage DevStack.

1) Ajuste dos placeholders

- Em `index.html` substitua todas as ocorrências de `SITE_URL` pelo domínio final do site (ex: `https://meusite.com`).
- Atualize `og:image`, `logo` e `twitter:creator` com caminhos/handles reais.

2) Gerar sitemap automaticamente

- Local: `scripts/generate-sitemap.js` — gera `public/sitemap.xml` a partir da variável de ambiente `SITE_URL`.
- Exemplo no Windows PowerShell:

```
$env:SITE_URL = "https://meusite.com"; npm run generate-sitemap
```

- Ou usar no bash:

```
SITE_URL=https://meusite.com npm run generate-sitemap
```

3) robots.txt

- `public/robots.txt` já contém um template que referencia `https://SITE_URL/sitemap.xml`. Substitua `SITE_URL` ou garanta que o sitemap gerado esteja disponível em `/sitemap.xml` no domínio.

4) Submeter o site para indexação

- Google Search Console:
  - Verifique/adicione sua propriedade (domínio ou prefixo de URL).
  - No menu "Sitemaps", envie `/sitemap.xml` (ex: `https://meusite.com/sitemap.xml`).
  - Use a ferramenta "Inspeção de URL" para solicitar indexação de páginas específicas.

- Bing Webmaster Tools: passos similares — adicione site, envie sitemap e solicite reindexação.

5) Testes e validações

- Use o Google Rich Results Test para validar o JSON-LD presente no `index.html`.
- Use Mobile-Friendly Test do Google para checar responsividade.
- Verifique o `robots.txt` público em `https://meusite.com/robots.txt`.

6) Boas práticas on-page adicionais

- Tenha título único e descrição clara em cada página (no SPA, considere usar SSR ou prerender para páginas importantes).
- Garanta marcação semântica (h1, h2...).
- Tempo de carregamento: otimize imagens, use cache e compressão; o Vite já ajuda no bundle.
- Adicione tags Open Graph e Twitter (já incluídas no `index.html`).

7) Automação no deploy

- Se possível, configure o deploy para exportar `public/` como raiz do site e execute `npm run generate-sitemap` antes ou depois do build (o projeto já tem `postbuild` configurado para gerar sitemap se `SITE_URL` estiver definido).

8) Observações finais

- Para sites de uma página (SPA) o Google costuma indexar a homepage; se você precisa de páginas indexáveis separadas, considere:
  - Adotar SSR (Server Side Rendering) ou prerendering de rotas estáticas.
  - Criar páginas estáticas (ex: `about.html`) no `public/` para conteúdo importante.

Se quiser, posso:
- Substituir os placeholders `SITE_URL`, `og-image` e `twitter:creator` se você me informar o domínio e os caminhos.
- Configurar prerender para as seções principais.
