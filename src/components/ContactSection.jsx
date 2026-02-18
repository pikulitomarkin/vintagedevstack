import React from 'react'

// Ícones SVG no estilo da página (electric-blue / tech)
const IconWhatsApp = ({ className = 'w-8 h-8' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

const IconEmail = ({ className = 'w-8 h-8' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)

const IconLinkedIn = ({ className = 'w-7 h-7' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const IconGitHub = ({ className = 'w-7 h-7' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.22 0 4.61-2.805 5.625-5.466 5.92.43.372.823 1.102.823 2.222v3.293c0 .319.217.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
)

const IconWorkana = ({ className = 'w-7 h-7' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
)

const ContactSection = () => {
  const links = {
    whatsapp: 'https://wa.me/5543988713278',
    email: 'mailto:atendimento@vintagedevstack.com.br',
    linkedin: 'https://www.linkedin.com/in/marcos-r-padilha-26a224174',
    github: 'https://github.com/pikulitomarkin',
    workana: 'https://www.workana.com/freelancer/e48f27c354db6205fd9d799a8a9de98e',
  }

  return (
    <section id="contact" className="py-12 md:py-20 px-4 relative">
      <div className="max-w-5xl mx-auto">
        {/* Título da Seção */}
        <div className="patent-line mb-4 md:mb-6"></div>
        <h2 className="font-serif text-3xl md:text-6xl font-bold text-tech-white mb-3 md:mb-4">
          CONTATO
        </h2>
        <p className="font-mono text-electric-blue text-sm md:text-lg tracking-wider mb-6 md:mb-12">
          [CONTACT] PROJECT REQUEST & CURRICULUM
        </p>
        <div className="patent-line mb-6 md:mb-12"></div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          {/* Card principal: Nome, Formação, Função */}
          <div className="md:col-span-2 blueprint-border bg-navy-deep/30 p-6 md:p-8 flex flex-col justify-center transition-colors hover:border-electric-blue/60">
            <p className="font-mono text-[10px] md:text-xs text-electric-blue/60 uppercase tracking-wider mb-2">[PROFILE]</p>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-tech-white mb-2">
              Marcos Padilha
            </h3>
            <p className="font-mono text-sm text-electric-blue mb-1">
              Cientista da Computação
            </p>
            <p className="text-tech-white/80 text-sm md:text-base">
              CEO • Especialista em IA
            </p>
          </div>

          {/* Card WhatsApp */}
          <a
            href={links.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="blueprint-border bg-navy-deep/30 p-6 flex flex-col items-center justify-center gap-3 transition-all hover:border-accent-neon hover:bg-electric-blue/5 group"
            aria-label="WhatsApp"
          >
            <IconWhatsApp className="w-10 h-10 text-electric-blue group-hover:text-accent-neon transition-colors" />
            <span className="font-mono text-xs text-electric-blue/80 group-hover:text-accent-neon uppercase">WhatsApp</span>
          </a>

          {/* Card Email */}
          <a
            href={links.email}
            className="blueprint-border bg-navy-deep/30 p-6 flex flex-col items-center justify-center gap-3 transition-all hover:border-accent-neon hover:bg-electric-blue/5 group"
            aria-label="Email"
          >
            <IconEmail className="w-10 h-10 text-electric-blue group-hover:text-accent-neon transition-colors" />
            <span className="font-mono text-xs text-electric-blue/80 group-hover:text-accent-neon uppercase">Email</span>
          </a>

          {/* Card LinkedIn, GitHub, Workana */}
          <div className="md:col-span-2 blueprint-border bg-navy-deep/30 p-6 flex flex-col items-center justify-center">
            <p className="font-mono text-[10px] text-electric-blue/60 uppercase tracking-wider mb-4">[REDES]</p>
            <div className="flex items-center justify-center gap-6 md:gap-8">
              <a
                href={links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-electric-blue hover:text-accent-neon transition-colors p-2 rounded blueprint-border hover:border-accent-neon"
                aria-label="LinkedIn"
              >
                <IconLinkedIn />
              </a>
              <a
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-electric-blue hover:text-accent-neon transition-colors p-2 rounded blueprint-border hover:border-accent-neon"
                aria-label="GitHub"
              >
                <IconGitHub />
              </a>
              <a
                href={links.workana}
                target="_blank"
                rel="noopener noreferrer"
                className="text-electric-blue hover:text-accent-neon transition-colors p-2 rounded blueprint-border hover:border-accent-neon"
                aria-label="Workana"
              >
                <IconWorkana />
              </a>
            </div>
          </div>
        </div>

        {/* Card Resumo / Currículo → página HTML do portfólio */}
        <a
          href="/curriculo.html"
          className="mt-6 block blueprint-border bg-navy-deep/30 p-6 md:p-8 transition-all hover:border-accent-neon hover:bg-electric-blue/5 group"
        >
          <p className="font-mono text-[10px] md:text-xs text-electric-blue/60 uppercase tracking-wider mb-2">[CURRÍCULO]</p>
          <h3 className="font-serif text-xl md:text-2xl font-bold text-tech-white mb-2 group-hover:text-accent-neon transition-colors">
            Resumo profissional
          </h3>
          <p className="text-tech-white/70 text-sm">
            Formação, experiência, habilidades e projetos em destaque. Clique para ver o currículo completo.
          </p>
          <span className="inline-block mt-3 font-mono text-xs text-electric-blue group-hover:text-accent-neon transition-colors">
            Ver currículo →
          </span>
        </a>

        {/* Footer da Seção */}
        <div className="mt-12 text-center">
          <div className="patent-line mb-6"></div>
          <p className="font-mono text-sm text-electric-blue/40">
            [VINTAGE DEVSTACK] ENGINEERING EXCELLENCE - LET'S BUILD SOMETHING AMAZING
          </p>
          <div className="patent-line mt-6"></div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
