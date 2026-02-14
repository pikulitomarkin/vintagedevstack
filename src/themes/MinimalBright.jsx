import ThemeLayout from './ThemeLayout';
import './themes.css';

/**
 * MinimalBright - Variação 2: Overlay claro, tipografia minimalista
 * Contraste: 12.6:1 (WCAG AAA) | Ideal para SaaS/dashboards
 */
const MinimalBright = () => {
  const overlayStyle = {
    background: 'linear-gradient(180deg, rgba(250,251,252,0.94), rgba(250,251,252,0.90))'
  };

  return (
    <ThemeLayout
      backgroundImage="/img temas/Gemini_Generated_Image_7oz7al7oz7al7oz7.png"
      overlayStyle={overlayStyle}
      className="minimal-bright"
      useFixedBg={false}
    >
      <header>
        <div className="logo">Minimal Bright</div>
        <nav aria-label="Navegação principal">
          <a href="#produtos">Produtos</a>
          <a href="#solucoes">Soluções</a>
          <a href="#empresa">Empresa</a>
          <a href="#contato">Contato</a>
        </nav>
      </header>

      <section className="content">
        <div className="eyebrow">Design System 3.0</div>
        <h1>Clareza absoluta para produtos digitais complexos</h1>
        <p>Overlay claro com texto escuro (contraste 12.6:1) — ideal para dashboards, SaaS e plataformas que exigem máxima legibilidade.</p>
        
        <div className="actions">
          <button className="btn">Acessar plataforma</button>
          <button className="btn secondary">Ver documentação</button>
        </div>

        <div className="badge" aria-label="Certificação">WCAG AAA Certificado</div>
      </section>
    </ThemeLayout>
  );
};

export default MinimalBright;