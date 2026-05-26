import React, { useEffect, useState } from 'react';
import { initVintage } from './vintage';

export default function App() {
  const [crtPower, setCrtPower] = useState(true);
  const [crtChannel, setCrtChannel] = useState(1);

  useEffect(() => {
    const handleCrtAction = (e) => {
      const act = e.detail;
      if(act === 'mario') { setCrtChannel(2); setCrtPower(true); }
      if(act === 'off') setCrtPower(false);
      if(act === 'on') setCrtPower(true);
    };
    window.addEventListener('crt-action', handleCrtAction);
    let t = setTimeout(() => { initVintage(); }, 100);
    return () => { clearTimeout(t); window.removeEventListener('crt-action', handleCrtAction); };
  }, []);

  const togglePower = () => setCrtPower(p => !p);
  const setChannel = (ch) => { setCrtPower(true); setCrtChannel(ch); };

  return (
    <>


      {/* ============== STATUS BAR ============== */}
      <header className="statusbar">
        <div className="shell statusbar-inner">
          <div className="left">
            <span className="brand"><span className="v">▮</span> VINTAGE_DEVSTACK</span>
            <span className="lights" aria-hidden="true">
              <span className="light"></span><span className="light b2"></span><span className="light b3 blink"></span>
            </span>
            <span className="t-label" style={{ opacity: 0.7 }}>SYS://VINTAGE · V8.7.3</span>
          </div>
          <nav className="nav">
            <a href="#servicos"><span className="br">[</span>02<span className="br">]</span> Serviços</a>
            <a href="#sobre"><span className="br">[</span>03<span className="br">]</span> Sobre</a>
            <a href="#contato"><span className="br">[</span>04<span className="br">]</span> Contato</a>
            <a href="#" data-open-term><span className="br">[</span>_<span className="br">]</span> Terminal</a>
          </nav>
          <div className="right">
            <span><span id="sound-icon">·</span> AUDIO</span>
            <span>·</span>
            <span id="clock" className="mono">00:00:00</span>
            <span>·</span>
            <span className="glow-pulse">REC ●</span>
          </div>
        </div>
      </header>

      {/* ============== HERO ============== */}
      <main className="shell">

        <section className="hero" data-screen-label="01 Hero">

          <div className="hero-meta">
            <span className="stamp"><span className="dot"></span>ONLINE</span>
            <span>Londrina · PR</span>
            <span>·</span>
            <span>EST. 2025 — 38 PROJETOS</span>
          </div>

          <div className="hero-grid">
            <div className="hero-left">
              <h1>
                Engenharia<br />
                de software<br />
                <span className="underline serif">de precisão</span><br />
                <span className="accent">&amp; automação_</span><span className="cur"></span>
              </h1>

              <p className="lede">
                Sistemas que <strong>não apenas funcionam</strong>, mas que são construídos para durar.
                Fundimos a robustez de máquinas dos anos 80 com IA, automação e arquitetura cloud-native —
                cada decisão tratada como uma peça <span className="tag">de engenharia</span>.
              </p>

              <div className="cta-row">
                <a className="btn primary" href="https://wa.me/5543988713278" target="_blank" rel="noopener">
                  <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 21l1.5-5A9 9 0 1 1 8 19.5L3 21z" />
                    <path
                      d="M8 11.5c.5 1.5 1.7 2.7 3.2 3.2l1.3-1c.3-.2.7-.3 1-.1l2 .8c.4.2.6.6.5 1l-.3 1.2c-.1.5-.6.9-1.1.9C9.3 17.5 6 14.2 6 10.4c0-.5.4-1 .9-1.1l1.2-.3c.4-.1.8.1 1 .5l.8 2c.2.4.1.7-.1 1l-.8 1z" />
                  </svg>
                  WhatsApp direto
                  <span className="kbd">↵</span>
                </a>
                <a className="btn" href="mailto:marcos.padilha@vintagedevstack.com.br">MARCOS.PADILHA@VINTAGEDEVSTACK.COM.BR
                </a>
                <a className="btn ghost" href="#" data-open-term>
                  <span style={{ fontFamily: "'VT323'", fontSize: '18px' }}>&gt;_</span>
                  Abrir terminal
                  <span className="kbd">/</span>
                </a>
              </div>
            </div>

            {/* CRT machine */}
            <div className="crt-wrap" aria-hidden="true">
              <div className="crt">
                <div className="crt-top">
                  <span className="label">VINTAGE-CRT MODEL 87</span>
                  <span className="pwr" style={{ cursor: 'pointer' }} onClick={togglePower} title="Ligar/Desligar"><span className="pwr-dot" style={{ background: crtPower ? 'var(--accent)' : 'transparent', boxShadow: crtPower ? '0 0 8px var(--accent)' : 'none' }}></span>PWR</span>
                </div>
                <div className={`crt-screen ${!crtPower ? 'screen-off' : ''}`}>
                  <div className="scroll" id="crt-scroll" style={{ display: crtChannel === 1 ? 'block' : 'none' }}></div>
                  {crtChannel === 2 && (
                    <div className="mario-container">
                      <div className="mario-scaler">
                        <iframe src="https://supermarioemulator.com/mario.php" title="Super Mario Bros" style={{ width: '100%', height: '100%', border: 'none' }} />
                      </div>
                    </div>
                  )}
                </div>
                <div className="crt-base">
                  <div className="knobs">
                    <div className="knob" style={{ transform: crtChannel === 1 ? 'rotate(-30deg)' : 'rotate(0deg)', cursor: 'pointer' }} onClick={() => setChannel(1)} title="Canal 1 (Terminal)"></div>
                    <div className="knob" style={{ transform: crtChannel === 2 ? 'rotate(-30deg)' : 'rotate(0deg)', cursor: 'pointer' }} onClick={() => setChannel(2)} title="Canal 2 (Mario)"></div>
                    <div className="knob" style={{ transform: 'rotate(15deg)', cursor: 'pointer' }} onClick={togglePower} title="Ligar/Desligar"></div>
                  </div>
                  <div className="meter">CH·{crtChannel} ─ 50Hz ─ AC</div>
                </div>
              </div>
            </div>
          </div>

          <div className="tape" aria-hidden="true">
            <div className="tape-track">
              <span>PYTHON</span><span className="sep">◆</span>
              <span>TYPESCRIPT</span><span className="sep">◆</span>
              <span>GO</span><span className="sep">◆</span>
              <span>RUST</span><span className="sep">◆</span>
              <span>POSTGRES</span><span className="sep">◆</span>
              <span>KUBERNETES</span><span className="sep">◆</span>
              <span>AWS</span><span className="sep">◆</span>
              <span>LLM AGENTS</span><span className="sep">◆</span>
              <span>LANGCHAIN</span><span className="sep">◆</span>
              <span>FASTAPI</span><span className="sep">◆</span>
              <span>NEXT.JS</span><span className="sep">◆</span>
              <span>TERRAFORM</span><span className="sep">◆</span>
              {/* duplicate for seamless scroll */}
              <span>PYTHON</span><span className="sep">◆</span>
              <span>TYPESCRIPT</span><span className="sep">◆</span>
              <span>GO</span><span className="sep">◆</span>
              <span>RUST</span><span className="sep">◆</span>
              <span>POSTGRES</span><span className="sep">◆</span>
              <span>KUBERNETES</span><span className="sep">◆</span>
              <span>AWS</span><span className="sep">◆</span>
              <span>LLM AGENTS</span><span className="sep">◆</span>
              <span>LANGCHAIN</span><span className="sep">◆</span>
              <span>FASTAPI</span><span className="sep">◆</span>
              <span>NEXT.JS</span><span className="sep">◆</span>
              <span>TERRAFORM</span><span className="sep">◆</span>
            </div>
          </div>
        </section>


        {/* ============== SERVIÇOS ============== */}
        <section id="servicos" data-screen-label="02 Serviços">
          <header className="section-head">
            <div className="num">02</div>
            <div className="meta">
              <span className="sub">[SERVICES] — ENGINEERING SOLUTIONS</span>
              <h2>Serviços, em <em>retrofuturo</em></h2>
            </div>
          </header>

          <div className="services">

            <article className="svc svc--auto svc--big">
              <span className="stamp">AUTO-LOG-001</span>
              <span className="glyph">⌬</span>
              <h3>Automação Logística</h3>
              <p>Sistemas inteligentes para otimização de rotas, gestão de frotas e integração de APIs logísticas em tempo
                real.</p>
              <div className="mini">
                <svg viewBox="0 0 300 80" preserveAspectRatio="none">
                  <defs>
                    <pattern id="g1" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--border)" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="300" height="80" fill="url(#g1)" />
                  <polyline points="0,55 30,55 35,40 70,40 75,25 130,25 140,40 200,40 210,55 270,55 280,30 300,30"
                    fill="none" stroke="var(--accent)" strokeWidth="1.5" />
                  <circle cx="35" cy="40" r="3" fill="var(--accent)" />
                  <circle cx="140" cy="40" r="3" fill="var(--accent-2)" />
                  <circle cx="280" cy="30" r="3" fill="var(--accent-3)" />
                  <text x="6" y="14" fontFamily="IBM Plex Mono" fontSize="9" fill="var(--ink-3)">ROUTE_OPT.LIVE</text>
                </svg>
              </div>
              <div className="feats">
                <span className="feat">Otimização de rotas</span>
                <span className="feat">Gestão de frotas</span>
                <span className="feat">APIs integração</span>
                <span className="feat">Analytics tempo real</span>
              </div>
            </article>

            <article className="svc svc--ai svc--big">
              <span className="stamp">AI-AGENT-002</span>
              <span className="glyph">◉</span>
              <h3>Agentes de IA multicanal</h3>
              <p>Agentes inteligentes para comunicação automatizada via WhatsApp, Telegram e plataformas customizadas — com
                memória e contexto.</p>
              <div className="mini">
                <svg viewBox="0 0 300 80" preserveAspectRatio="none">
                  <defs>
                    <pattern id="g2" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--border)" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="300" height="80" fill="url(#g2)" />
                  <circle cx="150" cy="40" r="14" fill="none" stroke="var(--accent-2)" strokeWidth="1.5" />
                  <circle cx="150" cy="40" r="3" fill="var(--accent-2)" />
                  <g stroke="var(--accent-2)" strokeWidth="1" opacity="0.7" fill="none">
                    <line x1="150" y1="26" x2="60" y2="14" />
                    <line x1="150" y1="40" x2="40" y2="44" />
                    <line x1="150" y1="54" x2="60" y2="70" />
                    <line x1="150" y1="26" x2="240" y2="14" />
                    <line x1="150" y1="40" x2="260" y2="40" />
                    <line x1="150" y1="54" x2="240" y2="68" />
                  </g>
                  <g fill="var(--accent-3)">
                    <circle cx="60" cy="14" r="2.5" />
                    <circle cx="40" cy="44" r="2.5" />
                    <circle cx="60" cy="70" r="2.5" />
                    <circle cx="240" cy="14" r="2.5" />
                    <circle cx="260" cy="40" r="2.5" />
                    <circle cx="240" cy="68" r="2.5" />
                  </g>
                  <text x="6" y="14" fontFamily="IBM Plex Mono" fontSize="9" fill="var(--ink-3)">AGENT_MESH.NET</text>
                </svg>
              </div>
              <div className="feats">
                <span className="feat">Chatbots inteligentes</span>
                <span className="feat">NLP &amp; intents</span>
                <span className="feat">Integração multicanal</span>
                <span className="feat">Análise de sentimento</span>
              </div>
            </article>

            <article className="svc svc--saas">
              <span className="stamp">SAAS-DEV-003</span>
              <span className="glyph">▣</span>
              <h3>Desenvolvimento SaaS</h3>
              <p>Plataformas escaláveis com arquitetura moderna, microsserviços e alta disponibilidade.</p>
              <div className="feats">
                <span className="feat">Cloud-native</span>
                <span className="feat">Microsserviços</span>
                <span className="feat">APIs RESTful</span>
              </div>
            </article>

            <article className="svc svc--consult">
              <span className="stamp">CONSULT-004</span>
              <span className="glyph">✦</span>
              <h3>Consultoria em engenharia</h3>
              <p>Arquitetura de software, code review e otimização de sistemas com olhar de mestre engenheiro.</p>
              <div className="feats">
                <span className="feat">Arquitetura</span>
                <span className="feat">Code review</span>
                <span className="feat">Mentoria técnica</span>
              </div>
            </article>

            <article className="svc svc--stack">
              <span className="stamp">STACK-005</span>
              <span className="glyph">≡</span>
              <h3>Stack tecnológica</h3>
              <div className="chips">
                <span className="chip"><strong>Py</strong>thon</span>
                <span className="chip"><strong>TS</strong>/Node</span>
                <span className="chip"><strong>Go</strong>lang</span>
                <span className="chip"><strong>K8s</strong></span>
                <span className="chip"><strong>PG</strong>SQL</span>
                <span className="chip"><strong>LLM</strong>s</span>
              </div>
            </article>

          </div>
        </section>


        {/* ============== SOBRE ============== */}
        <section id="sobre" data-screen-label="03 Sobre">
          <header className="section-head">
            <div className="num">03</div>
            <div className="meta">
              <span className="sub">[ABOUT] — THE FUSION OF CLASSIC &amp; MODERN</span>
              <h2>Sobre o operador</h2>
            </div>
          </header>

          <div className="about-grid">
            <div className="about-text">
              <p>
                A <strong>Vintage DevStack</strong> nasce da fusão única entre a
                <span className="acc">engenharia clássica de precisão</span> e o desenvolvimento de
                software moderno. Inspirados pela elegante simplicidade da{" "}
                <span className="serif" style={{ fontStyle: 'italic' }}>Máquina de Turing</span>, aplicamos
                os mesmos princípios de excelência, durabilidade e atenção aos detalhes em cada
                linha de código.
              </p>

              <blockquote className="pull">
                Assim como um engenheiro mecânico desenha cada componente com precisão milimétrica,
                arquitetamos sistemas que não apenas funcionam, mas que são construídos para durar.
              </blockquote>

              <p>
                Nossa abordagem combina <span className="acc-2">precisão técnica</span> —
                cada decisão arquitetural fundamentada em princípios sólidos — com
                <span className="acc">inovação moderna</span> em IA, automação e cloud-native, e
                <span className="acc-2">qualidade atemporal</span> em soluções escaláveis.
              </p>

              <p style={{ color: 'var(--ink-3)', fontSize: '14px' }}>
                → Transformar complexidade técnica em soluções elegantes, onde cada componente
                é projetado com a mesma atenção que um mestre engenheiro dedicaria a uma obra-prima mecânica.
              </p>
            </div>

            <aside className="about-card">
              <div className="head">
                <div>
                  <div className="id">OP-FILE · #PD0011</div>
                  <div className="name">Marcos Padilha</div>
                  <div className="role">Cientista da Computação · CEO</div>
                </div>
                <div className="stamp">HERO</div>
              </div>
              <dl>
                <dt>Base</dt>
                <dd>Londrina, PR</dd>
                <dt>Foco</dt>
                <dd>IA &amp; engenharia</dd>
                <dt>Anos</dt>
                <dd>4+ em produção</dd>
                <dt>Calls</dt>
                <dd>EN · PT · ES</dd>
                <dt>Workana</dt>
                <dd>5.0★ · #11 BR</dd>
                <dt>Status</dt>
                <dd style={{ color: 'var(--accent-3)' }}>▮ aceitando projetos</dd>
              </dl>
            </aside>
          </div>

          <div className="stats">
            <div className="stat">
              <div className="v">38</div>
              <div className="l">Projetos entregues</div>
            </div>
            <div className="stat">
              <div className="v">5.0★</div>
              <div className="l">Avaliação Workana</div>
            </div>
            <div className="stat">
              <div className="v">#11</div>
              <div className="l">Ranking TI Brasil</div>
            </div>
            <div className="stat">
              <div className="v">HERO</div>
              <div className="l">Nível Workana</div>
            </div>
          </div>
        </section>


        {/* ============== CONTATO ============== */}
        <section id="contato" data-screen-label="04 Contato">
          <header className="section-head">
            <div className="num">04</div>
            <div className="meta">
              <span className="sub">[CONTACT] — TRANSMIT &amp; CONNECT</span>
              <h2>Vamos construir algo
                que dure?</h2>
            </div>
          </header>

          <div className="contact-grid">
            {/* left: channels + bio */}
            <div>
              <div className="card">
                <div className="stamp">[ CHANNELS / TRANSMISSORES ]</div>
                <div className="channels">
                  <a className="channel" href="https://wa.me/5543988713278" target="_blank" rel="noopener">
                    <span className="ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 21l1.5-5A9 9 0 1 1 8 19.5L3 21z" />
                      </svg>
                    </span>
                    <span>
                      <div className="l1">WhatsApp</div>
                      <div className="l2">resposta em 4h úteis</div>
                    </span>
                  </a>
                  <a className="channel" href="mailto:marcos.padilha@vintagedevstack.com.br">
                    <span className="ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="5" width="18" height="14" />
                        <path d="M3 7l9 7 9-7" />
                      </svg>
                    </span>
                    <span>
                      <div className="l1">Email</div>
                      <div className="l2">marcos.padilha@vintagedevstack.com.br</div>
                    </span>
                  </a>
                  <a className="channel" href="#" target="_blank" rel="noopener">
                    <span className="ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" />
                        <path d="M8 10v7M8 7v0M12 17v-5M16 17v-3a2 2 0 1 0-4 0" />
                      </svg>
                    </span>
                    <span>
                      <div className="l1">LinkedIn</div>
                      <div className="l2">/in/pikulitomarkin</div>
                    </span>
                  </a>
                  <a className="channel" href="#" target="_blank" rel="noopener">
                    <span className="ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path
                          d="M12 2a10 10 0 0 0-3 19.5V18c-3 .5-3.5-1.5-3.5-1.5-.5-1-1-1.5-1-1.5-1-.5 0-.5 0-.5 1 0 1.5 1 1.5 1 1 1.5 2.5 1 3 .5.5-.5.5-1 1-1.5-2.5-.5-5-1.5-5-5.5 0-1 .5-2 1-2.5 0-.5-.5-1.5 0-3 0 0 1 0 2.5 1.5 1-.5 2-.5 3-.5s2 0 3 .5C16 4 17 4 17 4c.5 1.5 0 2.5 0 3 .5.5 1 1.5 1 2.5 0 4-2.5 4.5-5 5 .5.5 1 1 1 2v3.5" />
                      </svg>
                    </span>
                    <span>
                      <div className="l1">GitHub</div>
                      <div className="l2">@pikulitomarkin</div>
                    </span>
                  </a>
                </div>
              </div>

              <div className="card" style={{ marginTop: '14px' }}>
                <div className="stamp">[ TERMINAL CMD ]</div>
                <p style={{ margin: '6px 0 12px', fontFamily: "'IBM Plex Mono',monospace", fontSize: '13px', color: 'var(--ink-2)' }}>
                  Operador veterano? Pressione <span className="t-label"
                    style={{ border: '1px solid var(--border)', padding: '1px 6px' }}>/</span>
                  ou digite na linha de comando abaixo:
                </p>
                <div
                  style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '13px', color: 'var(--ink)', background: 'var(--bg-3)', border: '1px dashed var(--border)', padding: '10px 14px' }}>
                  marcos@vintage:~$ <span style={{ color: 'var(--accent)' }}>contact</span><br />
                  marcos@vintage:~$ <span style={{ color: 'var(--accent-2)' }}>help</span><br />
                  marcos@vintage:~$ <span style={{ color: 'var(--accent-3)' }}>cv</span> <span
                    style={{ color: 'var(--ink-3)', fontSize: '11px' }}>// abre o portfolio</span>
                </div>
              </div>
            </div>

            {/* right: punch card briefing form */}
            <form className="punch" id="brief-form">
              <div className="punch-head">
                <span className="holes">
                  <span className="h on"></span><span className="h"></span><span className="h on"></span><span className="h on"></span><span
                    className="h"></span><span className="h on"></span><span className="h"></span><span className="h on"></span>
                </span>
                BRIEFING · IBM-029 PUNCH CARD
              </div>
              <div className="punch-body">
                <label>NOME / OPERADOR</label>
                <input type="text" name="name" required placeholder="seu nome completo" autoComplete="name" />

                <label>CANAL DE RESPOSTA</label>
                <input type="email" name="email" required placeholder="email@empresa.com" autoComplete="email" />

                <label>PROJETO / DESCRIÇÃO</label>
                <textarea name="brief" required placeholder="o que precisa ser construído? prazo? stack atual?"></textarea>

                <div className="punch-foot">
                  <span className="t-label">SLA: RESPOSTA EM 4H ÚTEIS</span>
                  <button className="btn primary" type="submit">↑ ENVIAR BRIEFING</button>
                </div>
              </div>
            </form>
          </div>

        </section>


        {/* ============== FOOTER ============== */}
        <footer className="foot">
          <div>
            [VINTAGE DEVSTACK] · ENGINEERING EXCELLENCE · LET'S BUILD SOMETHING AMAZING
          </div>
          <div className="ascii">
            ___ _ _ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___
            / __|| || | \/ __| | \ __|_ _/ __| _ \ _ \ __/ __|_ _/ __|
            \__ \| __ | |) \__ \ | |) _| | || (_ | / / _|\__ \| | (__
            |___/|_||_|___/|___/ |___/___|___\___|_|_\_|_\___|___/___\___|
          </div>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <span>© 2026 · VCA SYSTEMS</span>
            <span style={{ color: 'var(--ink-3)' }}>·</span>
            <a href="#" data-open-term className="glow-pulse"
              style={{ color: 'var(--accent-3)', fontSize: '10px', textDecoration: 'none' }}
              title="dica: abra o terminal e digite `cv`">
              &gt; psst… try <span style={{ color: 'var(--accent)' }}>cv</span> in terminal
            </a>
          </div>
        </footer>

      </main>


      {/* ============== TERMINAL (floating) ============== */}
      <aside className="term" id="terminal">
        <div className="term-bar" id="term-bar">
          <div className="l">
            <span className="blink-dot"></span>
            <span id="term-bar-label">TERMINAL · marcos@vintage</span>
            <span className="hint">— click or press <b>/</b> to open · ESC to close</span>
          </div>
          <div className="r" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button onClick={(e) => { e.stopPropagation(); togglePower(); }} style={{ background: 'transparent', color: crtPower ? 'var(--accent)' : 'var(--ink-2)', border: '1px solid', padding: '2px 8px', fontSize: '10px', cursor: 'pointer', fontFamily: 'inherit' }}>
              PWR {crtPower ? 'ON' : 'OFF'}
            </button>
            <button onClick={(e) => { e.stopPropagation(); setChannel(crtChannel === 2 ? 1 : 2); }} style={{ background: 'transparent', color: crtChannel === 2 ? 'var(--accent-2)' : 'var(--ink-2)', border: '1px solid', padding: '2px 8px', fontSize: '10px', cursor: 'pointer', fontFamily: 'inherit' }}>
              MARIO
            </button>
            <div className="chev" style={{ marginLeft: '6px' }}>▲</div>
          </div>
        </div>
        <div className="term-body" id="term-body">
          <div className="term-input-line">
            <span className="prompt">marcos@vintage:~$</span>
            <input className="term-input" id="term-input" autoComplete="off" spellCheck="false" />
          </div>
        </div>
      </aside>


      {/* ============== TWEAKS PANEL ============== */}
      <aside className="tweaks" id="tweaks-panel">
        <h4>Tweaks <span className="x" id="tweaks-close">✕</span></h4>
        <div className="row">
          <span className="lab">TEMA</span>
          <span className="seg">
            <button data-twk-theme="light">Neon</button>
            <button data-twk-theme="dark">Amber</button>
          </span>
        </div>
        <div className="row">
          <span className="lab">SOM</span>
          <span className="seg">
            <button data-twk-sound="off">Off</button>
            <button data-twk-sound="on">On</button>
          </span>
        </div>
        <div className="row" style={{ display: 'block', paddingTop: '8px' }}>
          <div className="t-label" style={{ marginBottom: '8px' }}>Atalhos</div>
          <div style={{ fontSize: '11px', color: 'var(--ink-2)', lineHeight: '1.7' }}>
            <kbd style={{ border: '1px solid var(--border)', padding: '1px 5px' }}>/</kbd> abrir terminal<br />
            <kbd style={{ border: '1px solid var(--border)', padding: '1px 5px' }}>ESC</kbd> fechar terminal<br />
            <kbd style={{ border: '1px solid var(--border)', padding: '1px 5px' }}>↑↑↓↓←→←→BA</kbd> ?
          </div>
        </div>
      </aside>



    </>
  );
}
