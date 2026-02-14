import ThemeLayout from './ThemeLayout';
import './themes.css';

/**
 * AuroraGlass - Tema 4: Glassmorphism, cores frias, movimento suave
 * Paleta: ciano, roxo, off-white | Animações sutis
 */
const AuroraGlass = () => {
  const overlayStyle = {
    background: 'linear-gradient(180deg, rgba(2,8,23,0.35), rgba(2,8,23,0.5))'
  };

  const animatedGradient = (
    <div className="animated-gradient" aria-hidden="true" />
  );

  return (
    <ThemeLayout
      backgroundImage="/img temas/Gemini_Generated_Image_tsrvd2tsrvd2tsrv.png"
      overlayStyle={overlayStyle}
      className="aurora-glass"
      extraElements={animatedGradient}
    >
      <header>
        <div className="brand">Aurora Glass</div>
        <nav aria-label="Menu">
          <a href="#inicio">Início</a>
          <a href="#produtos">Produtos</a>
          <a href="#contato">Contato</a>
        </nav>
      </header>

      <section className="hero-inner">
        <div>
          <h1>Vidro e luz — interface leve com profundidade.</h1>
          <p>Glassmorphism com gradientes translúcidos e micro-animações. Alto contraste para texto e CTA claro.</p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button className="btn">Começar</button>
            <div className="glass-panel" aria-hidden="true">
              <div className="glass-dot" />
              <div>Posicionamento: top/right • overlay translúcido</div>
            </div>
          </div>
        </div>
      </section>
    </ThemeLayout>
  );
};

export default AuroraGlass;