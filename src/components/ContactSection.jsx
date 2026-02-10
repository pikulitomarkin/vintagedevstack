import React from 'react'

const ContactSection = () => {
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

        {/* Foto de Perfil */}
        <div className="flex justify-center mb-6 md:mb-12">
          <div className="relative">
            <div className="blueprint-border rounded-full p-1.5 md:p-2 group hover:border-accent-neon transition-all">
              <img 
                src="/profile-photo.jpg" 
                alt="Marcos Padilha" 
                className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-2 border-electric-blue/30 group-hover:border-accent-neon transition-all shadow-lg"
                style={{ 
                  width: 'auto', 
                  height: 'auto',
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
        <div className="blueprint-border bg-navy-deep/30 p-4 md:p-8 lg:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
            {/* Informações de Contato */}
            <div>
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-electric-blue mb-4 md:mb-6">
                INFORMAÇÕES DE CONTATO
              </h3>
              
              <div className="space-y-4 md:space-y-6">
                <div className="mb-3 md:mb-4">
                  <p className="font-serif text-xl md:text-2xl font-bold text-tech-white">Marcos Padilha</p>
                  <p className="text-tech-white/70 text-xs md:text-sm italic">CEO • Cientista da Computação • Especialista em IA</p>
                </div>
                <div className="border-l-2 border-electric-blue/50 pl-3 md:pl-4">
                  <p className="font-mono text-[10px] md:text-xs text-electric-blue/60 mb-1 md:mb-2 uppercase">[EMAIL]</p>
                  <a 
                    href="mailto:mpadilha932@gmail.com" 
                    className="text-tech-white hover:text-accent-neon transition-colors font-mono text-xs md:text-base break-all"
                  >
                    mpadilha932@gmail.com
                  </a>
                </div>

                <div className="border-l-2 border-electric-blue/50 pl-3 md:pl-4">
                  <p className="font-mono text-[10px] md:text-xs text-electric-blue/60 mb-1 md:mb-2 uppercase">[PHONE]</p>
                  <a 
                    href="tel:+5543988713278" 
                    className="text-tech-white hover:text-accent-neon transition-colors font-mono text-xs md:text-base"
                  >
                    +55 (43) 98871-3278
                  </a>
                </div>

                <div className="border-l-2 border-electric-blue/50 pl-3 md:pl-4">
                  <p className="font-mono text-[10px] md:text-xs text-electric-blue/60 mb-1 md:mb-2 uppercase">[LINKEDIN]</p>
                  <a 
                    href="https://www.linkedin.com/in/marcos-r-padilha-26a224174/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-tech-white hover:text-accent-neon transition-colors font-mono text-xs md:text-base break-all"
                  >
                    https://www.linkedin.com/in/marcos-r-padilha-26a224174/
                  </a>
                </div>

                <div className="border-l-2 border-electric-blue/50 pl-3 md:pl-4">
                  <p className="font-mono text-[10px] md:text-xs text-electric-blue/60 mb-1 md:mb-2 uppercase">[GITHUB]</p>
                  <a 
                    href="https://github.com/pikulitomarkin" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-tech-white hover:text-accent-neon transition-colors font-mono text-xs md:text-base break-all"
                  >
                    github.com/pikulitomarkin
                  </a>
                </div>

                <div className="border-l-2 border-electric-blue/50 pl-3 md:pl-4">
                  <p className="font-mono text-[10px] md:text-xs text-electric-blue/60 mb-1 md:mb-2 uppercase">[WHATSAPP]</p>
                  <a 
                    href="https://wa.me/5543988713278" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-tech-white hover:text-accent-neon transition-colors font-mono text-xs md:text-base"
                  >
                    WhatsApp Business
                  </a>
                </div>
              </div>
            </div>

            {/* Currículo Resumido */}
            <div>
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-electric-blue mb-4 md:mb-6">
                CURRÍCULO
              </h3>
              
              <div className="space-y-4 md:space-y-6">
                <div>
                  <p className="font-mono text-[10px] md:text-xs text-electric-blue/60 mb-2 md:mb-3 uppercase">[ABOUT]</p>
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
                  <p className="font-mono text-[10px] md:text-xs text-electric-blue/60 mb-2 md:mb-3 uppercase">[KEY SKILLS]</p>
                  <div className="flex flex-wrap gap-1.5 md:gap-2">
                    {['React', 'Node.js', 'Python', 'C#', '.NET', 'Firebase', 'PostgreSQL', 'MongoDB', 'Flask', 'Railway', 'AWS', 'Docker', 'n8n', 'OpenAI API', 'React Native'].map((skill, index) => (
                      <span
                        key={index}
                        className="blueprint-border px-2 py-0.5 md:px-3 md:py-1 text-[10px] md:text-xs font-mono text-electric-blue hover:text-accent-neon transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-mono text-[10px] md:text-xs text-electric-blue/60 mb-2 md:mb-3 uppercase">[EXPERIENCE]</p>
                  <div className="space-y-3 md:space-y-4">
                    <div className="border-l-2 border-accent-neon/50 pl-3 md:pl-4">
                      <p className="font-mono text-xs md:text-sm text-electric-blue font-bold">ELETROBRAS</p>
                      <p className="text-tech-white/70 text-xs md:text-sm">Projetos de Inovação - Linhas de Transmissão</p>
                      <p className="text-tech-white/60 text-[10px] md:text-xs mt-1">Sistemas para monitoramento, inspeção e campanhas de prevenção de queimadas</p>
                    </div>
                    <div className="border-l-2 border-accent-neon/50 pl-3 md:pl-4">
                      <p className="font-mono text-xs md:text-sm text-electric-blue font-bold">PSI. ANA SANTOS</p>
                      <p className="text-tech-white/70 text-xs md:text-sm">Sistema de Gestão para Clínicas Psicológicas</p>
                      <p className="text-tech-white/60 text-[10px] md:text-xs mt-1">Gestão de atendimentos e agendamento online</p>
                    </div>
                    <div className="border-l-2 border-accent-neon/50 pl-3 md:pl-4">
                      <p className="font-mono text-xs md:text-sm text-electric-blue font-bold">VOXX ENGENHARIA</p>
                      <p className="text-tech-white/70 text-xs md:text-sm">Dashboard de Monitoramento de Obras</p>
                      <p className="text-tech-white/60 text-[10px] md:text-xs mt-1">Relatórios técnicos e integração de dados em tempo real</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-mono text-[10px] md:text-xs text-electric-blue/60 mb-2 md:mb-3 uppercase">[FEATURED PROJECTS]</p>
                  <div className="space-y-2 md:space-y-3">
                    <div className="border-l-2 border-electric-blue/50 pl-2 md:pl-3">
                      <p className="font-mono text-[10px] md:text-xs text-electric-blue font-bold">CORTE E PODA</p>
                      <p className="text-tech-white/60 text-[9px] md:text-xs">React • Firebase • REST API</p>
                    </div>
                    <div className="border-l-2 border-electric-blue/50 pl-2 md:pl-3">
                      <p className="font-mono text-[10px] md:text-xs text-electric-blue font-bold">ONDE A LINHA DESLIGOU</p>
                      <p className="text-tech-white/60 text-[9px] md:text-xs">Python • Flask • Railway</p>
                    </div>
                    <div className="border-l-2 border-electric-blue/50 pl-2 md:pl-3">
                      <p className="font-mono text-[10px] md:text-xs text-electric-blue font-bold">QUEIMADAS-NÃO</p>
                      <p className="text-tech-white/60 text-[9px] md:text-xs">React Native • Firebase • PDF Generator</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-mono text-[10px] md:text-xs text-electric-blue/60 mb-2 md:mb-3 uppercase">[GOALS 2025]</p>
                  <div className="space-y-1.5 md:space-y-2">
                    <p className="text-tech-white/70 text-[10px] md:text-xs flex items-center">
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

