# Vintage DevStack - Site Institucional

Site institucional da Vintage DevStack com design inspirado em esquemas técnicos e blueprints industriais.

## 🎨 Design

O site utiliza uma estética **Blueprint Industrial** com:
- Fundo azul marinho profundo (#002244)
- Linhas de grade sutis
- Elementos de destaque em azul elétrico neon (#00D4FF)
- Tipografia monoespaçada para detalhes técnicos
- Fonte serifada clássica para títulos
- Bordas que remetem a desenhos de patentes e diagramas de engenharia

## 🚀 Tecnologias

- **React 18** - Biblioteca UI
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **PostCSS** - Processamento de CSS

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview
```

## 📁 Estrutura do Projeto

```
vintage-devstack/
├── src/
│   ├── components/
│   │   ├── HeroSection.jsx      # Seção hero com válvula termiônica
│   │   ├── PortfolioSection.jsx  # Cards dos projetos
│   │   ├── ServicesSection.jsx  # Lista de serviços
│   │   └── AboutSection.jsx      # Seção sobre a marca
│   ├── App.jsx                   # Componente principal
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Estilos globais e utilitários
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🎯 Seções

### Hero Section
- Título "Vintage DevStack"
- Subtítulo "Engenharia de Software de Precisão & Automação de IA"
- Elemento visual de válvula termiônica digital
- Annotations técnicas

### Portfolio Section
Cards dinâmicos dos principais projetos:
- **AstraFuture** - Gestão e Arquitetura
- **MinasTaxi** - Automação Logística e APIs
- **Diarist Gold / Sonora** - Marketplaces e SaaS
- **Automações n8n** - Integrações de IA e WhatsApp
- **Curso C# Hotmart** - Capacidade Educacional

### Services Section
Lista de serviços oferecidos:
- Automação Logística
- Agentes de IA Multicanal
- Desenvolvimento SaaS
- Consultoria em Engenharia de Software

### About Section
História da fusão entre engenharia clássica e desenvolvimento moderno, inspirada no Passat 87.

## 🎨 Customização

As cores e estilos podem ser ajustados no arquivo `tailwind.config.js`:

```javascript
colors: {
  'navy-deep': '#002244',
  'electric-blue': '#00D4FF',
  'tech-white': '#F0F8FF',
  'accent-neon': '#00FF88',
}
```

## 📝 Licença

Proprietário - Vintage DevStack

