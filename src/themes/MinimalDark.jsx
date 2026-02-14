import ThemeLayout from './ThemeLayout';
import './themes.css';

/**
 * MinimalDark - Tema 2: Elegante, tipografia minimal, CTA clara
 * Contraste: WCAG AA+ | Paleta: escuro, azul accent
 */
const MinimalDark = () => {
  const overlayStyle = {
    background: 'radial-gradient(1200px 400px at 85% 20%, rgba(96,165,250,0.12), transparent 20%), linear-gradient(180deg, rgba(2,6,23,0.65), rgba(2,6,23,0.78))'
  };

  return (
    <ThemeLayout
      backgroundImage="/img temas/Gemini_Generated_Image_7oz7al7oz7al7oz7.png"
      overlayStyle={overlayStyle}
      className="minimal-dark"
    >
      <header>
        <div className="brand">Minimal Dark</div>
        <nav aria-label="Navegação">
          <a href="#sobre">Sobre</a>
          <a href="#trabalhos">Trabalhos</a>
          <a href="#contato">Contato</a>
        </nav>
      </header>

      <section className="layout">
        <div>
          <h1>Foco no conteúdo — estética sóbria.</h1>
          <p className="muted">Espaço respirável, tipografia forte e CTA claro. Overlay escuro garante contraste elevado mesmo com imagens complexas.</p>
          <div className="actions">
            <button className="btn primary">Veja o case</button>
            <button className="btn">Contato</button>
          </div>
        </div>

        <aside className="card" aria-hidden="true">
          <strong>Tratamento</strong>
          <p style={{ marginTop: '.5rem' }}>Overlay escuro + radial accent • Posicionamento: right</p>
        </aside>
      </section>
    </ThemeLayout>
  );
};

export default MinimalDark;