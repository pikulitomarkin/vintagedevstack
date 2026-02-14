import ThemeLayout from './ThemeLayout';
import './themes.css';

/**
 * VibrantCards - Variação 3: Layout de cards vibrantes com overlay multicolor
 * Contraste: 14.2:1 (WCAG AAA) | SaaS, plataformas, marketplaces
 */
const VibrantCards = () => {
  const overlayStyle = {
    background: 'radial-gradient(ellipse 1200px 900px at 70% 30%, rgba(139,92,246,0.2), transparent 60%), radial-gradient(ellipse 1000px 800px at 30% 70%, rgba(6,182,212,0.18), transparent 65%), linear-gradient(135deg, rgba(10,14,26,0.85), rgba(10,14,26,0.78))'
  };

  return (
    <ThemeLayout
      backgroundImage="/img temas/Gemini_Generated_Image_tsrvd2tsrvd2tsrv.png"
      overlayStyle={overlayStyle}
      className="vibrant-cards"
    >
      <header>
        <div className="brand">Vibrant Cards</div>
        <nav aria-label="Navegação principal">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#docs">Docs</a>
          <a href="#support">Support</a>
        </nav>
      </header>

      <section className="intro">
        <h1>Layouts <span className="gradient-text">vibrantes e modulares</span> para produtos digitais</h1>
        <p>Overlay multicolor com cards interativos (contraste 14.2:1) — perfeito para plataformas SaaS e marketplaces.</p>

        <div className="cta">
          <button className="btn">Start free trial</button>
          <button className="btn outline">View pricing</button>
        </div>
      </section>

      <div className="card-grid">
        <article className="vibrant-card">
          <div className="card-icon cyan" aria-hidden="true">⚡</div>
          <h3>Performance extrema</h3>
          <p>Lazy load, IntersectionObserver e otimização de assets para load time &lt;80ms em 3G.</p>
        </article>

        <article className="vibrant-card">
          <div className="card-icon purple" aria-hidden="true">🎨</div>
          <h3>Design tokens</h3>
          <p>Variáveis CSS organizadas para fácil customização e manutenção de temas.</p>
        </article>

        <article className="vibrant-card">
          <div className="card-icon pink" aria-hidden="true">♿</div>
          <h3>Acessibilidade AAA</h3>
          <p>Contraste 14.2:1, áreas de toque 44×44px, focus states e suporte screen readers.</p>
        </article>
      </div>
    </ThemeLayout>
  );
};

export default VibrantCards;