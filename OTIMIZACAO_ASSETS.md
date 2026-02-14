# Guia de Otimização de Assets — 12 Temas

Este guia fornece instruções completas para otimizar as imagens de fundo e garantir performance máxima em todos os 12 temas criados.

---

## 📋 Tabela de Conteúdo

1. [Formatos recomendados](#formatos-recomendados)
2. [Compressão e dimensionamento](#compressão-e-dimensionamento)
3. [Responsive images](#responsive-images)
4. [Lazy loading](#lazy-loading)
5. [CDN e cache](#cdn-e-cache)
6. [Ferramentas](#ferramentas)
7. [Checklist final](#checklist-final)

---

## 🎨 Formatos recomendados

### WebP (Primeiro plano)
- **Economia**: 25-35% menor que JPEG/PNG
- **Suporte**: 97%+ dos navegadores modernos
- **Uso**: Imagens de fundo para todos os temas

### AVIF (Futuro)
- **Economia**: 50% menor que JPEG
- **Suporte**: 89% (crescendo)
- **Uso**: Progressive enhancement

### Fallback (JPEG)
- Para navegadores antigos
- Sempre forneça fallback JPEG otimizado

### Exemplo de implementação:

```html
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Background">
</picture>
```

---

## 🗜️ Compressão e dimensionamento

### Dimensões recomendadas

| Breakpoint | Largura | Altura | Tamanho alvo |
|------------|---------|--------|--------------|
| Mobile     | 768px   | 1024px | < 100KB      |
| Tablet     | 1024px  | 1366px | < 200KB      |
| Desktop    | 1920px  | 1080px | < 400KB      |
| Large      | 2560px  | 1440px | < 600KB      |

### Comandos de otimização

#### Usando Sharp (Node.js)

```bash
npm install sharp
```

```javascript
// scripts/optimize-images.js
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const sizes = [
  { width: 768, suffix: '-mobile', quality: 80 },
  { width: 1024, suffix: '-tablet', quality: 82 },
  { width: 1920, suffix: '-desktop', quality: 85 },
  { width: 2560, suffix: '-large', quality: 85 }
];

async function optimizeImage(inputPath, outputDir) {
  const filename = path.basename(inputPath, path.extname(inputPath));
  
  for (const size of sizes) {
    // WebP
    await sharp(inputPath)
      .resize(size.width, null, { withoutEnlargement: true })
      .webp({ quality: size.quality })
      .toFile(path.join(outputDir, `${filename}${size.suffix}.webp`));
    
    // AVIF
    await sharp(inputPath)
      .resize(size.width, null, { withoutEnlargement: true })
      .avif({ quality: size.quality - 5 })
      .toFile(path.join(outputDir, `${filename}${size.suffix}.avif`));
    
    // JPEG (fallback)
    await sharp(inputPath)
      .resize(size.width, null, { withoutEnlargement: true })
      .jpeg({ quality: size.quality, mozjpeg: true })
      .toFile(path.join(outputDir, `${filename}${size.suffix}.jpg`));
  }
  
  console.log(`✅ Otimized: ${filename}`);
}

// Processar todas as imagens em "img temas"
async function processAll() {
  const inputDir = './img temas';
  const outputDir = './public/images/optimized';
  
  await fs.mkdir(outputDir, { recursive: true });
  
  const files = await fs.readdir(inputDir);
  const images = files.filter(f => /\.(png|jpe?g)$/i.test(f));
  
  for (const image of images) {
    await optimizeImage(path.join(inputDir, image), outputDir);
  }
  
  console.log(`\n🎉 Processadas ${images.length} imagens!`);
}

processAll();
```

---

## 📱 Responsive images

### Implementação com `srcset` e `sizes`

```jsx
// ThemeLayout.jsx (atualizado)
const ThemeLayout = ({ backgroundImage, ... }) => {
  // Gerar URLs responsivas
  const imageName = backgroundImage.split('/').pop().replace(/\.[^.]+$/, '');
  
  const srcSet = `
    /images/optimized/${imageName}-mobile.webp 768w,
    /images/optimized/${imageName}-tablet.webp 1024w,
    /images/optimized/${imageName}-desktop.webp 1920w,
    /images/optimized/${imageName}-large.webp 2560w
  `;
  
  const sizes = `
    (max-width: 768px) 768px,
    (max-width: 1024px) 1024px,
    (max-width: 1920px) 1920px,
    2560px
  `;
  
  return (
    <div className="theme-container">
      <picture>
        <source 
          type="image/avif"
          srcSet={srcSet.replace(/\.webp/g, '.avif')}
          sizes={sizes}
        />
        <source 
          type="image/webp"
          srcSet={srcSet}
          sizes={sizes}
        />
        <img
          src={`/images/optimized/${imageName}-desktop.jpg`}
          alt=""
          loading="lazy"
          decoding="async"
          className="theme-bg"
        />
      </picture>
      {/* resto do componente */}
    </div>
  );
};
```

---

## ⚡ Lazy loading

### Implementação aprimorada (já incluída nos componentes)

```javascript
// LazyBackgroundImage.jsx
import { useEffect, useRef, useState } from 'react';

const LazyBackgroundImage = ({ src, placeholder = 'blur', children }) => {
  const [loaded, setLoaded] = useState(false);
  const bgRef = useRef(null);
  
  useEffect(() => {
    if (!bgRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Pré-carregar imagem
            const img = new Image();
            img.src = src;
            img.onload = () => {
              bgRef.current.style.backgroundImage = `url('${src}')`;
              setLoaded(true);
            };
            
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px', // Carregar 50px antes de entrar na viewport
        threshold: 0.01
      }
    );
    
    observer.observe(bgRef.current);
    
    return () => observer.disconnect();
  }, [src]);
  
  return (
    <div 
      ref={bgRef}
      className={`lazy-bg ${loaded ? 'loaded' : ''}`}
      style={{ 
        backgroundImage: placeholder === 'blur' 
          ? 'url(data:image/svg+xml;base64,...)' // base64 placeholder
          : 'none'
      }}
    >
      {children}
    </div>
  );
};
```

---

## 🚀 CDN e cache

### 1. Configuração de headers (Nginx)

```nginx
# nginx.conf
location ~* \.(jpg|jpeg|png|gif|webp|avif)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary "Accept";
}
```

### 2. Configuração de headers (Apache)

```apache
# .htaccess
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/avif "access plus 1 year"
</IfModule>

<IfModule mod_headers.c>
    <FilesMatch "\.(jpg|jpeg|png|webp|avif)$">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </FilesMatch>
</IfModule>
```

### 3. CDN recomendados

- **Cloudflare Images**: Otimização automática + Polish
- **Cloudinary**: Transformações on-the-fly
- **imgix**: Otimização em tempo real
- **Vercel Image Optimization**: Para Next.js

---

## 🛠️ Ferramentas

### Online (sem código)

1. **Squoosh** (https://squoosh.app/)
   - Interface visual
   - Comparação lado a lado
   - WebP, AVIF, MozJPEG

2. **TinyPNG** (https://tinypng.com/)
   - Compressão inteligente
   - Batch processing

3. **Optimizilla** (https://imagecompressor.com/)
   - Até 20 imagens simultâneas

### CLI (Command Line)

```bash
# ImageMagick (converter + otimizar)
magick convert input.png -resize 1920x -quality 85 output.webp

# cwebp (Google WebP)
cwebp -q 85 input.jpg -o output.webp

# avifenc (AVIF)
avifenc -s 7 -j 8 input.jpg output.avif

# jpegoptim (JPEG)
jpegoptim --size=400k --strip-all input.jpg
```

### Automatização (Gulp)

```javascript
// gulpfile.js
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

gulp.task('images:webp', () => {
  return gulp.src('img temas/*.{jpg,png}')
    .pipe(webp({ quality: 85 }))
    .pipe(gulp.dest('public/images/optimized'));
});

gulp.task('images:avif', () => {
  return gulp.src('img temas/*.{jpg,png}')
    .pipe(avif({ quality: 80 }))
    .pipe(gulp.dest('public/images/optimized'));
});

gulp.task('images:minify', () => {
  return gulp.src('img temas/*.{jpg,png}')
    .pipe(imagemin([
      imagemin.mozjpeg({ quality: 85 }),
      imagemin.optipng({ optimizationLevel: 5 })
    ]))
    .pipe(gulp.dest('public/images/optimized'));
});

gulp.task('optimize', gulp.parallel('images:webp', 'images:avif', 'images:minify'));
```

---

## ✅ Checklist final

### Antes do deploy

- [ ] Todas as imagens convertidas para WebP
- [ ] Variantes AVIF geradas
- [ ] Fallback JPEG otimizado (< 400KB para desktop)
- [ ] Versões mobile/tablet/desktop criadas
- [ ] Lazy loading implementado
- [ ] Cache headers configurados
- [ ] CDN configurado (opcional mas recomendado)
- [ ] Teste em conexão 3G (< 3s load time)

### Testes de performance

```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun --collect.url=https://seusite.com

# Teste manual no Chrome DevTools
# Network tab → Throttling → Fast 3G
# Performance tab → Record → Analyze
```

### Métricas alvo

| Métrica | Valor alvo | Descrição |
|---------|------------|-----------|
| LCP     | < 2.5s     | Largest Contentful Paint |
| FID     | < 100ms    | First Input Delay |
| CLS     | < 0.1      | Cumulative Layout Shift |
| TTI     | < 3.8s     | Time to Interactive |
| Speed Index | < 3.4s | Visual completeness |

---

## 📊 Comandos rápidos de otimização

### Script completo para processar as 4 imagens

```bash
# Criar diretório de saída
mkdir -p public/images/optimized

# Processar cada imagem
for img in "img temas"/*.png; do
  name=$(basename "$img" .png)
  
  # Mobile (768w)
  convert "$img" -resize 768x -quality 80 "public/images/optimized/${name}-mobile.jpg"
  cwebp -q 80 "$img" -resize 768 0 -o "public/images/optimized/${name}-mobile.webp"
  
  # Tablet (1024w)
  convert "$img" -resize 1024x -quality 82 "public/images/optimized/${name}-tablet.jpg"
  cwebp -q 82 "$img" -resize 1024 0 -o "public/images/optimized/${name}-tablet.webp"
  
  # Desktop (1920w)
  convert "$img" -resize 1920x -quality 85 "public/images/optimized/${name}-desktop.jpg"
  cwebp -q 85 "$img" -resize 1920 0 -o "public/images/optimized/${name}-desktop.webp"
  
  echo "✅ Processed: $name"
done

echo "🎉 Todas as imagens otimizadas!"
```

---

## 🔗 Recursos adicionais

- [Web.dev - Image Optimization](https://web.dev/fast/#optimize-your-images)
- [MDN - Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [AVIF vs WebP](https://jakearchibald.com/2020/avif-has-landed/)
- [Lighthouse Performance](https://developer.chrome.com/docs/lighthouse/performance/)

---

**💡 Dica final**: Monitore o tamanho dos assets com ferramentas como [bundlephobia](https://bundlephobia.com/) e mantenha o total de imagens por página < 1.5MB para garantir carregamento rápido em conexões lentas.
