import ThemeLayout from './ThemeLayout';
import './themes.css';

/**
 * AmanhecerSplit - Variação 3: Split screen com overlay lateral
 * Contraste: 15.2:1 (WCAG AAA) | Layout: split 45/55
 */
const AmanhecerSplit = () => {
  return (
    <div className="split-theme amanhecer-split">
      <section className="panel">
        <header>
          <div className="logo">Amanhecer Split</div>
        </header>

        <h1>Layout split-screen para <span className="gradient-text">impacto visual lateral</span></h1>
        <p>Texto branco em painel escuro (contraste 15.2:1) + imagem à direita — ideal para apresentações de produto.</p>

        <div className="btn-group">
          <button className="btn">Solicitar demo</button>
          <button className="btn ghost">Ver portfólio</button>
        </div>

        <div className="stats">
          <div className="stat">
            <strong>98%</strong>
            <span>Satisfação</span>
          </div>
          <div className="stat">
            <strong>15ms</strong>
            <span>Load time</span>
          </div>
          <div className="stat">
            <strong>AAA</strong>
            <span>Contraste</span>
          </div>
        </div>
      </section>

      <aside className="image-side" aria-label="Imagem de fundo">
        <div 
          className="bg" 
          style={{ backgroundImage: 'url(/img temas/Gemini_Generated_Image_1pnebo1pnebo1pnebo.png)' }}
        />
        <div className="gradient-overlay" aria-hidden="true" />
      </aside>
    </div>
  );
};

export default AmanhecerSplit;