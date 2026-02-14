import ThemeLayout from './ThemeLayout';
import './themes.css';

/**
 * WarmFade - Variação 3: Overlay colorido warm com fade lateral
 * Contraste: 11.8:1 (WCAG AAA) | Storytelling visual, blogs premium
 */
const WarmFade = () => {
  const overlayStyle = {
    background: 'linear-gradient(90deg, rgba(26,16,10,0.95) 0%, rgba(26,16,10,0.75) 35%, transparent 70%), linear-gradient(180deg, rgba(199,121,67,0.08), transparent 50%)'
  };

  return (
    <ThemeLayout
      backgroundImage="/img temas/Gemini_Generated_Image_dmel6odmel6odmel.png"
      overlayStyle={overlayStyle}
      className="warm-fade"
      useFixedBg={false}
    >
      <div className="content">
        <header>
          <div className="logo">Warm Fade</div>
        </header>

        <div className="tag">Handcrafted Experience</div>
        
        <h1>Cores <span className="warm-text">quentes</span> com fade lateral natural</h1>
        <p>Gradiente lateral que preserva a imagem (contraste 11.8:1) — perfeito para storytelling visual e marcas com identidade terrosa.</p>

        <div className="btn-row">
          <button className="btn">Começar jornada</button>
          <button className="btn ghost">Ver cases</button>
        </div>

        <div className="stats">
          <div className="stat">
            <strong>90%</strong>
            <span>Retenção</span>
          </div>
          <div className="stat">
            <strong>11.8:1</strong>
            <span>Contraste</span>
          </div>
          <div className="stat">
            <strong>AAA</strong>
            <span>Acessível</span>
          </div>
        </div>
      </div>
    </ThemeLayout>
  );
};

export default WarmFade;