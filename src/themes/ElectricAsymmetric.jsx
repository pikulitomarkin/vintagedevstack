import ThemeLayout from './ThemeLayout';
import './themes.css';

/**
 * ElectricAsymmetric - Variação 3: Overlay elétrico, layout assimétrico
 * Contraste: 14:1 (WCAG AAA) | Tech startups, gaming, cripto
 */
const ElectricAsymmetric = () => {
  const overlayStyle = {
    background: 'radial-gradient(ellipse 1400px 800px at 20% 40%, rgba(0,217,255,0.15), transparent 50%), linear-gradient(135deg, rgba(5,10,20,0.75), rgba(5,10,20,0.88))'
  };

  const glowElement = (
    <div className="glow" aria-hidden="true" />
  );

  return (
    <ThemeLayout
      backgroundImage="/img temas/Gemini_Generated_Image_7oz7al7oz7al7oz7.png"
      overlayStyle={overlayStyle}
      className="electric-asymmetric"
      extraElements={glowElement}
    >
      <header>
        <div className="brand">Electric Asymmetric</div>
        <nav aria-label="Menu principal">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#docs">Docs</a>
        </nav>
      </header>

      <section>
        <h1>Interface <span className="neon">elétrica</span> com layout assimétrico</h1>
        <p>Acento neon (contraste 14:1 sobre fundo escuro) + glow animado — ideal para tech startups, cripto e gaming.</p>
        <div className="cta">
          <button className="btn">Start building</button>
          <button className="btn outline">View demo</button>
        </div>
      </section>

      <aside className="side-card">
        <h3>Performance</h3>
        <ul>
          <li>Lazy load: IntersectionObserver</li>
          <li>Contraste: 14:1 (WCAG AAA)</li>
          <li>Animações: prefers-reduced-motion</li>
          <li>Touch targets: 44×44px</li>
        </ul>
      </aside>
    </ThemeLayout>
  );
};

export default ElectricAsymmetric;