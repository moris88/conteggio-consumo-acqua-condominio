import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export async function exportToPDF({
  dataScadenza,
  tableRef,
}: {
  dataScadenza: string
  tableRef: React.RefObject<HTMLDivElement | null>
}) {
  if (!tableRef.current) return

  tableRef.current.classList.add('pdf-export-mode')
  try {
    const canvas = await html2canvas(tableRef.current, {
      scale: 2,
    } as Html2Canvas.Html2CanvasOptions)
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('landscape', 'mm', 'a4')

    const margin = 10
    const pageWidth = pdf.internal.pageSize.getWidth()
    const availableWidth = pageWidth - 2 * margin
    const imgHeight = (canvas.height * availableWidth) / canvas.width

    pdf.addImage(imgData, 'PNG', margin, margin, availableWidth, imgHeight)
    pdf.save(`ripartizione-condominiale-${dataScadenza}.pdf`)
  } finally {
    // Rimuovi la classe dopo l’esportazione
    tableRef.current.classList.remove('pdf-export-mode')
  }
}

export function getGiorni(
  dataInizio: string | Date,
  dataFine: string | Date
): number {
  const inizio = new Date(dataInizio)
  const fine = new Date(dataFine)
  return (fine.getTime() - inizio.getTime()) / (1000 * 60 * 60 * 24)
}
