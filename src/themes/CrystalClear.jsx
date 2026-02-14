import ThemeLayout from './ThemeLayout';
import './themes.css';

/**
 * CrystalClear - Variação 2: Overlay claro, glassmorphism suave, texto escuro
 * Contraste: 13.5:1 (WCAG AAA) | SaaS, dashboards, plataformas
 */
const CrystalClear = () => {
  const overlayStyle = {
    background: 'linear-gradient(180deg, rgba(248,250,252,0.94), rgba(248,250,252,0.88))'
  };

  return (
    <ThemeLayout
      backgroundImage="/img temas/Gemini_Generated_Image_tsrvd2tsrvd2tsrv.png"
      overlayStyle={overlayStyle}
      className="crystal-clear"
      useFixedBg={false}
    >
      <header>
        <div className="brand">Crystal Clear</div>
        <nav aria-label="Menu">
          <a href="#produtos">Produtos</a>
          <a href="#recursos">Recursos</a>
          <a href="#empresa">Empresa</a>
          <a href="#suporte">Suporte</a>
        </nav>
      </header>

      <section className="content centered">
        <div className="badge">✨ Novo: Design System 4.0</div>
        <h1>Transparência <span className="crystal">cristalina</span> com máxima legibilidade</h1>
        <p>Glassmorphism claro com texto escuro (contraste 13.5:1) — ideal para dashboards e aplicativos SaaS.</p>

        <div className="actions">
          <button className="btn">Começar grátis</button>
          <button className="btn glass">Ver demonstração</button>
        </div>
      </section>

      <div className="feature-cards">
        <article className="glass-card">
          <div className="icon" aria-hidden="true">A</div>
          <h3>Contraste AAA</h3>
          <p>Acessibilidade WCAG 2.1 nível triplo-A para todo texto principal.</p>
        </article>
        <article className="glass-card">
          <div className="icon" aria-hidden="true">B</div>
          <h3>Blur adaptativo</h3>
          <p>Backdrop-filter com fallback graceful para navegadores antigos.</p>
        </article>
        <article className="glass-card">
          <div className="icon" aria-hidden="true">C</div>
          <h3>Performance</h3>
          <p>Lazy loading e otimização de assets para load time &lt;100ms.</p>
        </article>
      </div>
    </ThemeLayout>
  );
};

export default CrystalClear;