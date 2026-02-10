import React from 'react'

const ServicesSection = () => {
  const services = [
    {
      id: 1,
      title: 'Automação Logística',
      code: 'AUTO-LOG-001',
      description: 'Sistemas inteligentes para otimização de rotas, gestão de frotas e integração de APIs logísticas.',
      features: ['Otimização de Rotas', 'Gestão de Frotas', 'APIs de Integração', 'Analytics em Tempo Real']
    },
    {
      id: 2,
      title: 'Agentes de IA Multicanal',
      code: 'AI-AGENT-002',
      description: 'Agentes inteligentes para comunicação automatizada via WhatsApp, Telegram e outras plataformas.',
      features: ['Chatbots Inteligentes', 'Processamento de Linguagem Natural', 'Integração Multicanal', 'Análise de Sentimento']
    },
    {
      id: 3,
      title: 'Desenvolvimento SaaS',
      code: 'SAAS-DEV-003',
      description: 'Plataformas SaaS escaláveis com arquitetura moderna e alta disponibilidade.',
      features: ['Arquitetura Cloud-Native', 'Microserviços', 'APIs RESTful', 'Escalabilidade Automática']
    },
    {
      id: 4,
      title: 'Consultoria em Engenharia de Software',
      code: 'CONSULT-004',
      description: 'Consultoria especializada em arquitetura de software, code review e otimização de sistemas.',
      features: ['Arquitetura de Sistemas', 'Code Review', 'Otimização de Performance', 'Mentoria Técnica']
    }
  ]

  return (
    <section className="py-12 md:py-20 px-4 relative bg-navy-deep/30">
      {/* Título da Seção */}
      <div className="max-w-7xl mx-auto mb-8 md:mb-16">
        <div className="patent-line mb-4 md:mb-6"></div>
        <h2 className="font-serif text-3xl md:text-6xl font-bold text-tech-white mb-3 md:mb-4">
          SERVIÇOS
        </h2>
        <p className="font-mono text-electric-blue text-sm md:text-lg tracking-wider">
          [SERVICES] ENGINEERING SOLUTIONS
        </p>
        <div className="patent-line mt-4 md:mt-6"></div>
      </div>

      {/* Grid de Serviços */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {services.map((service) => (
          <div
            key={service.id}
            className="blueprint-border bg-navy-deep/50 p-4 md:p-8 hover:bg-navy-deep/70 transition-all duration-300 group relative"
          >
            {/* Código do Serviço */}
            <div className="absolute top-2 right-2 md:top-4 md:right-4">
              <span className="font-mono text-[10px] md:text-xs text-electric-blue/50">
                {service.code}
              </span>
            </div>

            {/* Título */}
            <h3 className="font-serif text-xl md:text-3xl font-bold text-electric-blue mb-2 md:mb-3 group-hover:text-accent-neon transition-colors pr-16 md:pr-20">
              {service.title}
            </h3>

            {/* Descrição */}
            <p className="text-tech-white/70 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
              {service.description}
            </p>

            {/* Features */}
            <div className="border-t border-electric-blue/20 pt-4 md:pt-6">
              <p className="font-mono text-[10px] md:text-xs text-electric-blue/60 mb-3 md:mb-4 uppercase tracking-wider">
                [FEATURES]
              </p>
              <ul className="space-y-1.5 md:space-y-2">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-center font-mono text-xs md:text-sm text-tech-white/80">
                    <span className="text-accent-neon mr-3">▶</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Linha decorativa */}
            <div className="mt-4 md:mt-6 h-px bg-gradient-to-r from-transparent via-electric-blue/30 to-transparent"></div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto mt-16 text-center">
        <div className="patent-line mb-8"></div>
        <a 
          href="#contact"
          className="blueprint-border inline-block px-8 py-4 hover:bg-electric-blue/10 transition-all cursor-pointer group"
        >
          <p className="font-mono text-electric-blue text-lg group-hover:text-accent-neon transition-colors">
            [CONTACT] INITIATE PROJECT REQUEST
          </p>
        </a>
        <div className="patent-line mt-8"></div>
      </div>
    </section>
  )
}

export default ServicesSection

