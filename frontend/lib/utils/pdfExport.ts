'use client'

import type { StatisticsAnalytics, StatisticsSummary } from '@/lib/api'

export async function exportStatisticsToPDF(
  stats: StatisticsSummary,
  analytics: StatisticsAnalytics,
  filename: string = 'statistics-export.pdf'
) {
  if (typeof window === 'undefined') {
    console.error('PDF export is only available in the browser')
    return
  }

  try {
    // Dynamic import to avoid SSR issues
    const jsPDF = (await import('jspdf')).default
    const autoTable = (await import('jspdf-autotable')).default

    const doc = new jsPDF()
    let yPos = 20
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 14

    // Title
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('Lifecycle Statistics Report', margin, yPos)
    yPos += 10

    // Metadata
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 100, 100)
    doc.text(`Generated: ${new Date().toLocaleString('fr-FR')}`, margin, yPos)
    yPos += 8

    doc.setTextColor(0, 0, 0)

    // Summary Statistics
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Summary Statistics', margin, yPos)
    yPos += 10

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')

    const summaryData = [
      ['Total Active Entities', stats?.totalActiveEntities?.toString() || '0'],
      ['Reviews Today', stats?.totalReviewsToday?.toString() || '0'],
      ['Reviews This Week', stats?.totalReviewsThisWeek?.toString() || '0'],
      ['Success Rate', `${stats?.successRate?.toFixed(1) || '0'}%`]
    ]

    autoTable(doc, {
      body: summaryData,
      startY: yPos,
      theme: 'striped',
      styles: { fontSize: 10, cellPadding: 5 },
      columnStyles: { 
        0: { fontStyle: 'bold', cellWidth: 120 },
        1: { cellWidth: 'auto' }
      },
      margin: { left: margin, right: margin }
    })

    yPos = (doc as any).lastAutoTable.finalY + 15

    // Detailed Metrics
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Detailed Metrics', margin, yPos)
    yPos += 10

    const metricsData = [
      ['Avg Stages per Entity', analytics?.averageNumberOfStatesPerEntity?.toFixed(1) || '0'],
      ['Min Stages', analytics?.minStatesPerEntity?.toString() || '0'],
      ['Max Stages', analytics?.maxStatesPerEntity?.toString() || '0'],
      ['Success Rate', `${analytics?.successRate?.toFixed(1) || '0'}%`]
    ]

    autoTable(doc, {
      body: metricsData,
      startY: yPos,
      theme: 'striped',
      styles: { fontSize: 10, cellPadding: 5 },
      columnStyles: { 
        0: { fontStyle: 'bold', cellWidth: 120 },
        1: { cellWidth: 'auto' }
      },
      margin: { left: margin, right: margin }
    })

    yPos = (doc as any).lastAutoTable.finalY + 15

    // Average Time per Status
    if (analytics?.averageTimePerStatus && Object.keys(analytics.averageTimePerStatus).length > 0) {
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Average Time per Status (days)', margin, yPos)
      yPos += 10

      const timeData = Object.entries(analytics.averageTimePerStatus).map(([status, days]: [string, any]) => [
        status,
        `${days.toFixed(2)} days`
      ])

      autoTable(doc, {
        head: [['Status', 'Average Time']],
        body: timeData,
        startY: yPos,
        theme: 'striped',
        styles: { fontSize: 9, cellPadding: 4 },
        headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
        columnStyles: { 
          0: { cellWidth: 120 },
          1: { cellWidth: 'auto' }
        },
        margin: { left: margin, right: margin }
      })

      yPos = (doc as any).lastAutoTable.finalY + 15
    }

    // Status Distribution
    if (analytics?.distributionByStatus && Object.keys(analytics.distributionByStatus).length > 0) {
      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage()
        yPos = 20
      }

      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Status Distribution', margin, yPos)
      yPos += 10

      const distributionData = Object.entries(analytics.distributionByStatus).map(([status, count]: [string, any]) => [
        status,
        count.toString()
      ])

      autoTable(doc, {
        head: [['Status', 'Count']],
        body: distributionData,
        startY: yPos,
        theme: 'striped',
        styles: { fontSize: 9, cellPadding: 4 },
        headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
        columnStyles: { 
          0: { cellWidth: 120 },
          1: { cellWidth: 'auto' }
        },
        margin: { left: margin, right: margin }
      })

      yPos = (doc as any).lastAutoTable.finalY + 15
    }

    // Stages Distribution
    if (analytics?.stagesCountPerEntity && Object.keys(analytics.stagesCountPerEntity).length > 0) {
      if (yPos > 250) {
        doc.addPage()
        yPos = 20
      }

      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Stages Count Distribution', margin, yPos)
      yPos += 10

      const stagesData = Object.entries(analytics.stagesCountPerEntity)
        .sort(([a], [b]) => parseInt(a) - parseInt(b))
        .map(([stages, count]: [string, any]) => [
          `${stages} stages`,
          count.toString()
        ])

      autoTable(doc, {
        head: [['Number of Stages', 'Number of Entities']],
        body: stagesData,
        startY: yPos,
        theme: 'striped',
        styles: { fontSize: 9, cellPadding: 4 },
        headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
        margin: { left: margin, right: margin }
      })
    }

    // Footer on last page
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(128, 128, 128)
      doc.text(
        `Page ${i} of ${pageCount} - LifeCycle Tracker Statistics Report`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      )
    }

    // Save PDF
    doc.save(filename)
  } catch (error) {
    console.error('PDF export error:', error)
    throw new Error('Failed to generate PDF. Please ensure PDF libraries are installed.')
  }
}
