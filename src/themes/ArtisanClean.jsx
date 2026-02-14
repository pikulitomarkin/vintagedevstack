import ThemeLayout from './ThemeLayout';
import './themes.css';

/**
 * ArtisanClean - Variação 2: Overlay claro, tipografia moderna, grain sutil
 * Contraste: 9.2:1 | E-commerce artesanal, marcas orgânicas
 */
const ArtisanClean = () => {
  const overlayStyle = {
    background: 'linear-gradient(180deg, rgba(250,248,245,0.95), rgba(250,248,245,0.88))'
  };

  return (
    <ThemeLayout
      backgroundImage="/img temas/Gemini_Generated_Image_dmel6odmel6odmel.png"
      overlayStyle={overlayStyle}
      className="artisan-clean subtle-grain"
      useFixedBg={false}
    >
      <header>
        <div className="brand">Artisan Clean</div>
        <nav aria-label="Navegação">
          <a href="#colecoes">Coleções</a>
          <a href="#sobre">Sobre</a>
          <a href="#contato">Contato</a>
        </nav>
      </header>

      <div className="grid">
        <section>
          <h1>Texturas <span className="highlight">artesanais</span> com clareza contemporânea</h1>
          <p>Overlay claro com grain sutil (contraste 9.2:1) — perfeito para e-commerce artesanal e estúdios criativos.</p>
          <div className="actions">
            <button className="btn">Explorar produtos</button>
            <button className="btn secondary">Ver manifesto</button>
          </div>
        </section>

        <aside className="feature-grid">
          <article className="feature">
            <h3>Contraste alto</h3>
            <p>Texto escuro sobre fundo claro — legibilidade garantida.</p>
          </article>
          <article className="feature">
            <h3>Grain artesanal</h3>
            <p>Toque analógico sem comprometer performance.</p>
          </article>
        </aside>
      </div>
    </ThemeLayout>
  );
};

export default ArtisanClean;