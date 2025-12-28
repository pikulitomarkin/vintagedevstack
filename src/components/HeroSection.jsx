import React from 'react'

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `
          linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }}></div>
      
      {/* Válvula Termiônica Digital */}
      <div className="absolute top-20 right-20 w-32 h-32 opacity-30">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="80" fill="none" stroke="#00D4FF" strokeWidth="2" opacity="0.5"/>
          <circle cx="100" cy="100" r="50" fill="none" stroke="#00D4FF" strokeWidth="1.5" opacity="0.3"/>
          <line x1="100" y1="20" x2="100" y2="50" stroke="#00D4FF" strokeWidth="2"/>
          <line x1="100" y1="150" x2="100" y2="180" stroke="#00D4FF" strokeWidth="2"/>
          <line x1="20" y1="100" x2="50" y2="100" stroke="#00D4FF" strokeWidth="2"/>
          <line x1="150" y1="100" x2="180" y2="100" stroke="#00D4FF" strokeWidth="2"/>
          <circle cx="100" cy="100" r="8" fill="#00D4FF" className="animate-pulse"/>
          <text x="100" y="195" textAnchor="middle" fill="#00D4FF" fontSize="12" fontFamily="monospace">VACUUM TUBE</text>
        </svg>
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Título Principal */}
        <h1 className="font-serif text-7xl md:text-9xl font-bold mb-6 blueprint-glow">
          <span className="block">VINTAGE</span>
          <span className="block text-electric-blue">DEVSTACK</span>
        </h1>
        
        {/* Subtítulo */}
        <div className="patent-line my-8"></div>
        <p className="font-mono text-xl md:text-2xl text-electric-blue mb-4 tracking-wider">
          ENGENHARIA DE SOFTWARE DE PRECISÃO
        </p>
        <p className="font-mono text-lg md:text-xl text-tech-white/80 mb-8">
          & AUTOMAÇÃO DE IA
        </p>
        <div className="patent-line my-8"></div>

        {/* Annotations técnicas */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm font-mono text-electric-blue/60">
          <div className="blueprint-border px-4 py-2">
            <span className="text-accent-neon">[SYSTEM]</span> READY
          </div>
          <div className="blueprint-border px-4 py-2">
            <span className="text-accent-neon">[STATUS]</span> OPERATIONAL
          </div>
          <div className="blueprint-border px-4 py-2">
            <span className="text-accent-neon">[VERSION]</span> 1.0.0
          </div>
        </div>
      </div>

      {/* Linhas de conexão decorativas */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-electric-blue to-transparent"></div>
    </section>
  )
}

export default HeroSection

