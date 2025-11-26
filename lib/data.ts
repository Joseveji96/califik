import rawData from './CONTROL_JSON.json'

export interface Student {
  controlNumber: string
  name: string
  group: string
  grade: number
  average: number
  grades: Grade[]
}

export interface Grade {
  subject: string
  average: number
  trimesters: Trimester[]
  absences: number
  delays: number
  pendingActivities: number
  conduct: number
}

export interface Trimester {
  average: number | null
  partials: (number | null)[]
}

interface RawEvaluation {
  materia: string
  trimestre: number
  parcial: string
  ciclo: string
  calificacion: number | null
  faltas: number | null
  retardos: number | null
  conducta: number | null
  actividadesPendientes: number | null
}

interface RawStudent {
  nombre: string | null
  grupo: string | null
  grado: number | null
  evaluaciones: RawEvaluation[]
}

interface RawData {
  evaluaciones: Record<string, RawStudent>
}

const typedRawData = rawData as RawData

export const students: Student[] = Object.entries(typedRawData.evaluaciones).map(([controlNumber, data]) => {

  const subjectsMap = new Map<string, RawEvaluation[]>()

  data.evaluaciones.forEach(ev => {
    if (!subjectsMap.has(ev.materia)) {
      subjectsMap.set(ev.materia, [])
    }
    subjectsMap.get(ev.materia)!.push(ev)
  })

  const grades: Grade[] = Array.from(subjectsMap.entries()).map(([subject, evaluations]) => {

    const trimesters: Trimester[] = [
      { average: null, partials: [null, null] },
      { average: null, partials: [null, null] },
      { average: null, partials: [null, null] }
    ]

    let totalAbsences = 0
    let totalDelays = 0
    let totalPending = 0
    let conductIncidents = 0

    evaluations.forEach(ev => {
      const trimIdx = ev.trimestre - 1
      if (trimIdx < 0 || trimIdx >= 3) return


      if (ev.faltas) totalAbsences += ev.faltas
      if (ev.retardos) totalDelays += ev.retardos
      if (ev.actividadesPendientes) totalPending += ev.actividadesPendientes
      if (ev.conducta && ev.conducta > 0) {
        conductIncidents += ev.conducta
      }


      if (ev.parcial === 'Parcial 1') {
        trimesters[trimIdx].partials[0] = ev.calificacion
      } else if (ev.parcial === 'Parcial 2') {
        trimesters[trimIdx].partials[1] = ev.calificacion
      } else if (ev.parcial === 'Final') {
        trimesters[trimIdx].average = ev.calificacion
      }
    })


    const validTrimesters = trimesters.filter(t => t.average !== null && t.average > 0)
    const subjectAverage = validTrimesters.length > 0
      ? Number((validTrimesters.reduce((sum, t) => sum + (t.average || 0), 0) / validTrimesters.length).toFixed(1))
      : 0

    return {
      subject,
      average: subjectAverage,
      trimesters,
      absences: totalAbsences,
      delays: totalDelays,
      pendingActivities: totalPending,
      conduct: conductIncidents
    }
  })


  const validSubjectAverages = grades.filter(g => g.average > 0).map(g => g.average)
  const generalAverage = validSubjectAverages.length > 0
    ? Number((validSubjectAverages.reduce((a, b) => a + b, 0) / validSubjectAverages.length).toFixed(1))
    : 0

  return {
    controlNumber,
    name: data.nombre || 'Sin Nombre',
    group: data.grupo || '',
    grade: data.grado || 0,
    average: generalAverage,
    grades
  }
})
