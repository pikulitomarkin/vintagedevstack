import ThemeLayout from './ThemeLayout';
import './themes.css';

/**
 * AmanhecerGradient - Tema 1: Overlay gradiente quente, layout left/center
 * Contraste: WCAG AA | Paleta: laranja sunrise, violeta, dourado
 */
const AmanhecerGradient = () => {
  const overlayStyle = {
    background: 'linear-gradient(135deg, rgba(255,122,89,0.55) 0%, rgba(123,97,255,0.45) 100%), linear-gradient(180deg, rgba(3,7,18,0.45), rgba(3,7,18,0.6))',
    mixBlendMode: 'multiply'
  };

  return (
    <ThemeLayout
      backgroundImage="/img temas/Gemini_Generated_Image_1pnebo1pnebo1pnebo.png"
      overlayStyle={overlayStyle}
      className="amanhecer-gradient"
    >
      <header className="site-header">
        <div className="logo">Amanhecer</div>
        <nav aria-label="Principal">
          <a href="#home">Home</a>
          <a href="#services">Serviços</a>
          <a href="#contact">Contato</a>
        </nav>
      </header>

      <section className="hero-grid">
        <div>
          <div className="kicker reveal">Design & Experiência</div>
          <h1 className="reveal delay">Layouts inspirados nas cores e texturas da imagem — impacto instantâneo.</h1>
          <p className="lead reveal delay">
            Gradientes quentes, contraste alto para legibilidade e tipografia clara para hierarquia visual imediata.
          </p>
          <div className="cta reveal delay">
            <button className="btn">Ver portfólio</button>
            <button className="btn ghost">Saiba mais</button>
          </div>
        </div>

        <aside className="card reveal" aria-hidden="true">
          <strong>Detalhes rápidos</strong>
          <p style={{ marginTop: '.6rem' }}>
            Posicionamento: left/center • Overlay: gradiente quente + escurecimento
          </p>
        </aside>
      </section>
    </ThemeLayout>
  );
};

export default AmanhecerGradient;