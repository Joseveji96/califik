import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { Student } from './data'

export function generateGradesPDF(student: Student, selectedView: string) {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.width
    const pageHeight = doc.internal.pageSize.height

    // Colors
    const primaryColor: [number, number, number] = [27, 50, 38] // Navy Blue
    const accentColor: [number, number, number] = [200, 200, 200] // Light Gray
    const tableHeaderColor: [number, number, number] = [240, 240, 245] // Very Light Gray/Blue
    const textColor: [number, number, number] = [40, 40, 40] // Dark Gray

    // Helper to center text
    const centerText = (text: string, y: number, size: number, font: string = 'helvetica', style: string = 'normal') => {
        doc.setFontSize(size)
        doc.setFont(font, style)
        const textWidth = doc.getTextWidth(text)
        doc.text(text, (pageWidth - textWidth) / 2, y)
    }

    // Header
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.rect(0, 0, pageWidth, 40, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFont('times', 'bold')
    doc.setFontSize(18)
    doc.text('ESC. SEC. TEC. NO°9', 20, 18)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text('REPORTE OFICIAL DE CALIFICACIONES', 20, 26)

    // Date and Period in Header
    doc.setFontSize(9)
    const dateStr = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })
    const periodText = selectedView === 'all'
        ? 'Ciclo Escolar 2024-2025'
        : selectedView.replace('t', 'Trimestre ').replace('p', ' - Parcial ').replace('-', ' ') + ' - Ciclo 2024-2025'

    const dateWidth = doc.getTextWidth(dateStr)
    doc.text(dateStr, pageWidth - 20 - dateWidth, 18)

    const periodWidth = doc.getTextWidth(periodText)
    doc.text(periodText, pageWidth - 20 - periodWidth, 26)

    // Student Info Section
    const startY = 55
    doc.setTextColor(textColor[0], textColor[1], textColor[2])

    // Student Name (Large)
    doc.setFont('times', 'bold')
    doc.setFontSize(22)
    doc.text(student.name, 20, startY)

    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2])
    doc.line(20, startY + 5, pageWidth - 20, startY + 5)

    // Details Grid
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)

    doc.text('NÚMERO DE CONTROL', 20, startY + 15)
    doc.text('GRADO Y GRUPO', 100, startY + 15)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(12)
    doc.setTextColor(textColor[0], textColor[1], textColor[2])

    doc.text(student.controlNumber, 20, startY + 22)
    doc.text(`${student.grade}° "${student.group}"`, 100, startY + 22)

    // Statistics Section (Text List)
    const statsY = startY + 35

    const totalAbsences = student.grades.reduce((acc, g) => acc + g.absences, 0)
    const totalDelays = student.grades.reduce((acc, g) => acc + g.delays, 0)
    const totalPending = student.grades.reduce((acc, g) => acc + g.pendingActivities, 0)
    const totalConductIncidents = student.grades.reduce((acc, g) => acc + g.conduct, 0)

    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(textColor[0], textColor[1], textColor[2])
    doc.text('RESUMEN ESTADÍSTICO', 20, statsY)

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')

    // Helper to draw stat line
    const drawStat = (label: string, value: string, x: number, y: number, isRed: boolean = false) => {
        doc.setTextColor(100, 100, 100)
        doc.setFont('helvetica', 'bold')
        doc.text(label, x, y)

        doc.setTextColor(isRed ? 198 : 40, isRed ? 40 : 40, isRed ? 40 : 40)
        doc.setFont('helvetica', 'normal')
        doc.text(value, x + 35, y)
    }

    const col1X = 20
    const col2X = 110

    drawStat('PROMEDIO:', student.average.toString(), col1X, statsY + 8, student.average < 6)
    drawStat('FALTAS:', totalAbsences.toString(), col1X, statsY + 14, totalAbsences > 0)

    drawStat('RETARDOS:', totalDelays.toString(), col2X, statsY + 8, totalDelays > 0)
    drawStat('CONDUCTA:', totalConductIncidents.toString(), col2X, statsY + 14, totalConductIncidents > 0)

    // Table
    const tableHeaders = [['MATERIA', 'CALIF.', 'FALTAS', 'RETARDOS', 'PENDIENTES', 'CONDUCTA']]
    const tableData: any[] = []

    if (selectedView === 'all') {
        student.grades.forEach(grade => {
            tableData.push([
                grade.subject,
                grade.average.toString(),
                grade.absences.toString(),
                grade.delays.toString(),
                grade.pendingActivities.toString(),
                grade.conduct.toString()
            ])
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
                    gradeValue.toString(),
                    grade.absences.toString(),
                    grade.delays.toString(),
                    grade.pendingActivities.toString(),
                    grade.conduct.toString()
                ])
            }
        })
    }

    autoTable(doc, {
        startY: statsY + 25,
        head: tableHeaders,
        body: tableData,
        theme: 'plain',
        headStyles: {
            fillColor: tableHeaderColor,
            textColor: [60, 60, 60],
            fontStyle: 'bold',
            halign: 'center',
            fontSize: 8,
            cellPadding: 4 // Reduced padding
        },
        styles: {
            fontSize: 9,
            cellPadding: 4, // Reduced padding
            halign: 'center',
            textColor: [60, 60, 60],
            lineColor: [230, 230, 230],
            lineWidth: 0.1
        },
        alternateRowStyles: {
            fillColor: [252, 252, 252]
        },
        columnStyles: {
            0: { cellWidth: 55, halign: 'left', fontStyle: 'bold' }, // Materia - Reduced width
            1: { cellWidth: 20 }, // Calificación
            2: { cellWidth: 20 }, // Faltas
            3: { cellWidth: 25 }, // Retardos - Increased
            4: { cellWidth: 30 }, // Act. Pend. - Increased significantly
            5: { cellWidth: 25 }  // Conducta - Increased
        },
        didParseCell: function (data) {
            if (data.section === 'body') {
                const rawValue = data.cell.raw;
                const numValue = parseFloat(rawValue as string);

                if (data.column.index === 1) { // Calificación
                    if (numValue < 6) {
                        data.cell.styles.textColor = [220, 38, 38] as [number, number, number]; // Red
                        data.cell.styles.fontStyle = 'bold';
                    } else {
                        data.cell.styles.textColor = [40, 40, 40] as [number, number, number];
                    }
                } else if (data.column.index >= 2 && data.column.index <= 5) { // Metrics
                    if (numValue > 0) {
                        data.cell.styles.textColor = [220, 38, 38] as [number, number, number]; // Red
                        data.cell.styles.fontStyle = 'bold';
                    } else {
                        data.cell.styles.textColor = [150, 150, 150] as [number, number, number]; // Light gray for 0
                    }
                }
            }
        }
    })

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages()
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(150, 150, 150)

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.line(20, pageHeight - 15, pageWidth - 20, pageHeight - 15)
        doc.text(
            `Generado el ${dateStr} - Página ${i} de ${pageCount}`,
            pageWidth / 2,
            pageHeight - 8,
            { align: 'center' }
        )
    }

    // Boton de descarga
    const periodName = selectedView === 'all' ? 'General' : selectedView.replace(/-/g, '_')
    const fileName = `Reporte_${student.controlNumber}_${periodName}.pdf`
    doc.save(fileName)
}

// RPTR Studios 2025
