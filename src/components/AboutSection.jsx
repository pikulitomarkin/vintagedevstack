import React from 'react'

const AboutSection = () => {
  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-5xl mx-auto">
        {/* Título da Seção */}
        <div className="patent-line mb-6"></div>
        <h2 className="font-serif text-5xl md:text-6xl font-bold text-tech-white mb-4">
          SOBRE
        </h2>
        <p className="font-mono text-electric-blue text-lg tracking-wider mb-12">
          [ABOUT] THE FUSION OF CLASSIC & MODERN
        </p>
        <div className="patent-line mb-12"></div>

        {/* Conteúdo Principal */}
        <div className="blueprint-border bg-navy-deep/30 p-8 md:p-12">
          <div className="space-y-6 text-tech-white/90 leading-relaxed">
            <p className="text-lg">
              A <span className="text-electric-blue font-bold">Vintage DevStack</span> nasce da fusão única entre a 
              <span className="text-accent-neon"> engenharia clássica de precisão</span> e o desenvolvimento de software moderno.
            </p>

            <p>
              Inspirados pela robustez e elegância de máquinas clássicas como o <span className="font-mono text-electric-blue">Passat 87</span>, 
              aplicamos os mesmos princípios de excelência, durabilidade e atenção aos detalhes em cada linha de código que escrevemos.
            </p>

            <div className="border-l-2 border-electric-blue/50 pl-6 my-8">
              <p className="font-mono text-sm text-electric-blue/60 mb-2">[PHILOSOPHY]</p>
              <p className="italic">
                "Assim como um engenheiro mecânico desenha cada componente com precisão milimétrica, 
                nós arquitetamos sistemas que não apenas funcionam, mas que são construídos para durar."
              </p>
            </div>

            <p>
              Nossa abordagem combina:
            </p>

            <ul className="space-y-3 ml-6">
              <li className="flex items-start">
                <span className="text-accent-neon mr-3 font-mono">→</span>
                <span>
                  <strong className="text-electric-blue">Precisão Técnica:</strong> Cada decisão arquitetural é 
                  fundamentada em princípios sólidos de engenharia de software.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-accent-neon mr-3 font-mono">→</span>
                <span>
                  <strong className="text-electric-blue">Inovação Moderna:</strong> Utilizamos as tecnologias mais 
                  avançadas em IA, automação e desenvolvimento cloud-native.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-accent-neon mr-3 font-mono">→</span>
                <span>
                  <strong className="text-electric-blue">Qualidade Atemporal:</strong> Construímos sistemas que 
                  transcendem tendências, focando em soluções duradouras e escaláveis.
                </span>
              </li>
            </ul>

            <div className="mt-8 pt-8 border-t border-electric-blue/20">
              <p className="font-mono text-sm text-electric-blue/60 mb-2">[MISSION]</p>
              <p className="text-lg">
                Transformar complexidade técnica em <span className="text-accent-neon">soluções elegantes</span>, 
                onde cada componente é projetado com a mesma atenção que um mestre engenheiro dedicaria a uma obra-prima mecânica.
              </p>
            </div>
          </div>
        </div>

        {/* Especificações Técnicas */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="blueprint-border p-4 text-center">
            <p className="font-mono text-2xl font-bold text-electric-blue mb-1">5+</p>
            <p className="font-mono text-xs text-tech-white/60 uppercase">Projetos Ativos</p>
          </div>
          <div className="blueprint-border p-4 text-center">
            <p className="font-mono text-2xl font-bold text-electric-blue mb-1">100%</p>
            <p className="font-mono text-xs text-tech-white/60 uppercase">Taxa de Sucesso</p>
          </div>
          <div className="blueprint-border p-4 text-center">
            <p className="font-mono text-2xl font-bold text-electric-blue mb-1">24/7</p>
            <p className="font-mono text-xs text-tech-white/60 uppercase">Disponibilidade</p>
          </div>
          <div className="blueprint-border p-4 text-center">
            <p className="font-mono text-2xl font-bold text-electric-blue mb-1">∞</p>
            <p className="font-mono text-xs text-tech-white/60 uppercase">Inovação</p>
          </div>
        </div>

        {/* Footer da Seção */}
        <div className="mt-12 text-center">
          <div className="patent-line mb-6"></div>
          <p className="font-mono text-sm text-electric-blue/40">
            [VINTAGE DEVSTACK] ENGINEERING EXCELLENCE SINCE 2024
          </p>
          <div className="patent-line mt-6"></div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection

