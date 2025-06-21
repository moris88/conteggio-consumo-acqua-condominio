import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import React from 'react'

import type { Bolletta, Condomino } from '@/types'

interface Props {
  condomini: Condomino[]
  bolletta: Bolletta
}

export default function TabellaStampabile({
  condomini,
  bolletta,
}: Readonly<Props>) {
  const tableRef = React.useRef<HTMLDivElement>(null)

  const totaleConsumi = Math.max(
    1,
    condomini.reduce((acc, c) => acc + (isNaN(c.consumo) ? 0 : c.consumo), 0)
  )
  const eccedenzaMC = Math.max(0, bolletta.consumoGenerale - totaleConsumi)

  const quotaFissaTotale =
    bolletta.quotaFissa * new Set(condomini.map((c) => c.appartamento)).size

  const quotaEccedenza =
    (bolletta.importoTotale - quotaFissaTotale) *
    (eccedenzaMC / bolletta.consumoGenerale || 0)

  const quotaVariabileTotale =
    bolletta.importoTotale - quotaFissaTotale - quotaEccedenza

  // Quota fissa suddivisa per appartamento
  const giorniPerAppartamento: Record<string, number> = {}

  for (const c of condomini) {
    const inizio = new Date(c.inizio)
    const fine = new Date(c.fine)
    const giorni = (fine.getTime() - inizio.getTime()) / (1000 * 60 * 60 * 24)

    giorniPerAppartamento[c.appartamento] =
      (giorniPerAppartamento[c.appartamento] || 0) + giorni
  }

  const sommaConsumo = condomini.reduce((a, c) => a + c.consumo, 0)
  let sommaQuotaFissa = 0
  let sommaQuotaVariabile = 0
  let sommaEccedenza = 0
  let sommaTotale = 0

  const handleEsportaPDF = async () => {
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

  return (
    <>
      <div
        ref={tableRef}
        className="mt-6 overflow-y-auto bg-white p-4 text-black"
      >
        <h2 className="my-2 text-xl font-semibold">Tabella Ripartizione</h2>
        <table className="w-full border-collapse border border-black">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Appartamento</th>
              <th>Precedente</th>
              <th>Attuale</th>
              <th>Consumo (mc)</th>
              <th>Quota fissa (€)</th>
              <th>Quota variabile (€)</th>
              <th>Eccedenza (€)</th>
              <th>Imposte (€)</th>
              <th>Costi agg. (€)</th>
              <th>Totale (€)</th>
            </tr>
          </thead>
          <tbody>
            {condomini.map((c) => {
              const inizio = new Date(c.inizio)
              const fine = new Date(c.fine)
              const giorni =
                (fine.getTime() - inizio.getTime()) / (1000 * 60 * 60 * 24)

              const percentualePermanenza =
                giorni / (giorniPerAppartamento[c.appartamento] || 1)
              const quotaFissaIndividuale =
                bolletta.quotaFissa * percentualePermanenza

              const quotaVar =
                (c.consumo / totaleConsumi) * quotaVariabileTotale || 0
              const eccedenza = quotaEccedenza / condomini.length || 0
              const imposteIndividuali = bolletta.imposte / condomini.length
              const costiAggiuntiviIndividuali =
                bolletta.costiAggiuntivi / condomini.length

              const totale =
                quotaFissaIndividuale +
                quotaVar +
                eccedenza +
                imposteIndividuali +
                costiAggiuntiviIndividuali

              sommaQuotaFissa += quotaFissaIndividuale
              sommaQuotaVariabile += quotaVar
              sommaEccedenza += eccedenza
              sommaTotale += totale

              return (
                <tr key={c.id}>
                  <td>{c.nome}</td>
                  <td>{c.appartamento}</td>
                  <td>{c.contatoreIniziale}</td>
                  <td>{c.contatoreFinale}</td>
                  <td>{c.consumo}</td>
                  <td>{quotaFissaIndividuale.toFixed(2)}</td>
                  <td>{quotaVar.toFixed(2)}</td>
                  <td>{eccedenza.toFixed(2)}</td>
                  <td>{imposteIndividuali.toFixed(2)}</td>
                  <td>{costiAggiuntiviIndividuali.toFixed(2)}</td>
                  <td className="font-bold">{totale.toFixed(2)}</td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="font-semibold">
              <td className="text-right" colSpan={4}>
                Totale
              </td>
              <td>{sommaConsumo}</td>
              <td>{sommaQuotaFissa.toFixed(2)}</td>
              <td>{sommaQuotaVariabile.toFixed(2)}</td>
              <td>{sommaEccedenza.toFixed(2)}</td>
              <td>{bolletta.imposte.toFixed(2)}</td>
              <td>{bolletta.costiAggiuntivi.toFixed(2)}</td>
              <td>{sommaTotale.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        <p className="mt-2">
          <strong>Nota:</strong> Scadenza fattura:{' '}
          {bolletta.dataScadenza !== ''
            ? bolletta.dataScadenza
            : 'Non impostata'}
        </p>
      </div>

      <div className="flex w-full justify-end">
        <button
          className="mb-4 rounded bg-blue-600 px-4 py-1 text-white hover:bg-blue-700 disabled:opacity-50"
          disabled={!condomini.length || bolletta.dataScadenza === ''}
          onClick={handleEsportaPDF}
        >
          Esporta PDF
        </button>
      </div>
    </>
  )
}
