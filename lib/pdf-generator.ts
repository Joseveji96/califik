import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { Student } from './data'

export function generateGradesPDF(student: Student, selectedView: string) {
    const doc = new jsPDF()

    // Toma el periodo seleccionado xd
    const getPeriodText = () => {
        if (selectedView === 'all') return 'Promedio General - Ciclo 2024-2025'

        const [type, ...rest] = selectedView.split('-')
        const trimesterNum = type.replace('t', '')

        if (rest.length === 0) {
            return `Trimestre ${trimesterNum} - Ciclo 2024-2025`
        } else {
            const partialNum = rest[0].replace('p', '')
            return `Trimestre ${trimesterNum} - Parcial ${partialNum} - Ciclo 2024-2025`
        }
    }

    // Encabezado de la escuela
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('ESC. SEC. TEC. NO°9', 105, 15, { align: 'center' })

    doc.setFontSize(16)
    doc.text('REPORTE DE CALIFICACIONES', 105, 25, { align: 'center' })

    // Periodo
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(getPeriodText(), 105, 32, { align: 'center' })
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })}`, 105, 38, { align: 'center' })

    // Esto es una rayita
    doc.setLineWidth(0.5)
    doc.line(14, 42, 196, 42)

    // Aqui se pasa la informacion de los alumnos
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('DATOS DEL ALUMNO', 14, 50)

    doc.setFont('helvetica', 'normal')
    doc.text(`Nombre: ${student.name}`, 14, 56)
    doc.text(`Número de Control: ${student.controlNumber}`, 14, 62)
    doc.text(`Grado: ${student.grade}°    Grupo: ${student.group}`, 14, 68)

    // Estadisticas por inpuntualsh
    const totalAbsences = student.grades.reduce((acc, g) => acc + g.absences, 0)
    const totalDelays = student.grades.reduce((acc, g) => acc + g.delays, 0)
    const totalPending = student.grades.reduce((acc, g) => acc + g.pendingActivities, 0)
    const avgConduct = (student.grades.reduce((acc, g) => acc + g.conduct, 0) / student.grades.length).toFixed(1)

    doc.setFont('helvetica', 'bold')
    doc.text('ESTADÍSTICAS', 14, 78)

    doc.setFont('helvetica', 'normal')
    doc.text(`Promedio General: ${student.average}`, 14, 84)
    doc.text(`Faltas Totales: ${totalAbsences}    Retardos Totales: ${totalDelays}`, 14, 90)
    doc.text(`Actividades Pendientes: ${totalPending}    Promedio Conducta: ${avgConduct}`, 14, 96)

    const tableData: any[] = []

    if (selectedView === 'all') {
        student.grades.forEach(grade => {
            tableData.push([
                grade.subject,
                grade.average.toString()
            ])
        })

        autoTable(doc, {
            startY: 105,
            head: [['Materia', 'Promedio']],
            body: tableData,
            theme: 'striped',
            headStyles: {
                fillColor: [41, 128, 185],
                textColor: 255,
                fontStyle: 'bold'
            },
            styles: {
                fontSize: 10,
                cellPadding: 4
            },
            columnStyles: {
                0: { cellWidth: 140 },
                1: { cellWidth: 40, halign: 'center' }
            }
        })
    } else {
        const [type, ...rest] = selectedView.split('-')
        const trimesterIndex = parseInt(type.replace('t', '')) - 1

        student.grades.forEach(grade => {
            const trimester = grade.trimesters[trimesterIndex]
            if (!trimester) return

            let gradeValue: number | null = null

            if (rest.length === 0) {
                gradeValue = trimester.average
            } else {
                const partialIndex = parseInt(rest[0].replace('p', '')) - 1
                gradeValue = trimester.partials[partialIndex]
            }

            if (gradeValue !== null) {
                tableData.push([
                    grade.subject,
                    gradeValue.toString()
                ])
            }
        })

        autoTable(doc, {
            startY: 105,
            head: [['Materia', 'Calificación']],
            body: tableData,
            theme: 'striped',
            headStyles: {
                fillColor: [41, 128, 185],
                textColor: 255,
                fontStyle: 'bold'
            },
            styles: {
                fontSize: 10,
                cellPadding: 4
            },
            columnStyles: {
                0: { cellWidth: 140 },
                1: { cellWidth: 40, halign: 'center' }
            }
        })
    }

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages()
    doc.setFontSize(8)
    doc.setFont('helvetica', 'italic')

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.text(
            `Página ${i} de ${pageCount}`,
            105,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        )
    }

    // Boton de descarga
    const periodName = selectedView === 'all' ? 'General' : getPeriodText().replace(/ - /g, '_').replace(/\s+/g, '_')
    const fileName = `Calificaciones_${student.controlNumber}_${periodName}.pdf`
    doc.save(fileName)
}

// RPTR Studios 2025
