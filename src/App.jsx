import { useState, useEffect } from 'react'
import ThemeLayout from './themes/ThemeLayout'
import { themeSkins, themesMetadata } from './themes'
import './themes/themes.css'

import HeroSection from './components/HeroSection'
import PortfolioSection from './components/PortfolioSection'
import ServicesSection from './components/ServicesSection'
import AboutSection from './components/AboutSection'
import ContactSection from './components/ContactSection'

// Seleciona uma skin aleatória — aplicada como background do site existente
const getRandomSkin = () => {
  const idx = Math.floor(Math.random() * themeSkins.length)
  return themeSkins[idx]
}

export default function App() {
  // inicializa tema a partir do query param `?theme=` (fallback: aleatório)
  const initialThemeId = (() => {
    try {
      const param = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('theme') : null
      if (param && themeSkins.some(s => s.id === param)) return param
    } catch (e) {
      /* noop */
    }
    return getRandomSkin().id
  })()

  const [currentThemeId, setCurrentThemeId] = useState(initialThemeId)
  const [showSelector, setShowSelector] = useState(true)

  // atualiza query string sem recarregar quando o tema muda
  useEffect(() => {
    if (typeof window === 'undefined') return
    const url = new URL(window.location.href)
    url.searchParams.set('theme', currentThemeId)
    window.history.replaceState({}, '', url)
  }, [currentThemeId])

  const selectedSkin = themeSkins.find(s => s.id === currentThemeId) || themeSkins[0]
  const currentMetadata = themesMetadata.find(t => t.id === currentThemeId)

  return (
    <>
      {/* Theme Selector (visível por padrão; permanece em produção conforme solicitado) */}
      {showSelector ? (
        <div className="theme-selector glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <strong style={{ fontSize: '0.95rem' }}>Selecionar tema</strong>
            <button onClick={() => setShowSelector(false)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.25rem', cursor: 'pointer' }} aria-label="Fechar seletor">×</button>
          </div>

          <select
            className="theme-select"
            value={currentThemeId}
            onChange={e => setCurrentThemeId(e.target.value)}
          >
            {themesMetadata.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          {currentMetadata && (
            <div style={{ fontSize: '0.85rem', lineHeight: 1.4, color: 'rgba(255,255,255,0.87)' }}>
              <div><strong>Categoria:</strong> {currentMetadata.category}</div>
              <div><strong>Overlay:</strong> {currentMetadata.overlay}</div>
              <div style={{ marginTop: '0.5rem' }}>
                <strong>Paleta:</strong>
                <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.25rem' }}>
                  {currentMetadata.colors.map((c, i) => (
                    <div key={i} title={c} className="theme-swatch" style={{ background: c }} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button onClick={() => setShowSelector(true)} className="theme-toggle-btn">🎨 Trocar tema</button>
      )}

      {/* Site com o skin selecionado (usa os componentes reais) */}
      <ThemeLayout {...selectedSkin}>
        <HeroSection />
        <PortfolioSection />
        <ServicesSection />
        <AboutSection />
        <ContactSection />
      </ThemeLayout>
    </>
  )
}

