import { useState, useEffect } from 'react'
import type { Student } from '@/lib/data'
import { generateGradesPDF } from '@/lib/pdf-generator'

interface GradesTableProps {
  student: Student
}

export default function GradesTable({ student }: GradesTableProps) {
  const [selectedView, setSelectedView] = useState<string>('all')
  const [currentDate, setCurrentDate] = useState<string>('')

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }))
  }, [])

  const getDisplayScore = (grade: any, view: string) => {
    if (view === 'all') return grade.average

    const [type, ...rest] = view.split('-')
    const trimesterIndex = parseInt(type.replace('t', '')) - 1

    if (rest.length === 0) {

      return grade.trimesters[trimesterIndex]?.average ?? '-'
    } else {

      const partialIndex = parseInt(rest[0].replace('p', '')) - 1
      return grade.trimesters[trimesterIndex]?.partials[partialIndex] ?? '-'
    }
  }

  const availableViews = [
    { value: 'all', label: 'Promedio General' }
  ]

  for (let t = 1; t <= 3; t++) {
    const trimesterIndex = t - 1
    const hasTrimesterData = student.grades.some(g => g.trimesters[trimesterIndex]?.average !== null || g.trimesters[trimesterIndex]?.partials.some(p => p !== null))

    if (hasTrimesterData) {
      const options = []


      if (student.grades.some(g => g.trimesters[trimesterIndex]?.average !== null)) {
        options.push({ value: `t${t}`, label: `Promedio T${t}` })
      }


      for (let p = 1; p <= 2; p++) {
        const partialIndex = p - 1
        if (student.grades.some(g => g.trimesters[trimesterIndex]?.partials[partialIndex] !== null)) {
          options.push({ value: `t${t}-p${p}`, label: `Parcial ${p}` })
        }
      }

      if (options.length > 0) {
        availableViews.push({ label: `Trimestre ${t}`, options } as any)
      }
    }
  }

  const getPeriodText = () => {
    if (selectedView === 'all') return 'Ciclo 2024-2025'

    const [type, ...rest] = selectedView.split('-')
    const trimesterNum = type.replace('t', '')

    if (rest.length === 0) {
      return `Trimestre ${trimesterNum} - Ciclo 2024-2025`
    } else {
      const partialNum = rest[0].replace('p', '')
      return `Trimestre ${trimesterNum} - Parcial ${partialNum} - Ciclo 2024-2025`
    }
  }

  return (
    <div className="w-full bg-white border border-primary/10 shadow-2xl shadow-primary/5 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-12 -mt-12" />
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-primary/10">

        <div className="lg:col-span-4 p-8 md:p-12 bg-secondary/30 space-y-8">
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-sm font-mono uppercase tracking-widest mb-2">
              Estudiante Activo
            </span>
            <h2 className="text-4xl md:text-5xl font-serif leading-none tracking-tight">
              {student.name.split(' ').map((n, i) => (
                <span key={i} className="block">{n}</span>
              ))}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-primary/10">
            <div>
              <p className="text-sm font-mono uppercase tracking-widest opacity-80 mb-1">Control</p>
              <p className="font-serif text-xl">{student.controlNumber}</p>
            </div>
            <div>
              <p className="text-sm font-mono uppercase tracking-widest opacity-80 mb-1">Grupo</p>
              <p className="font-serif text-xl">{student.grade}° {student.group}</p>
            </div>
          </div>


          <div className="grid grid-cols-2 gap-6 pt-8 border-t border-primary/10">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest opacity-80 mb-1">Act. Pendientes</p>
              <p className="font-serif text-xl text-destructive">
                {student.grades.reduce((acc, grade) => acc + grade.pendingActivities, 0)}
              </p>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-widest opacity-80 mb-1">Conducta</p>
              <p className={`font-serif text-xl ${student.grades.reduce((acc, grade) => acc + grade.conduct, 0) === 0
                ? 'text-green-600'
                : 'text-destructive'
                }`}>
                {student.grades.reduce((acc, grade) => acc + grade.conduct, 0)}
              </p>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-widest opacity-80 mb-1">Total Faltas</p>
              <p className="font-serif text-xl">
                {student.grades.reduce((acc, grade) => acc + grade.absences, 0)}
              </p>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-widest opacity-80 mb-1">Total Retardos</p>
              <p className="font-serif text-xl">
                {student.grades.reduce((acc, grade) => acc + grade.delays, 0)}
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-primary/10">
            <p className="text-sm font-mono uppercase tracking-widest opacity-80 mb-2">Promedio General</p>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl md:text-7xl font-serif">{student.average}</span>
              <span className="text-sm font-mono opacity-50">/ 10.0</span>
            </div>
          </div>
        </div>


        <div className="lg:col-span-8">
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
              <div>
                <h3 className="font-serif text-2xl italic">Reporte de Materias</h3>
                <span className="text-sm font-mono uppercase tracking-widest opacity-80 block mb-1">{getPeriodText()}</span>
                <span className="text-xs font-mono uppercase tracking-widest opacity-60 text-primary">
                  {currentDate}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="view-select" className="text-base font-mono uppercase tracking-widest opacity-80">
                  Ver:
                </label>
                <select
                  id="view-select"
                  value={selectedView}
                  onChange={(e) => setSelectedView(e.target.value)}
                  className="bg-transparent border border-primary/20 rounded px-3 py-1 text-base font-medium focus:outline-none focus:border-primary transition-colors max-w-[200px]"
                >
                  {availableViews.map((view: any, i) => (
                    view.options ? (
                      <optgroup key={i} label={view.label}>
                        {view.options.map((opt: any) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </optgroup>
                    ) : (
                      <option key={view.value} value={view.value}>{view.label}</option>
                    )
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-0">
              {student.grades.map((grade, index) => {
                const displayScore = getDisplayScore(grade, selectedView)

                return (
                  <div
                    key={index}
                    className="group flex flex-col py-6 border-b border-primary/5 hover:bg-primary/[0.02] transition-colors duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div className="space-y-1 mb-2 md:mb-0">
                        <p className="font-medium text-lg group-hover:translate-x-2 transition-transform duration-300">
                          {grade.subject}
                        </p>

                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-8 w-full md:w-auto">
                        <div className="h-px flex-1 bg-primary/10 md:hidden" />
                        <span className={`
                          text-3xl font-serif
                          ${typeof displayScore === 'number' && displayScore >= 9 ? 'text-primary' :
                            typeof displayScore === 'number' && displayScore < 6 ? 'text-destructive' : 'opacity-60'}
                        `}>
                          {displayScore}
                        </span>
                      </div>
                    </div>


                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-dashed border-primary/5 mt-2">
                      <div>
                        <p className="text-xs font-mono uppercase tracking-widest opacity-80 mb-1">Faltas</p>
                        <p className="text-base font-medium">{grade.absences}</p>
                      </div>
                      <div>
                        <p className="text-xs font-mono uppercase tracking-widest opacity-80 mb-1">Act. Pendientes</p>
                        <p className="text-base font-medium">{grade.pendingActivities}</p>
                      </div>
                      <div>
                        <p className="text-xs font-mono uppercase tracking-widest opacity-80 mb-1">Retardos</p>
                        <p className="text-base font-medium">{grade.delays}</p>
                      </div>
                      <div>
                        <p className="text-xs font-mono uppercase tracking-widest opacity-80 mb-1">Conducta</p>
                        <p className={`text-base font-medium ${grade.conduct === 0 ? 'text-base' : 'text-destructive'
                          }`}>
                          {grade.conduct === 0 ? 'Excelente' : `${grade.conduct} ${grade.conduct === 1 ? 'incidencia' : 'incidencias'}`}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-12 flex justify-end gap-4">
              <button
                onClick={() => generateGradesPDF(student, selectedView)}
                className="px-6 py-3 bg-primary text-primary-foreground text-base font-mono uppercase tracking-widest hover:bg-primary/90 transition-colors"
              >
                Descargar PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
// RPTR Studios 2025