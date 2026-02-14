import ThemeLayout from './ThemeLayout';
import './themes.css';

/**
 * TexturaVintage - Tema 3: Orgânico, texturizado, tipografia serif
 * Grain/vignette effects | Paleta: terroso, creme, teal
 */
const TexturaVintage = () => {
  const overlayStyle = {
    background: 'linear-gradient(180deg, rgba(4,4,6,0.35), rgba(4,4,6,0.65))',
    mixBlendMode: 'multiply'
  };

  return (
    <ThemeLayout
      backgroundImage="/img temas/Gemini_Generated_Image_dmel6odmel6odmel.png"
      overlayStyle={overlayStyle}
      className="textura-vintage grain vignette"
      useFixedBg={false}
    >
      <header>
        <div className="brand">Veludo Retrô</div>
        <nav aria-label="Topo">
          <a href="#portfolio">Portfólio</a>
          <a href="#estudio">Estúdio</a>
          <a href="#contato">Contato</a>
        </nav>
      </header>

      <section className="hero-content">
        <div style={{ maxWidth: '52ch' }}>
          <h1>A atmosfera tátil — história em cada pixel.</h1>
          <p>Uso de texturas, grain e cores quentes para trazer sensações analógicas. Contraste garantido pelo overlay.</p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button className="btn">Explorar coleção</button>
            <div className="accent" aria-hidden="true" />
          </div>
        </div>

        <div className="card" style={{ width: '260px' }}>
          <strong>Tratamento tipográfico</strong>
          <p style={{ marginTop: '.5rem' }}>Serif para títulos + sans para textos: hierarquia clássica.</p>
        </div>
      </section>
    </ThemeLayout>
  );
};

export default TexturaVintage;