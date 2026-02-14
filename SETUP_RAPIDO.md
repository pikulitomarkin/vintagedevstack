# 🚀 Setup Rápido — Começar em 5 minutos

Este guia mostra como testar os 12 temas imediatamente no seu projeto.

---

## Opção 1: Testar Previews HTML (0 minutos) ⚡

```bash
# Abrir galeria de temas no navegador
start preview-themes/index.html

# Ou navegador específico
chrome preview-themes/index.html
firefox preview-themes/index.html
```

**Pronto!** Navegue pelos 12 temas e teste responsividade (F12 → Device Toolbar).

---

## Opção 2: Usar Componentes React (2 minutos) ⚛️

### Passo 1: Copiar exemplo para App.jsx

```bash
# Windows (PowerShell)
Copy-Item src\themes\App.example.jsx src\App.jsx -Force

# Linux/macOS
cp src/themes/App.example.jsx src/App.jsx
```

### Passo 2: Executar dev server

```bash
npm run dev
```

### Passo 3: Abrir no navegador

```
http://localhost:5173
```

**Pronto!** Use o seletor no canto superior direito para trocar entre os 12 temas.

---

## Opção 3: Integrar tema individual (3 minutos) 🎨

### Passo 1: Importar tema desejado

Edite `src/App.jsx`:

```jsx
import { AmanhecerGradient } from './themes';

function App() {
  return <AmanhecerGradient />;
}

export default App;
```

### Passo 2: Executar

```bash
npm run dev
```

**Pronto!** Tema ativo no projeto.

---

## Opção 4: Trocar temas dinamicamente (5 minutos) 🔄

### Criar switcher simples

Edite `src/App.jsx`:

```jsx
import { useState } from 'react';
import { AmanhecerGradient, MinimalDark, AuroraGlass } from './themes';

const themes = {
  amanhecer: AmanhecerGradient,
  minimal: MinimalDark,
  aurora: AuroraGlass
};

function App() {
  const [theme, setTheme] = useState('amanhecer');
  const Theme = themes[theme];

  return (
    <>
      <select 
        value={theme} 
        onChange={(e) => setTheme(e.target.value)}
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 9999,
          padding: '0.5rem'
        }}
      >
        <option value="amanhecer">Amanhecer Gradiente</option>
        <option value="minimal">Minimal Dark</option>
        <option value="aurora">Aurora Glass</option>
      </select>
      
      <Theme />
    </>
  );
}

export default App;
```

**Pronto!** Dropdown funcional para trocar temas.

---

## 📦 Instalar dependências para otimização (opcional)

Se quiser otimizar as imagens originais:

```bash
# Instalar Sharp (processamento de imagens)
npm install sharp

# Executar otimização
npm run optimize-images
```

Resultado: versões WebP/AVIF de cada imagem em `public/images/optimized/`.

---

## 🎨 Personalizar tema existente

### Mudar cores

Edite variáveis CSS no componente:

```jsx
// Exemplo: AmanhecerGradient.jsx
const overlayStyle = {
  background: 'linear-gradient(135deg, rgba(255,0,100,0.6), rgba(0,100,255,0.4))' // Suas cores
};
```

### Mudar tipografia

Adicione em `src/index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;900&display=swap');

body {
  font-family: 'Poppins', system-ui, sans-serif;
}
```

---

## 🐛 Troubleshooting

### Imagens não aparecem

**Causa**: Caminho incorreto  
**Solução**: Verifique que as imagens estão em `img temas/` ou mova para `public/`

```jsx
// Se moveu para public/images/
backgroundImage="/images/nome-da-imagem.png"
```

### Erro "Cannot find module 'sharp'"

**Causa**: Sharp não instalado  
**Solução**: 

```bash
npm install sharp --save-dev
```

### Layout quebrado em mobile

**Causa**: CSS não importado  
**Solução**: Adicione em   `src/App.jsx`:

```jsx
import './themes/themes.css';
```

---

## ✅ Checklist de setup completo

- [ ] Testei previews HTML (`preview-themes/index.html`)
- [ ] Copiei `App.example.jsx` para `App.jsx`
- [ ] Executei `npm run dev` e abri `localhost:5173`
- [ ] Consegui trocar entre temas usando o seletor
- [ ] (Opcional) Instalei Sharp e otimizei imagens
- [ ] (Opcional) Customizei cores/tipografia

---

## 📚 Próximos passos

1. Leia [src/themes/README.md](src/themes/README.md) para customização avançada
2. Veja [OTIMIZACAO_ASSETS.md](OTIMIZACAO_ASSETS.md) para performance
3. Consulte [TEMAS_RESUMO.md](TEMAS_RESUMO.md) para visão geral completa

---

## 🆘 Precisa de ajuda?

- **Componentes React**: `src/themes/README.md`
- **Otimização**: `OTIMIZACAO_ASSETS.md`
- **Visão geral**: `TEMAS_RESUMO.md`
- **Testes de contraste**: https://webaim.org/resources/contrastchecker/

---

**🎉 Divirta-se criando!**

Todos os 12 temas estão prontos para produção com contraste garantido, responsividade completa e performance otimizada.
