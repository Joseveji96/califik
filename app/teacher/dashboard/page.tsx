'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { students } from '@/lib/data'
import type { Student, Grade } from '@/lib/data'
import { Search, Plus, Save, LogOut, User, BookOpen, GraduationCap, ChevronRight } from 'lucide-react'

export default function TeacherDashboard() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedGrades, setEditedGrades] = useState<Grade[]>([])

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.controlNumber.includes(searchTerm)
  )

  const handleLogout = () => {
    router.push('/teacher/login')
  }

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student)
    setEditedGrades([...student.grades])
    setIsEditing(false)
  }

  const handleGradeChange = (index: number, field: keyof Grade, value: string | number) => {
    const newGrades = [...editedGrades]
    newGrades[index] = { ...newGrades[index], [field]: value }
    setEditedGrades(newGrades)
  }

  const handleSave = () => {
    // In a real app, this would make an API call
    if (selectedStudent) {
      selectedStudent.grades = editedGrades
      // Recalculate average
      const sum = editedGrades.reduce((acc, curr) => acc + Number(curr.average), 0)
      selectedStudent.average = Number((sum / editedGrades.length).toFixed(1))
      setIsEditing(false)
    }
  }

  return (
    <main className="min-h-screen w-full bg-background text-foreground relative overflow-hidden selection:bg-primary selection:text-primary-foreground">
      <div className="fixed inset-0 bg-grid z-0 pointer-events-none" />
      <div className="fixed inset-0 bg-grain z-0 pointer-events-none mix-blend-multiply" />

      <div className="fixed left-0 top-0 h-full w-20 md:w-64 border-r border-primary/10 bg-white/50 backdrop-blur-sm z-20 hidden md:flex flex-col justify-between p-6">
        <div>
          <div className="mb-12">
            <span className="font-serif text-2xl font-bold tracking-tighter">Califik</span>
            <span className="block text-[10px] font-mono uppercase tracking-widest mt-1 opacity-60">Panel Docente</span>
          </div>

          <nav className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary text-primary-foreground text-xs font-mono uppercase tracking-widest">
              <User className="w-4 h-4" />
              <span>Estudiantes</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-primary/5 text-xs font-mono uppercase tracking-widest transition-colors">
              <BookOpen className="w-4 h-4" />
              <span>Materias</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-primary/5 text-xs font-mono uppercase tracking-widest transition-colors">
              <GraduationCap className="w-4 h-4" />
              <span>Reportes</span>
            </button>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 text-xs font-mono uppercase tracking-widest transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>

      <div className="md:hidden fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md border-b border-primary/10 z-20 px-6 py-4 flex justify-between items-center">
        <span className="font-serif text-xl font-bold">Califik. Docente</span>
        <button onClick={handleLogout}>
          <LogOut className="w-5 h-5 text-red-600" />
        </button>
      </div>

      <div className="md:pl-64 min-h-screen relative z-10">
        <div className="p-6 md:p-12 max-w-7xl mx-auto">


          <header className="mb-12 mt-16 md:mt-0 animate-reveal-up">
            <h1 className="text-4xl md:text-6xl font-serif mb-4">Gestión de Calificaciones</h1>
            <p className="text-muted-foreground font-light max-w-2xl">
              Seleccione un estudiante para ver y editar su historial académico. Los cambios se reflejarán inmediatamente en el portal público.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">


            <div className="lg:col-span-4 space-y-6 animate-reveal-up delay-100">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Buscar estudiante..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-primary/10 py-3 pl-10 pr-4 text-sm font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="bg-white border border-primary/10 shadow-sm divide-y divide-primary/5 max-h-[600px] overflow-y-auto">
                {filteredStudents.map((student) => (
                  <button
                    key={student.controlNumber}
                    onClick={() => handleSelectStudent(student)}
                    className={`w-full text-left p-4 hover:bg-primary/5 transition-colors flex items-center justify-between group ${selectedStudent?.controlNumber === student.controlNumber ? 'bg-primary/5 border-l-2 border-primary' : 'border-l-2 border-transparent'
                      }`}
                  >
                    <div>
                      <p className="font-serif text-lg">{student.name}</p>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                        {student.controlNumber} • {student.grade}{student.group}
                      </p>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-primary/40 transition-transform ${selectedStudent?.controlNumber === student.controlNumber ? 'translate-x-1 text-primary' : 'group-hover:translate-x-1'
                      }`} />
                  </button>
                ))}
              </div>
            </div>


            <div className="lg:col-span-8 animate-reveal-up delay-200">
              {selectedStudent ? (
                <div className="bg-white border border-primary/10 p-8 shadow-xl shadow-primary/5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary" />

                  <div className="flex justify-between items-start mb-8 pb-8 border-b border-dashed border-primary/10">
                    <div>
                      <h2 className="text-3xl font-serif mb-2">{selectedStudent.name}</h2>
                      <div className="flex gap-4 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                        <span>Matrícula: {selectedStudent.controlNumber}</span>
                        <span>Grupo: {selectedStudent.grade}{selectedStudent.group}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-mono uppercase tracking-widest mb-1">Promedio General</p>
                      <p className="text-4xl font-serif text-primary">{selectedStudent.average}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-serif italic text-xl">Boleta de Calificaciones</h3>
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-4 py-2 bg-primary text-primary-foreground text-xs font-mono uppercase tracking-widest hover:bg-primary/90 transition-colors"
                        >
                          Editar Calificaciones
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 border border-primary/20 text-xs font-mono uppercase tracking-widest hover:bg-primary/5 transition-colors"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-primary text-primary-foreground text-xs font-mono uppercase tracking-widest hover:bg-primary/90 transition-colors flex items-center gap-2"
                          >
                            <Save className="w-3 h-3" />
                            Guardar Cambios
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-primary/10">
                            <th className="py-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground w-1/3">Materia</th>
                            <th className="py-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground text-right">Calificación</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/5">
                          {editedGrades.map((grade, index) => (
                            <tr key={index} className="group hover:bg-primary/[0.02]">
                              <td className="py-4 pr-4 font-medium">
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={grade.subject}
                                    onChange={(e) => handleGradeChange(index, 'subject', e.target.value)}
                                    className="w-full bg-transparent border-b border-primary/20 focus:border-primary focus:outline-none py-1"
                                  />
                                ) : (
                                  grade.subject
                                )}
                              </td>

                              <td className="py-4 text-right font-mono">
                                {isEditing ? (
                                  <input
                                    type="number"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    value={grade.average}
                                    onChange={(e) => handleGradeChange(index, 'average', e.target.value)}
                                    className="w-20 text-right bg-transparent border-b border-primary/20 focus:border-primary focus:outline-none py-1 ml-auto"
                                  />
                                ) : (
                                  <span className={`px-2 py-1 ${Number(grade.average) >= 9 ? 'bg-green-100 text-green-800' :
                                    Number(grade.average) >= 8 ? 'bg-blue-100 text-blue-800' :
                                      Number(grade.average) >= 6 ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                    {grade.average}
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {isEditing && (
                      <button
                        onClick={() => {
                          setEditedGrades([...editedGrades, {
                            subject: '',
                            average: 0,
                            trimesters: [],
                            absences: 0,
                            delays: 0,
                            pendingActivities: 0,
                            conduct: 10
                          }])
                        }}
                        className="w-full py-3 border border-dashed border-primary/20 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Agregar Materia
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center border border-dashed border-primary/10 bg-primary/[0.02] text-muted-foreground">
                  <User className="w-12 h-12 mb-4 opacity-20" />
                  <p className="font-serif text-xl opacity-60">Seleccione un estudiante</p>
                  <p className="text-xs font-mono uppercase tracking-widest opacity-40 mt-2">Para ver detalles y editar calificaciones</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
// RPTR Studios 2025