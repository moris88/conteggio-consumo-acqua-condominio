import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

import type { Bolletta } from '@/types'

export function calcolaPercentualeGiorni(
  c: { inizio?: string; fine?: string },
  dataInizioPeriodo: Date,
  dataFinePeriodo: Date
): number {
  if (!c.inizio || !c.fine) return 1 // considera intero periodo

  const inizio = new Date(c.inizio)
  const fine = new Date(c.fine)

  const effInizio = inizio < dataInizioPeriodo ? dataInizioPeriodo : inizio
  const effFine = fine > dataFinePeriodo ? dataFinePeriodo : fine

  const giorniTotali = Math.max(
    1,
    (dataFinePeriodo.getTime() - dataInizioPeriodo.getTime()) /
      (1000 * 3600 * 24) +
      1
  )
  const giorniEffettivi = Math.max(
    0,
    (effFine.getTime() - effInizio.getTime()) / (1000 * 3600 * 24) + 1
  )

  return giorniEffettivi / giorniTotali
}

export async function exportToPDF({
  bolletta,
  tableRef,
}: {
  bolletta: Bolletta
  tableRef: React.RefObject<HTMLDivElement | null>
}) {
  if (!tableRef.current || !bolletta.dataScadenza) return

  const canvas = await html2canvas(tableRef.current, {
    backgroundColor: '#fff',
    scale: 2,
  } as Html2Canvas.Html2CanvasOptions)
  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF('landscape', 'mm', 'a4')

  const margin = 10
  const pageWidth = pdf.internal.pageSize.getWidth()
  const availableWidth = pageWidth - 2 * margin
  const imgHeight = (canvas.height * availableWidth) / canvas.width

  pdf.addImage(imgData, 'PNG', margin, margin, availableWidth, imgHeight)
  pdf.save(`ripartizione-condominiale-${bolletta.dataScadenza}.pdf`)
}
