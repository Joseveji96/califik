'use client'

import { useState, useEffect } from 'react'
import StudentLookup from '@/components/student-lookup'
import GradesTable from '@/components/grades-table'
import { students } from '@/lib/data'
import type { Student } from '@/lib/data'
import { AlertCircle, ArrowDown } from 'lucide-react'

export default function Home() {
  const [current, setCurrent] = useState<Student | null>(null)
  const [notFound, setNotFound] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  useEffect(() => {
    setMounted(true)
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentControlNumbers')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setRecentSearches(Array.isArray(parsed) ? parsed : [])
      } catch {
        setRecentSearches([])
      }
    }
  }, [])

  function handleSearch(controlNumber: string) {
    setIsLoading(true)
    setNotFound(null)
    setCurrent(null)

    setTimeout(() => {
      const found = students.find((s) => s.controlNumber === controlNumber)
      if (found) {
        setCurrent(found)
        setNotFound(null)
        // Add to recent searches (keep max 5, most recent first)
        const updated = [controlNumber, ...recentSearches.filter(s => s !== controlNumber)].slice(0, 5)
        setRecentSearches(updated)
        localStorage.setItem('recentControlNumbers', JSON.stringify(updated))
      } else {
        setCurrent(null)
        setNotFound(controlNumber)
      }
      setIsLoading(false)
    }, 1000)
  }

  if (!mounted) return null

  return (
    <main className="min-h-screen w-full bg-background text-foreground relative overflow-x-hidden selection:bg-primary selection:text-primary-foreground">
      {/* Background Textures */}
      {/* <div className="fixed inset-0 bg-grid z-0 pointer-events-none" /> */}
      {/* <div className="fixed inset-0 bg-grain z-0 pointer-events-none mix-blend-multiply" /> */}

      {/* Top Marquee */}
      <div className="fixed top-0 left-0 w-full bg-primary text-primary-foreground py-2 z-50 overflow-hidden whitespace-nowrap border-b border-primary/10">
        <div className="animate-marquee inline-flex gap-8 text-xs font-mono uppercase tracking-widest">
          {Array(10).fill("Sistema de Control Escolar • Consulta de Calificaciones 2025 • Portal Oficial • ").map((text, i) => (
            <span key={i}>{text}</span>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navigation / Header */}
        <nav className="w-full px-6 md:px-12 py-12 flex justify-between items-center animate-reveal-up">
          <div className="flex flex-col">
            <span className="font-serif text-2xl md:text-3xl font-bold tracking-tighter">Califik</span>
            <span className="text-[10px] font-mono uppercase tracking-widest mt-1 opacity-60">Sistema Escolar</span>
          </div>
          <div className="hidden md:flex gap-8 text-xs font-mono uppercase tracking-widest">
            <a href="#" className="hover:underline decoration-1 underline-offset-4">Contacto</a>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 py-12 md:py-20">
          <div className="w-full max-w-5xl lg:max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">

              {/* Left Column: Typography */}
              <div className="lg:col-span-7 space-y-8 md:space-y-12">
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif leading-[0.9] tracking-tighter animate-reveal-up delay-100">
                  Reporte <br />
                  <span className="italic font-light text-primary/80">Académico</span>
                </h1>
                <div className="flex flex-col md:flex-row gap-8 md:items-end animate-reveal-up delay-200">
                  <p className="max-w-xs text-sm md:text-base font-light leading-relaxed text-muted-foreground text-balance">
                    Plataforma digital para la consulta segura de expedientes académicos y seguimiento del rendimiento estudiantil.
                  </p>
                  <ArrowDown className="w-6 h-6 animate-bounce opacity-50 hidden md:block" />
                </div>
              </div>

              {/* Right Column: Interaction */}
              <div className="lg:col-span-5 w-full animate-reveal-up delay-300">
                <div className="bg-white border border-primary/10 p-8 md:p-10 shadow-2xl shadow-primary/5 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform duration-1000 origin-top" />

                  <div className="relative z-10 space-y-8">
                    <div>
                      <h3 className="font-mono text-xs uppercase tracking-widest mb-2 opacity-60">Acceso Padres/Tutores</h3>
                      <h2 className="text-2xl font-serif italic">Consultar Calificaciones</h2>
                    </div>

                    <StudentLookup onSearch={handleSearch} isLoading={isLoading} />

                    {!current && !isLoading && !notFound && recentSearches.length > 0 && (
                      <div className="pt-4 border-t border-dashed border-primary/10">
                        <p className="text-[10px] font-mono uppercase tracking-widest mb-3 opacity-40">Visitados anteriormente</p>
                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map(controlNum => (
                            <button
                              key={controlNum}
                              onClick={() => handleSearch(controlNum)}
                              className="px-3 py-1 text-[10px] font-mono border border-primary/20 hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                            >
                              {controlNum}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="mt-24 w-full">
              {isLoading ? (
                <div className="w-full h-64 flex flex-col items-center justify-center animate-fade-in">
                  <div className="w-full max-w-xs bg-primary/5 h-1 overflow-hidden">
                    <div className="h-full bg-primary animate-[marquee_1s_linear_infinite]" />
                  </div>
                  <p className="mt-4 font-mono text-xs uppercase tracking-widest animate-pulse">Buscando en la base de datos...</p>
                </div>
              ) : notFound ? (
                <div className="w-full max-w-2xl mx-auto bg-red-50 border border-red-100 p-8 flex items-start gap-6 animate-reveal-up">
                  <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-serif text-xl text-red-900 mb-2">Registro no encontrado</h3>
                    <p className="text-red-700/80 font-light">
                      No se encontró ningún estudiante con el número de control <span className="font-mono font-medium bg-red-100 px-1">{notFound}</span>. Por favor verifica la información.
                    </p>
                  </div>
                </div>
              ) : current ? (
                <div className="animate-reveal-up">
                  <GradesTable student={current} />
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full px-6 md:px-12 py-8 border-t border-primary/5 flex justify-between items-end text-[10px] font-mono uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">
          <div>
            <p>© 2025 Education Dept.</p>
            <p>All rights reserved</p>
          </div>
          <div className="text-right">
            <p>Secure Connection</p>
            <p>v2.5.0-stable</p>
          </div>
        </footer>
      </div>
    </main>
  )
}
