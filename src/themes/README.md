# Componentes de Temas React

Esta pasta contém **8 componentes de tema responsivos** prontos para uso em aplicações React/Vite, cada um com identidade visual única e garantia de contraste WCAG AA/AAA.

---

## 📁 Estrutura

```
src/themes/
├── ThemeLayout.jsx          # Componente base (lazy loading, estrutura)
├── AmanhecerGradient.jsx    # Tema 1.1


├── MinimalDark.jsx          # Tema 2.1
├── MinimalBright.jsx        # Tema 2.2
├── ElectricAsymmetric.jsx   # Tema 2.3
├── TexturaVintage.jsx       # Tema 3.1
├── ArtisanClean.jsx         # Tema 3.2
├── WarmFade.jsx             # Tema 3.3
├── AuroraGlass.jsx          # Tema 4.1

├── themes.css               # Estilos compartilhados
├── index.js                 # Exports centralizados
└── README.md                # Este arquivo
```

---

## 🚀 Uso básico

### 1. Importar tema individual

```jsx
import { AmanhecerGradient } from './themes';

function App() {
  return <AmanhecerGradient />;
}
```

### 2. Trocar temas dinamicamente

```jsx
import { useState } from 'react';
import { 
  AmanhecerGradient, 
  MinimalDark, 
  AuroraGlass,
  themesMetadata 
} from './themes';

const themes = {
  'amanhecer-gradient': AmanhecerGradient,
  'minimal-dark': MinimalDark,
  'aurora-glass': AuroraGlass,
  // ... adicione todos os 12
};

function App() {
  const [currentTheme, setCurrentTheme] = useState('amanhecer-gradient');
  const ThemeComponent = themes[currentTheme];

  return (
    <>
      <nav style={{ position: 'fixed', top: 20, right: 20, zIndex: 1000 }}>
        <select 
          value={currentTheme} 
          onChange={(e) => setCurrentTheme(e.target.value)}
        >
          {themesMetadata.map(theme => (
            <option key={theme.id} value={theme.id}>
              {theme.name}
            </option>
          ))}
        </select>
      </nav>
      
      <ThemeComponent />
    </>
  );
}
```

### 3. Criar tema customizado usando ThemeLayout

```jsx
import ThemeLayout from './themes/ThemeLayout';
import './themes/themes.css';

function MeuTemaCustom() {
  const overlayStyle = {
    background: 'linear-gradient(135deg, rgba(255,0,100,0.6), rgba(0,100,255,0.4))'
  };

  return (
    <ThemeLayout
      backgroundImage="/caminho/para/imagem.jpg"
      overlayStyle={overlayStyle}
      className="meu-tema"
    >
      <header>
        <h1>Meu Tema Personalizado</h1>
        <p>Overlay e layout customizados</p>
      </header>
      
      <section>
        {/* Seu conteúdo aqui */}
      </section>
    </ThemeLayout>
  );
}
```

---

## 🎨 Temas disponíveis

| Tema | ID | Contraste | Overlay | Melhor uso |
|------|-----|-----------|---------|------------|
| Amanhecer Gradiente | `amanhecer-gradient` | WCAG AA | Gradiente quente | Landing pages vibrantes |

| Minimal Dark | `minimal-dark` | WCAG AA+ | Escuro radial | Portfolios minimalistas |
| Minimal Bright | `minimal-bright` | 12.6:1 AAA | Claro | SaaS/dashboards |
| Electric Asymmetric | `electric-asymmetric` | 14:1 AAA | Acento elétrico | Tech startups, gaming |
| Textura Vintage | `textura-vintage` | WCAG AA | Grain/vignette | Marcas retrô |
| Artisan Clean | `artisan-clean` | 9.2:1 AAA | Claro grain | E-commerce artesanal |
| Warm Fade | `warm-fade` | 11.8:1 AAA | Fade lateral | Blogs premium |
| Aurora Glass | `aurora-glass` | WCAG AA+ | Glassmorphism | Interfaces modernas |


---

## 📦 Props do ThemeLayout

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `backgroundImage` | string | **required** | Caminho para imagem de fundo |
| `overlayStyle` | object | `{}` | Estilos CSS para overlay (background, gradients) |
| `children` | node | **required** | Conteúdo do tema |
| `className` | string | `''` | Classes CSS adicionais |
| `useFixedBg` | boolean | `true` | Background-attachment: fixed (parallax) |
| `extraElements` | node | `null` | Elementos extras (glows, gradientes animados) |

---

## 🛠️ Personalização

### Cores (CSS Variables)

Cada tema usa variáveis CSS customizáveis. Exemplo para `AmanhecerGradient`:

```css
.amanhecer-gradient {
  --primary: #FF7A59;
  --accent: #FFD08A;
  --text: #ffffff;
  --muted: rgba(255,255,255,0.82);
  --overlay-opacity: 0.55;
}

/* Sobrescrever */
.amanhecer-gradient.custom {
  --primary: #00ff88;
  --accent: #ff0088;
}
```

### Tipografia

```css
/* themes.css ou seu arquivo de estilos global */
.theme-container {
  font-family: 'Sua Fonte', system-ui, sans-serif;
}

h1 {
  font-family: 'Fonte de Titulo', serif;
}
```

### Animações

Desabilitar globalmente (já respeita `prefers-reduced-motion`):

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

---

## ⚡ Performance

### Lazy loading automático

Todos os temas usam `IntersectionObserver` para carregar backgrounds apenas quando visíveis:

```javascript
// Já implementado em ThemeLayout.jsx
useEffect(() => {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        el.style.backgroundImage = `url('${backgroundImage}')`;
        observer.unobserve(el);
      }
    });
  }, { rootMargin: '200px' });
  
  io.observe(bgRef.current);
}, [backgroundImage]);
```

### Code splitting

```jsx
// Carregar temas sob demanda (React.lazy)
import { lazy, Suspense } from 'react';

const AmanhecerGradient = lazy(() => import('./themes/AmanhecerGradient'));
const MinimalDark = lazy(() => import('./themes/MinimalDark'));

function App() {
  return (
    <Suspense fallback={<div>Carregando tema...</div>}>
      <AmanhecerGradient />
    </Suspense>
  );
}
```

---

## 📱 Responsividade

Todos os temas são **100% responsivos** com breakpoints:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px
- **Large**: > 1440px

### Testando responsividade

```bash
# Chrome DevTools
# Device Toolbar → iPhone SE (375px)
# Device Toolbar → iPad (768px)
# Device Toolbar → Desktop (1920px)
```

---

## ♿ Acessibilidade

### Contraste WCAG

Todos os temas atendem **mínimo WCAG AA (4.5:1)** para texto principal, com muitos atingindo **AAA (7:1+)**.

### Áreas de toque

Todos os botões e links têm **mínimo 44×44px** (recomendação WCAG 2.5.5).

### Navegação por teclado

```css
/* Focus visible para navegação por Tab */
:focus-visible {
  outline: 3px solid currentColor;
  outline-offset: 3px;
}
```

### Screen readers

```jsx
// Elementos decorativos marcados como aria-hidden
<div className="overlay" aria-hidden="true" />

// Landmarks semânticos
<header role="banner">
<main role="main">
<nav aria-label="Principal">
```

---

## 🧪 Testes

### Teste de contraste

```bash
# Online: https://webaim.org/resources/contrastchecker/
# Chrome DevTools: Lighthouse > Accessibility
```

### Teste de performance

```bash
npm install -g @lhci/cli
lhci autorun --collect.url=http://localhost:5173
```

---

## 📚 Exemplos de integração

### Com React Router

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AmanhecerGradient, MinimalDark } from './themes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AmanhecerGradient />} />
        <Route path="/minimal" element={<MinimalDark />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Com Context API (tema global)

```jsx
import { createContext, useState, useContext } from 'react';
import * as Themes from './themes';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState('amanhecer-gradient');
  
  return (
    <ThemeContext.Provider value={{ currentTheme, setCurrentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

// Uso no componente
function App() {
  const { currentTheme, setCurrentTheme } = useTheme();
  const ThemeComponent = Themes[currentTheme];
  
  return <ThemeComponent />;
}
```

---

## 🐛 Troubleshooting

### Imagens não carregam

```javascript
// Verifique o caminho relativo no Vite
// Use import ou caminho absoluto a partir de /public

// ❌ Errado
backgroundImage="/img temas/imagem.png"

// ✅ Correto (com imagens em /public)
backgroundImage="/img temas/imagem.png"

// ✅ Ou com import
import imagemBg from '../img temas/imagem.png';
<ThemeLayout backgroundImage={imagemBg} ... />
```

### Layout quebrado em mobile

```css
/* Adicione no seu CSS global ou themes.css */
html, body {
  margin: 0;
  padding: 0;
  overflow-x: hidden; /* Previne scroll horizontal */
}
```

### Performance ruim

```javascript
// 1. Otimize as imagens (veja OTIMIZACAO_ASSETS.md)
// 2. Use WebP/AVIF
// 3. Implemente code splitting com React.lazy()
// 4. Ative compressão no servidor (gzip/brotli)
```

---

## 📄 Licença

Estes componentes foram criados para uso no projeto Vintage Dev Stack e podem ser customizados livremente conforme necessário.

---

## 🤝 Contribuindo

Para adicionar novos temas:

1. Crie o componente em `src/themes/NovoTema.jsx`
2. Use `ThemeLayout` como base
3. Adicione exports em `index.js`
4. Adicione metadados em `themesMetadata`
5. Documente contraste e uso recomendado

---

**Dúvidas?** Consulte [OTIMIZACAO_ASSETS.md](../../OTIMIZACAO_ASSETS.md) para otimização de imagens e performance.
