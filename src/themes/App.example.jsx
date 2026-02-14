/**
 * EXEMPLO DE USO DOS 12 TEMAS
 * Copie este código para src/App.jsx para testar os temas
 */

import { useState } from 'react';
import {
  AmanhecerGradient,
  AmanhecerLight,
  AmanhecerSplit,
  MinimalDark,
  MinimalBright,
  ElectricAsymmetric,
  TexturaVintage,
  ArtisanClean,
  WarmFade,
  AuroraGlass,
  CrystalClear,
  VibrantCards,
  themesMetadata
} from './themes';
import './themes/themes.css';

// Mapeamento de IDs para componentes
const themeComponents = {
  'amanhecer-gradient': AmanhecerGradient,
  'amanhecer-light': AmanhecerLight,
  'amanhecer-split': AmanhecerSplit,
  'minimal-dark': MinimalDark,
  'minimal-bright': MinimalBright,
  'electric-asymmetric': ElectricAsymmetric,
  'textura-vintage': TexturaVintage,
  'artisan-clean': ArtisanClean,
  'warm-fade': WarmFade,
  'aurora-glass': AuroraGlass,
  'crystal-clear': CrystalClear,
  'vibrant-cards': VibrantCards
};

function App() {
  const [currentThemeId, setCurrentThemeId] = useState('amanhecer-gradient');
  const [showSelector, setShowSelector] = useState(true);

  // Componente ativo
  const ThemeComponent = themeComponents[currentThemeId];
  const currentMetadata = themesMetadata.find(t => t.id === currentThemeId);

  return (
    <>
      {/* Theme Selector */}
      {showSelector && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(10px)',
            padding: '1rem',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            maxWidth: '320px',
            color: '#fff'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ margin: 0, fontSize: '1rem' }}>Selecionar Tema</h3>
            <button
              onClick={() => setShowSelector(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '1.5rem',
                padding: 0,
                lineHeight: 1
              }}
              aria-label="Fechar seletor"
            >
              ×
            </button>
          </div>

          <select
            value={currentThemeId}
            onChange={(e) => setCurrentThemeId(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              fontSize: '0.95rem',
              cursor: 'pointer',
              marginBottom: '0.75rem'
            }}
          >
            {themesMetadata.map(theme => (
              <option key={theme.id} value={theme.id} style={{ background: '#1a1a1a' }}>
                {theme.name}
              </option>
            ))}
          </select>

          {/* Metadata do tema atual */}
          {currentMetadata && (
            <div style={{ fontSize: '0.85rem', lineHeight: 1.5, color: 'rgba(255,255,255,0.8)' }}>
              <div><strong>Categoria:</strong> {currentMetadata.category}</div>
              <div><strong>Contraste:</strong> {currentMetadata.contrast}</div>
              <div><strong>Overlay:</strong> {currentMetadata.overlay}</div>
              <div style={{ marginTop: '0.5rem' }}>
                <strong>Paleta:</strong>
                <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.25rem' }}>
                  {currentMetadata.colors.map((color, i) => (
                    <div
                      key={i}
                      style={{
                        width: '24px',
                        height: '24px',
                        background: color,
                        borderRadius: '4px',
                        border: '1px solid rgba(255,255,255,0.2)'
                      }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Toggle button (quando selector está fechado) */}
      {!showSelector && (
        <button
          onClick={() => setShowSelector(true)}
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            border: 'none',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 600,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}
        >
          🎨 Trocar Tema
        </button>
      )}

      {/* Renderizar tema ativo */}
      <ThemeComponent key={currentThemeId} />
    </>
  );
}

export default App;