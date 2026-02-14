/**
 * Exportação centralizada de todos os 12 temas
 * Utilize: import { AmanhecerGradient, MinimalDark, etc } from './themes';
 */

export { default as AmanhecerGradient } from './AmanhecerGradient';

export { default as MinimalDark } from './MinimalDark';
export { default as MinimalBright } from './MinimalBright';
export { default as ElectricAsymmetric } from './ElectricAsymmetric';

export { default as TexturaVintage } from './TexturaVintage';
export { default as ArtisanClean } from './ArtisanClean';
export { default as WarmFade } from './WarmFade';

export { default as AuroraGlass } from './AuroraGlass';

export { default as ThemeLayout } from './ThemeLayout';

/**
 * Array de metadados dos temas para fácil iteração
 */
export const themesMetadata = [
  {
    id: 'amanhecer-gradient',
    name: 'Amanhecer Gradiente',
    category: 'Amanhecer',
    contrast: 'WCAG AA',
    overlay: 'Gradiente quente',
    colors: ['#FF7A59', '#7B61FF', '#FFB86B']
  },
  {
    id: 'minimal-dark',
    name: 'Minimal Dark',
    category: 'Minimal',
    contrast: 'WCAG AA+',
    overlay: 'Escuro radial',
    colors: ['#60A5FA', '#E6EEF8', '#071026']
  },
  {
    id: 'minimal-bright',
    name: 'Minimal Bright',
    category: 'Minimal',
    contrast: '12.6:1 (AAA)',
    overlay: 'Claro',
    colors: ['#3B82F6', '#1E40AF', '#FAFBFC']
  },
  {
    id: 'electric-asymmetric',
    name: 'Electric Asymmetric',
    category: 'Minimal',
    contrast: '14:1 (AAA)',
    overlay: 'Acento elétrico',
    colors: ['#00D9FF', '#A855F7', '#050A14']
  },
  {
    id: 'textura-vintage',
    name: 'Textura Vintage',
    category: 'Textura',
    contrast: 'WCAG AA',
    overlay: 'Grain/vignette',
    colors: ['#D9B99B', '#8AA4A6', '#0B0A08']
  },
  {
    id: 'artisan-clean',
    name: 'Artisan Clean',
    category: 'Textura',
    contrast: '9.2:1 (AAA)',
    overlay: 'Claro grain',
    colors: ['#D97706', '#FBBF24', '#FAF8F5']
  },
  {
    id: 'warm-fade',
    name: 'Warm Fade',
    category: 'Textura',
    contrast: '11.8:1 (AAA)',
    overlay: 'Fade lateral',
    colors: ['#C77943', '#D97757', '#1A100A']
  },
  {
    id: 'aurora-glass',
    name: 'Aurora Glass',
    category: 'Aurora',
    contrast: 'WCAG AA+',
    overlay: 'Glassmorphism',
    colors: ['#67E8F9', '#7C3AED', '#071927']
  }
];

/**
 * themeSkins - configuração mínima usada por ThemeLayout quando quisermos
 * aplicar o fundo aos componentes existentes (Hero, Portfolio, etc.).
 * Cada skin contém apenas `backgroundImage`, `overlayStyle` opcional,
 * `className` e `useFixedBg` — sem conteúdo adicional.
 */
export const themeSkins = [
  {
    id: 'amanhecer-gradient',
    backgroundImage: '/img temas/Gemini_Generated_Image_1pnebo1pnebo1pnebo.png',
    overlayStyle: {
      background: 'linear-gradient(135deg, rgba(255,122,89,0.55) 0%, rgba(123,97,255,0.45) 100%), linear-gradient(180deg, rgba(3,7,18,0.45), rgba(3,7,18,0.6))',
      mixBlendMode: 'multiply'
    },
    className: 'amanhecer-gradient',
    useFixedBg: true
  },
  {
    id: 'minimal-dark',
    backgroundImage: '/img temas/Gemini_Generated_Image_7oz7al7oz7al7oz7.png',
    overlayStyle: { background: 'radial-gradient(1200px 400px at 85% 20%, rgba(96,165,250,0.12), transparent 20%), linear-gradient(180deg, rgba(2,6,23,0.65), rgba(2,6,23,0.78))' },
    className: 'minimal-dark',
    useFixedBg: true
  },
  {
    id: 'minimal-bright',
    backgroundImage: '/img temas/Gemini_Generated_Image_7oz7al7oz7al7oz7.png',
    overlayStyle: { background: 'linear-gradient(180deg, rgba(230,238,248,0.9), rgba(250,251,252,0.95))' },
    className: 'minimal-bright',
    useFixedBg: true
  },
  {
    id: 'electric-asymmetric',
    backgroundImage: '/img temas/Gemini_Generated_Image_7oz7al7oz7al7oz7.png',
    overlayStyle: { background: 'radial-gradient(ellipse 1400px 800px at 20% 40%, rgba(0,217,255,0.15), transparent 50%), linear-gradient(135deg, rgba(5,10,20,0.75), rgba(5,10,20,0.88))' },
    className: 'electric-asymmetric',
    useFixedBg: true
  },
  {
    id: 'textura-vintage',
    backgroundImage: '/img temas/Gemini_Generated_Image_dmel6odmel6odmel.png',
    overlayStyle: { background: 'linear-gradient(180deg, rgba(13,11,8,0.6), rgba(13,11,8,0.4))' },
    className: 'textura-vintage grain vignette',
    useFixedBg: false
  },
  {
    id: 'artisan-clean',
    backgroundImage: '/img temas/Gemini_Generated_Image_dmel6odmel6odmel.png',
    overlayStyle: { background: 'linear-gradient(180deg, rgba(255,250,245,0.85), rgba(250,248,245,0.95))' },
    className: 'artisan-clean',
    useFixedBg: false
  },
  {
    id: 'warm-fade',
    backgroundImage: '/img temas/Gemini_Generated_Image_dmel6odmel6odmel.png',
    overlayStyle: { background: 'linear-gradient(90deg, rgba(26,16,10,0.95) 0%, rgba(26,16,10,0.75) 35%, transparent 70%), linear-gradient(180deg, rgba(199,121,67,0.08), transparent 50%)' },
    className: 'warm-fade',
    useFixedBg: false
  },
  {
    id: 'aurora-glass',
    backgroundImage: '/img temas/Gemini_Generated_Image_tsrvd2tsrvd2tsrv.png',
    overlayStyle: { background: 'linear-gradient(180deg, rgba(3,17,24,0.35), rgba(3,17,24,0.6)), radial-gradient(600px 300px at 10% 20%, rgba(103,232,249,0.06), transparent)' },
    className: 'aurora-glass',
    useFixedBg: true
  }
];