import React from 'react'

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 px-4 relative">
      <div className="max-w-5xl mx-auto">
        {/* Título da Seção */}
        <div className="patent-line mb-6"></div>
        <h2 className="font-serif text-5xl md:text-6xl font-bold text-tech-white mb-4">
          CONTATO
        </h2>
        <p className="font-mono text-electric-blue text-lg tracking-wider mb-12">
          [CONTACT] PROJECT REQUEST & CURRICULUM
        </p>
        <div className="patent-line mb-12"></div>

        {/* Foto de Perfil */}
        <div className="flex justify-center mb-12">
          <div className="relative">
            <div className="blueprint-border rounded-full p-2 group hover:border-accent-neon transition-all">
              <img 
                src="/profile-photo.jpg" 
                alt="Marcos Padilha" 
                className="w-48 h-48 rounded-full object-cover border-2 border-electric-blue/30 group-hover:border-accent-neon transition-all shadow-lg"
                style={{ 
                  width: '192px', 
                  height: '192px',
                  objectFit: 'cover',
                  borderRadius: '50%'
                }}
                onError={(e) => {
                  // Tenta outros formatos se o JPG não existir
                  const formats = ['png', 'jpeg', 'webp'];
                  const currentSrc = e.target.src;
                  const basePath = currentSrc.substring(0, currentSrc.lastIndexOf('.'));
                  const currentFormat = currentSrc.split('.').pop();
                  
                  if (formats.includes(currentFormat)) {
                    e.target.style.display = 'none';
                  } else {
                    e.target.src = basePath + '.png';
                  }
                }}
              />
            </div>
            {/* Efeito de glow sutil */}
            <div className="absolute inset-0 rounded-full bg-electric-blue/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
          </div>
        </div>

        {/* Container Principal */}
        <div className="blueprint-border bg-navy-deep/30 p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Informações de Contato */}
            <div>
              <h3 className="font-serif text-3xl font-bold text-electric-blue mb-6">
                INFORMAÇÕES DE CONTATO
              </h3>
              
              <div className="space-y-6">
                <div className="border-l-2 border-electric-blue/50 pl-4">
                  <p className="font-mono text-xs text-electric-blue/60 mb-2 uppercase">[EMAIL]</p>
                  <a 
                    href="mailto:mpadilha932@gmail.com" 
                    className="text-tech-white hover:text-accent-neon transition-colors font-mono"
                  >
                    mpadilha932@gmail.com
                  </a>
                </div>

                <div className="border-l-2 border-electric-blue/50 pl-4">
                  <p className="font-mono text-xs text-electric-blue/60 mb-2 uppercase">[PHONE]</p>
                  <a 
                    href="tel:+5543988713278" 
                    className="text-tech-white hover:text-accent-neon transition-colors font-mono"
                  >
                    +55 (43) 98871-3278
                  </a>
                </div>

                <div className="border-l-2 border-electric-blue/50 pl-4">
                  <p className="font-mono text-xs text-electric-blue/60 mb-2 uppercase">[LINKEDIN]</p>
                  <a 
                    href="https://www.linkedin.com/in/marcos-r-padilha-26a224174/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-tech-white hover:text-accent-neon transition-colors font-mono"
                  >
                    https://www.linkedin.com/in/marcos-r-padilha-26a224174/
                  </a>
                </div>

                <div className="border-l-2 border-electric-blue/50 pl-4">
                  <p className="font-mono text-xs text-electric-blue/60 mb-2 uppercase">[GITHUB]</p>
                  <a 
                    href="https://github.com/pikulitomarkin" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-tech-white hover:text-accent-neon transition-colors font-mono"
                  >
                    github.com/pikulitomarkin
                  </a>
                </div>

                <div className="border-l-2 border-electric-blue/50 pl-4">
                  <p className="font-mono text-xs text-electric-blue/60 mb-2 uppercase">[WHATSAPP]</p>
                  <a 
                    href="https://wa.me/5543988713278" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-tech-white hover:text-accent-neon transition-colors font-mono"
                  >
                    WhatsApp Business
                  </a>
                </div>
              </div>
            </div>

            {/* Currículo Resumido */}
            <div>
              <h3 className="font-serif text-3xl font-bold text-electric-blue mb-6">
                CURRÍCULO
              </h3>
              
              <div className="space-y-6">
                <div>
                  <p className="font-mono text-xs text-electric-blue/60 mb-3 uppercase">[ABOUT]</p>
                  <p className="text-tech-white/80 leading-relaxed text-sm">
                    Desenvolvedor apaixonado por criar soluções inovadoras e impactantes. Experiência em 
                    desenvolvimento full-stack, sempre buscando aprender novas tecnologias para resolver 
                    problemas complexos de forma elegante.
                  </p>
                  <p className="text-tech-white/60 text-xs font-mono mt-2 italic">
                    "Código limpo é poesia em movimento"
                  </p>
                </div>

                <div>
                  <p className="font-mono text-xs text-electric-blue/60 mb-3 uppercase">[KEY SKILLS]</p>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'Node.js', 'Python', 'C#', '.NET', 'Firebase', 'PostgreSQL', 'MongoDB', 'Flask', 'Railway', 'AWS', 'Docker', 'n8n', 'OpenAI API', 'React Native'].map((skill, index) => (
                      <span
                        key={index}
                        className="blueprint-border px-3 py-1 text-xs font-mono text-electric-blue hover:text-accent-neon transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-mono text-xs text-electric-blue/60 mb-3 uppercase">[EXPERIENCE]</p>
                  <div className="space-y-4">
                    <div className="border-l-2 border-accent-neon/50 pl-4">
                      <p className="font-mono text-sm text-electric-blue font-bold">ELETROBRAS</p>
                      <p className="text-tech-white/70 text-sm">Projetos de Inovação - Linhas de Transmissão</p>
                      <p className="text-tech-white/60 text-xs mt-1">Sistemas para monitoramento, inspeção e campanhas de prevenção de queimadas</p>
                    </div>
                    <div className="border-l-2 border-accent-neon/50 pl-4">
                      <p className="font-mono text-sm text-electric-blue font-bold">PSI. ANA SANTOS</p>
                      <p className="text-tech-white/70 text-sm">Sistema de Gestão para Clínicas Psicológicas</p>
                      <p className="text-tech-white/60 text-xs mt-1">Gestão de atendimentos e agendamento online</p>
                    </div>
                    <div className="border-l-2 border-accent-neon/50 pl-4">
                      <p className="font-mono text-sm text-electric-blue font-bold">VOXX ENGENHARIA</p>
                      <p className="text-tech-white/70 text-sm">Dashboard de Monitoramento de Obras</p>
                      <p className="text-tech-white/60 text-xs mt-1">Relatórios técnicos e integração de dados em tempo real</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-mono text-xs text-electric-blue/60 mb-3 uppercase">[FEATURED PROJECTS]</p>
                  <div className="space-y-3">
                    <div className="border-l-2 border-electric-blue/50 pl-3">
                      <p className="font-mono text-xs text-electric-blue font-bold">CORTE E PODA</p>
                      <p className="text-tech-white/60 text-xs">React • Firebase • REST API</p>
                    </div>
                    <div className="border-l-2 border-electric-blue/50 pl-3">
                      <p className="font-mono text-xs text-electric-blue font-bold">ONDE A LINHA DESLIGOU</p>
                      <p className="text-tech-white/60 text-xs">Python • Flask • Railway</p>
                    </div>
                    <div className="border-l-2 border-electric-blue/50 pl-3">
                      <p className="font-mono text-xs text-electric-blue font-bold">QUEIMADAS-NÃO</p>
                      <p className="text-tech-white/60 text-xs">React Native • Firebase • PDF Generator</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-mono text-xs text-electric-blue/60 mb-3 uppercase">[GOALS 2025]</p>
                  <div className="space-y-2">
                    <p className="text-tech-white/70 text-xs flex items-center">
                      <span className="text-accent-neon mr-2">▶</span>
                      Dominar TypeScript & Next.js
                    </p>
                    <p className="text-tech-white/70 text-xs flex items-center">
                      <span className="text-accent-neon mr-2">▶</span>
                      Desenvolver projeto com IA/ML
                    </p>
                    <p className="text-tech-white/70 text-xs flex items-center">
                      <span className="text-accent-neon mr-2">▶</span>
                      Mentorear desenvolvedores iniciantes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12 pt-8 border-t border-electric-blue/20">
            <div className="text-center">
              <p className="font-mono text-sm text-electric-blue/60 mb-4">
                [READY TO START YOUR PROJECT]
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="mailto:mpadilha932@gmail.com"
                  className="blueprint-border px-6 py-3 hover:bg-electric-blue/10 transition-all group"
                >
                  <span className="font-mono text-electric-blue group-hover:text-accent-neon transition-colors">
                    [SEND EMAIL]
                  </span>
                </a>
                <a
                  href="https://wa.me/5543988713278"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="blueprint-border px-6 py-3 hover:bg-electric-blue/10 transition-all group"
                >
                  <span className="font-mono text-electric-blue group-hover:text-accent-neon transition-colors">
                    [WHATSAPP]
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

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

