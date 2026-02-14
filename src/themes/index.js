/**
 * Exportação centralizada de todos os 12 temas
 * Utilize: import { AmanhecerGradient, MinimalDark, etc } from './themes';
 */

export { default as AmanhecerGradient } from './AmanhecerGradient';
export { default as AmanhecerLight } from './AmanhecerLight';
export { default as AmanhecerSplit } from './AmanhecerSplit';

export { default as MinimalDark } from './MinimalDark';
export { default as MinimalBright } from './MinimalBright';
export { default as ElectricAsymmetric } from './ElectricAsymmetric';

export { default as TexturaVintage } from './TexturaVintage';
export { default as ArtisanClean } from './ArtisanClean';
export { default as WarmFade } from './WarmFade';

export { default as AuroraGlass } from './AuroraGlass';
export { default as CrystalClear } from './CrystalClear';
export { default as VibrantCards } from './VibrantCards';

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
    id: 'amanhecer-light',
    name: 'Amanhecer Light',
    category: 'Amanhecer',
    contrast: '7.8:1 (AAA)',
    overlay: 'Claro',
    colors: ['#FF6B3D', '#8B4513', '#FFFBF7']
  },
  {
    id: 'amanhecer-split',
    name: 'Amanhecer Split',
    category: 'Amanhecer',
    contrast: '15.2:1 (AAA)',
    overlay: 'Split lateral',
    colors: ['#FF7A59', '#FFB86B', '#0A0604']
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
  },
  {
    id: 'crystal-clear',
    name: 'Crystal Clear',
    category: 'Aurora',
    contrast: '13.5:1 (AAA)',
    overlay: 'Claro glass',
    colors: ['#0EA5E9', '#0284C7', '#F8FAFC']
  },
  {
    id: 'vibrant-cards',
    name: 'Vibrant Cards',
    category: 'Aurora',
    contrast: '14.2:1 (AAA)',
    overlay: 'Multicolor',
    colors: ['#06B6D4', '#8B5CF6', '#EC4899']
  }
];