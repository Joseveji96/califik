'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Lock, User } from 'lucide-react'

export default function TeacherLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    setTimeout(() => {
      if (username === 'profesor' && password === 'admin123') {
        router.push('/teacher/dashboard')
      } else {
        setError('Credenciales incorrectas')
        setIsLoading(false)
      }
    }, 1000)
  }

  return (
    <main className="min-h-screen w-full bg-background text-foreground relative overflow-hidden selection:bg-primary selection:text-primary-foreground">
      {/* Background Textures */}
      {/* <div className="fixed inset-0 bg-grid z-0 pointer-events-none" />
      <div className="fixed inset-0 bg-grain z-0 pointer-events-none mix-blend-multiply" /> */}

      {/* Top Marquee */}
      <div className="fixed top-0 left-0 w-full bg-primary text-primary-foreground py-2 z-50 overflow-hidden whitespace-nowrap border-b border-primary/10">
        <div className="animate-marquee inline-flex gap-8 text-xs font-mono uppercase tracking-widest">
          {Array(10).fill("Portal de Profesores • Acceso Restringido • Sistema Seguro • ").map((text, i) => (
            <span key={i}>{text}</span>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 w-full px-6 md:px-12 py-12 flex justify-between items-center">
        <a href="/" className="flex flex-col group">
          <span className="font-serif text-2xl md:text-3xl font-bold tracking-tighter group-hover:translate-x-1 transition-transform">Califik</span>
          <span className="text-[10px] font-mono uppercase tracking-widest mt-1 opacity-60">Sistema Escolar</span>
        </a>
        <a href="/" className="text-xs font-mono uppercase tracking-widest hover:underline decoration-1 underline-offset-4">
          ← Volver al inicio
        </a>
      </nav>

      {/* Login Form */}
      <div className="relative z-10 flex items-center justify-center px-4 py-12 md:py-20">
        <div className="w-full max-w-2xl">
          <div className="mb-12 space-y-4 animate-reveal-up">
            <div className="flex items-center gap-3 text-primary/60">
              <Lock className="w-5 h-5" />
              <span className="text-xs font-mono uppercase tracking-widest">Área Restringida</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif leading-[0.9] tracking-tighter">
              Portal de <br />
              <span className="italic font-light text-primary/80">Profesores</span>
            </h1>
            <p className="text-sm md:text-base font-light leading-relaxed text-muted-foreground max-w-md text-balance">
              Acceso exclusivo para el personal docente. Ingrese sus credenciales para gestionar calificaciones y expedientes.
            </p>
          </div>

          <div className="bg-white border border-primary/10 p-8 md:p-12 shadow-2xl shadow-primary/5 relative overflow-hidden group ">
            {/* <div className="absolute top-0 left-0 w-1 h-full bg-primary " /> */}

            <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
              <div>
                <h2 className="text-2xl font-serif italic mb-8">Iniciar Sesión</h2>

                {/* Username Field */}
                <div className="relative group/input mb-8">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within/input:text-primary transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Usuario"
                    className="w-full bg-transparent border-b-2 border-primary/20 py-4 pl-10 text-xl font-serif placeholder:text-primary/20 focus:outline-none focus:border-primary transition-colors duration-500"
                    disabled={isLoading}
                    required
                  />
                  <label className="absolute left-10 -top-3 text-[10px] font-mono uppercase tracking-widest text-primary/40 pointer-events-none">
                    Usuario
                  </label>
                </div>

                {/* Password Field */}
                <div className="relative group/input">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within/input:text-primary transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    className="w-full bg-transparent border-b-2 border-primary/20 py-4 pl-10 text-xl font-serif placeholder:text-primary/20 focus:outline-none focus:border-primary transition-colors duration-500"
                    disabled={isLoading}
                    required
                  />
                  <label className="absolute left-10 -top-3 text-[10px] font-mono uppercase tracking-widest text-primary/40 pointer-events-none">
                    Contraseña
                  </label>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 p-4 text-red-800 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !username || !password}
                className="w-full bg-primary text-primary-foreground py-4 px-6 font-mono text-sm uppercase tracking-widest hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 group/btn"
              >
                {isLoading ? (
                  <span>Verificando...</span>
                ) : (
                  <>
                    <span>Acceder al Sistema</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* <div className="pt-6 border-t border-dashed border-primary/10">
                <p className="text-[10px] font-mono uppercase tracking-widest text-primary/40">
                  Credenciales de prueba: <span className="text-primary">profesor</span> / <span className="text-primary">admin123</span>
                </p>
              </div> */}
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full px-6 md:px-12 py-8 border-t border-primary/5 flex justify-between items-end text-[10px] font-mono uppercase tracking-widest opacity-40">
        <div>
          <p>© 2025 Dept. de Educación</p>
          <p>Portal de Acceso</p>
        </div>
        <div className="text-right">
          <p>Califik</p>
          <p>v1.0.0-stable</p>
        </div>
      </footer>
    </main>
  )
}
// RPTR Studios 2025