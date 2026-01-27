import React from 'react'

const PortfolioSection = () => {
  const projects = [
    {
      id: 1,
      name: 'Vintage DevStack',
      category: 'Site Institucional',
      description: 'Site institucional da Vintage DevStack com design blueprint industrial. Portfolio completo, seção de serviços e contato integrado. Deploy automatizado no Railway.',
      technologies: ['React', 'Vite', 'Tailwind CSS', 'Railway'],
      status: 'ACTIVE',
      githubUrl: 'https://github.com/pikulitomarkin/vintagedevstack'
    },
    {
      id: 2,
      name: 'AuraFiscal - Automação NFS-e',
      category: 'Automação Fiscal e Gov Tech',
      description: 'Sistema de automação de emissão de NFS-e através da API ADN oficial do Gov.br. Processamento em lote de até 50 documentos, geração de XML padrão SPED, compressão GZIP, assinatura digital A1 e integração com PostgreSQL.',
      technologies: ['Python', 'Streamlit', 'PostgreSQL', 'SQLAlchemy', 'API Gov.br', 'XML SPED', 'Certificado A1'],
      status: 'ACTIVE',
      githubUrl: 'https://github.com/pikulitomarkin/AuraFiscal-'
    },
    {
      id: 3,
      name: 'ClinicaPsi',
      category: 'SaaS - Gestão Clínica',
      description: 'Sistema completo de gestão para clínicas de psicologia desenvolvido em ASP.NET Core 9.0 com Blazor Server. Inclui agendamento inteligente, gamificação (PsicoPontos), notificações multi-canal e dashboard gerencial.',
      technologies: ['.NET 9.0', 'Blazor Server', 'EF Core', 'PostgreSQL', 'Docker', 'AWS'],
      status: 'ACTIVE',
      githubUrl: 'https://github.com/pikulitomarkin/sistema-p-clinica',
      liveUrl: 'https://www.psiianasantos.com.br'
    },
    {
      id: 4,
      name: 'Sistema Queimadas - Eletrobras',
      category: 'Mobile - Gestão Corporativa',
      description: 'Sistema mobile para registro de campanhas de prevenção de queimadas da Eletrobras. Inclui cadastro de entregas, captura fotográfica, assinatura digital, geração automática de PDFs e integração com OneDrive.',
      technologies: ['React Native', 'Firebase', 'Firestore', 'PDF Generation', 'OneDrive API'],
      status: 'ACTIVE'
    },
    {
      id: 5,
      name: 'Aparar - Gestão de Corte de Matos',
      category: 'Mobile & Web - Gestão de Campo',
      description: 'Sistema completo de gestão de corte de matos com app mobile React Native/Expo e painel web admin. Sincronização em tempo real via Firebase, modo offline, geolocalização e notificações push.',
      technologies: ['React Native', 'Expo', 'Firebase', 'Firestore', 'WebSocket', 'Geolocalização'],
      status: 'ACTIVE'
    },
    {
      id: 6,
      name: 'KM Web App - Linha de Transmissão',
      category: 'Web App - Infraestrutura',
      description: 'Sistema web PWA para consulta de torres e visualização de mapas de linhas de transmissão. Funciona offline, suporta múltiplas linhas, importação de arquivos GPX/Excel e interface otimizada para tablets.',
      technologies: ['PWA', 'Python', 'Flask', 'Railway', 'Mapas Interativos', 'GPX'],
      status: 'ACTIVE'
    },
    {
      id: 7,
      name: 'Agente IA WhatsApp',
      category: 'Automação e IA',
      description: 'Agente inteligente que integra Evolution API e OpenAI para responder mensagens do WhatsApp automaticamente conforme prompt personalizado. Deploy em Railway com suporte a variáveis de ambiente.',
      technologies: ['Python', 'OpenAI API', 'Evolution API', 'WhatsApp API', 'Railway'],
      status: 'ACTIVE'
    },
    {
      id: 8,
      name: 'Automações n8n',
      category: 'Integrações de IA e WhatsApp',
      description: 'Workflows automatizados com IA para comunicação multicanal e processamento inteligente. Integração de múltiplas plataformas e APIs para automação de processos empresariais.',
      technologies: ['n8n', 'OpenAI API', 'WhatsApp Business API', 'Python', 'Webhooks'],
      status: 'ACTIVE'
    },
    {
      id: 9,
      name: 'MinasTaxi - Automação Logística',
      category: 'Automação Logística e APIs',
      description: 'Plataforma de automação logística com integração de APIs para gestão de frotas, otimização de rotas e rastreamento em tempo real. Sistema completo para empresas de transporte.',
      technologies: ['Node.js', 'Python', 'REST APIs', 'PostgreSQL', 'Google Maps API'],
      status: 'ACTIVE'
    },
    {
      id: 10,
      name: 'AstraFuture - Dashboard Empresarial',
      category: 'Gestão e Arquitetura',
      description: 'Sistema de gestão e arquitetura empresarial com foco em escalabilidade e performance. Dashboard completo para monitoramento de KPIs e análise de dados em tempo real.',
      technologies: ['C#', '.NET', 'SQL Server', 'Azure', 'Power BI'],
      status: 'ACTIVE'
    }
    ,
    {
      id: 11,
      name: 'Sistema de Gestão de RH - Enterprise Edition',
      category: 'SaaS - Gestão de RH',
      description: 'Sistema completo de gestão de recursos humanos com backend em ASP.NET Core e frontend em React (Vite). Inclui folha de pagamento quinzenal, controle de frequência, dashboards, RBAC e cálculos CLT brasileiros.',
      technologies: ['ASP.NET Core', 'Entity Framework', 'React', 'Vite', 'Tailwind CSS', 'Zustand', 'TanStack Query', 'Recharts', 'SQLite'],
      status: 'ACTIVE',
      githubUrl: 'https://github.com/pikulitomarkin/sistemagestaorh'
    }
    ,
    {
      id: 12,
      name: 'CRM SeguroJá - CRM WhatsApp com IA',
      category: 'Automação & CRM',
      description: 'Sistema de qualificação automática de leads via WhatsApp com backend em FastAPI, dashboard em Streamlit e integração com modelos Claude (Anthropic) e Evolution API para envio/recebimento. Focado em automação de atendimento, qualificação e notificações.',
      technologies: ['FastAPI', 'Python', 'Streamlit', 'Anthropic Claude', 'Evolution API', 'SQLite', 'PostgreSQL'],
      status: 'ACTIVE',
      githubUrl: 'https://github.com/pikulitomarkin/crmseguroja'
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

            {/* Links do Projeto */}
            {(project.githubUrl || project.liveUrl) && (
              <div className="mt-4 pt-4 border-t border-electric-blue/20 flex gap-3">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="blueprint-border px-3 py-1 text-xs font-mono text-electric-blue hover:text-accent-neon transition-colors flex items-center gap-1"
                  >
                    <span>GitHub</span>
                    <span>→</span>
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="blueprint-border px-3 py-1 text-xs font-mono text-accent-neon hover:text-electric-blue transition-colors flex items-center gap-1"
                  >
                    <span>Live Demo</span>
                    <span>→</span>
                  </a>
                )}
              </div>
            )}

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

