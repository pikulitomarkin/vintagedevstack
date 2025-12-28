import React from 'react'

const PortfolioSection = () => {
  const projects = [
    {
      id: 1,
      name: 'AstraFuture',
      category: 'Gestão e Arquitetura',
      description: 'Sistema de gestão e arquitetura empresarial com foco em escalabilidade e performance.',
      technologies: ['C#', '.NET', 'SQL Server', 'Azure'],
      status: 'ACTIVE'
    },
    {
      id: 2,
      name: 'MinasTaxi',
      category: 'Automação Logística e APIs',
      description: 'Plataforma de automação logística com integração de APIs para gestão de frotas e rotas.',
      technologies: ['Node.js', 'Python', 'REST APIs', 'PostgreSQL'],
      status: 'ACTIVE'
    },
    {
      id: 3,
      name: 'Automações n8n',
      category: 'Integrações de IA e WhatsApp',
      description: 'Workflows automatizados com IA para comunicação multicanal e processamento inteligente.',
      technologies: ['n8n', 'OpenAI API', 'WhatsApp Business API', 'Python'],
      status: 'ACTIVE'
    },
    {
      id: 4,
      name: 'Aparar',
      category: 'Mobile & Web - Gestão de Campo',
      description: 'Sistema completo de gestão de corte de matos com app mobile React Native/Expo e painel web admin. Sincronização em tempo real via Firebase, modo offline, geolocalização e notificações push.',
      technologies: ['React Native', 'Expo', 'Firebase', 'Firestore', 'WebSocket', 'Geolocalização', 'Push Notifications'],
      status: 'ACTIVE'
    },
    {
      id: 5,
      name: 'Agente IA WhatsApp',
      category: 'Automação e IA',
      description: 'Agente inteligente que integra Evolution API e OpenAI para responder mensagens do WhatsApp automaticamente conforme prompt personalizado. Deploy em Railway com suporte a variáveis de ambiente.',
      technologies: ['Python', 'OpenAI API', 'Evolution API', 'WhatsApp API', 'Railway', 'python-dotenv'],
      status: 'ACTIVE'
    },
    {
      id: 6,
      name: 'ClinicaPsi',
      category: 'SaaS - Gestão Clínica',
      description: 'Sistema completo de gestão para clínicas de psicologia desenvolvido em ASP.NET Core 9.0 com Blazor Server. Inclui agendamento inteligente, gamificação (PsicoPontos), notificações multi-canal e dashboard gerencial. Em produção: www.psiianasantos.com.br',
      technologies: ['.NET 9.0', 'Blazor Server', 'EF Core', 'PostgreSQL', 'Docker', 'AWS'],
      status: 'ACTIVE'
    },
    {
      id: 7,
      name: 'KM Web App',
      category: 'Web App - Infraestrutura',
      description: 'Sistema web PWA para consulta de torres e visualização de mapas de linhas de transmissão. Funciona offline, suporta múltiplas linhas, importação de arquivos GPX/Excel e interface otimizada para tablets. Consulta por KM a partir de subestações com mapa interativo.',
      technologies: ['PWA', 'Web App', 'Mapas Interativos', 'GPX', 'Excel', 'Offline First'],
      status: 'ACTIVE'
    },
    {
      id: 8,
      name: 'Sistema Queimadas - Eletrobras',
      category: 'Mobile - Gestão Corporativa',
      description: 'Sistema mobile para registro de campanhas de prevenção de queimadas da Eletrobras. Inclui cadastro de entregas, captura fotográfica, assinatura digital, geração automática de PDFs e integração com OneDrive. Sincronização Firebase em tempo real com modo offline como fallback.',
      technologies: ['React Native', 'Firebase', 'Firestore', 'Firebase Storage', 'PDF Generation', 'OneDrive API', 'AsyncStorage'],
      status: 'ACTIVE'
    },
    {
      id: 9,
      name: 'Curso C# Hotmart',
      category: 'Capacidade Educacional',
      description: 'Plataforma educacional completa para ensino de C# e desenvolvimento .NET.',
      technologies: ['C#', 'Video Streaming', 'Hotmart API', 'LMS'],
      status: 'ACTIVE'
    }
  ]

  return (
    <section className="py-20 px-4 relative">
      {/* Título da Seção */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="patent-line mb-6"></div>
        <h2 className="font-serif text-5xl md:text-6xl font-bold text-tech-white mb-4">
          PORTFOLIO
        </h2>
        <p className="font-mono text-electric-blue text-lg tracking-wider">
          [PROJECTS] ENGINEERING EXCELLENCE
        </p>
        <div className="patent-line mt-6"></div>
      </div>

      {/* Grid de Projetos */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="blueprint-border bg-navy-deep/50 p-6 hover:bg-navy-deep/70 transition-all duration-300 group"
          >
            {/* Header do Card */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-electric-blue mb-2 group-hover:text-accent-neon transition-colors">
                  {project.name}
                </h3>
                <p className="font-mono text-xs text-electric-blue/60 uppercase tracking-wider">
                  {project.category}
                </p>
              </div>
              <div className="blueprint-border px-2 py-1">
                <span className="font-mono text-xs text-accent-neon">
                  [{project.status}]
                </span>
              </div>
            </div>

            {/* Descrição */}
            <p className="text-tech-white/70 mb-6 text-sm leading-relaxed">
              {project.description}
            </p>

            {/* Tecnologias */}
            <div className="border-t border-electric-blue/20 pt-4">
              <p className="font-mono text-xs text-electric-blue/60 mb-3 uppercase">
                [TECH STACK]
              </p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="blueprint-border px-3 py-1 text-xs font-mono text-electric-blue hover:text-accent-neon transition-colors cursor-default"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Linha decorativa inferior */}
            <div className="mt-4 h-px bg-gradient-to-r from-transparent via-electric-blue/30 to-transparent"></div>
          </div>
        ))}
      </div>

      {/* Annotations técnicas */}
      <div className="max-w-7xl mx-auto mt-12 text-center">
        <div className="patent-line"></div>
        <p className="font-mono text-sm text-electric-blue/40 mt-4">
          [TOTAL PROJECTS] {projects.length} | [SUCCESS RATE] 100% | [STATUS] ALL OPERATIONAL
        </p>
      </div>
    </section>
  )
}

export default PortfolioSection

