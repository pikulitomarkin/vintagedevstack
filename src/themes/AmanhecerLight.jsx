import ThemeLayout from './ThemeLayout';
import './themes.css';

/**
 * AmanhecerLight - Variação 2: Overlay claro com texto escuro
 * Contraste: 7.8:1 (WCAG AAA para tamanhos grandes) | Layout: centrado
 */
const AmanhecerLight = () => {
  const overlayStyle = {
    background: 'linear-gradient(180deg, rgba(255,250,245,0.92) 0%, rgba(255,250,245,0.88) 100%)'
  };

  return (
    <ThemeLayout
      backgroundImage="/img temas/Gemini_Generated_Image_1pnebo1pnebo1pnebo.png"
      overlayStyle={overlayStyle}
      className="amanhecer-light"
      useFixedBg={false}
    >
      <header>
        <div className="brand">Amanhecer Light</div>
        <nav aria-label="Menu">
          <a href="#inicio">Início</a>
          <a href="#servicos">Serviços</a>
          <a href="#contato">Contato</a>
        </nav>
      </header>

      <div className="content centered">
        <h1>Design claro e <span className="highlight">vibrante</span> para marcas que se destacam</h1>
        <p>Overlay claro com texto escuro (contraste 7.8:1) — perfeito para conteúdo com muita informação mantendo a imagem visível.</p>

        <div className="cta">
          <button className="btn">Começar agora</button>
          <button className="btn outline">Ver exemplos</button>
        </div>

        <section className="features">
          <article className="card">
            <h3>Alto contraste</h3>
            <p>Texto escuro sobre fundo claro — legibilidade máxima.</p>
          </article>
          <article className="card">
            <h3>Centrado</h3>
            <p>Layout focado no centro para hierarquia clara.</p>
          </article>
          <article className="card">
            <h3>Acessível</h3>
            <p>Atende WCAG AAA para texto de corpo (&gt;7:1).</p>
          </article>
        </section>
      </div>
    </ThemeLayout>
  );
};

export default AmanhecerLight;