import React from 'react'

import type { Bolletta, Condomino } from '@/types'
import { exportToPDF } from '@/utils'

interface Props {
  condomini: Condomino[]
  bolletta: Bolletta
}

export default function TabellaStampabile({
  condomini,
  bolletta,
}: Readonly<Props>) {
  const tableRef = React.useRef<HTMLDivElement>(null)

  console.log('TabellaStampabile', { condomini, bolletta })

  const calculate = React.useMemo(() => {
    const totaleConsumi = Math.max(
      1,
      condomini.reduce((acc, c) => acc + (isNaN(c.consumo) ? 0 : c.consumo), 0)
    )
    const eccedenzaMC = Math.max(0, bolletta.consumoGenerale - totaleConsumi)
    console.log('Totale Bolletta', bolletta.consumoGenerale)
    console.log('Totale Consumi', totaleConsumi)
    console.log('Eccedenza MC', eccedenzaMC)

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

    return {
      totaleConsumi,
      quotaEccedenza,
      quotaVariabileTotale,
      giorniPerAppartamento,
    }
  }, [
    bolletta.consumoGenerale,
    bolletta.importoTotale,
    bolletta.quotaFissa,
    condomini,
  ])

  console.log('Calcoli Tabella', calculate)

  const sommaConsumo = React.useMemo(
    () => condomini.reduce((a, c) => a + c.consumo, 0),
    [condomini]
  )
  let sommaQuotaFissa = 0
  let sommaQuotaVariabile = 0
  let sommaEccedenza = 0
  let sommaTotale = 0

  const handleEsportaPDF = () => {
    if (!bolletta.dataScadenza) {
      alert('Imposta una data di scadenza per esportare in PDF.')
      return
    }
    exportToPDF({
      bolletta,
      tableRef,
    })
  }

  if (!condomini.length || condomini.length === 0) {
    return (
      <div className="text-gery-600 my-6 p-4">
        <p className="text-center text-lg font-semibold italic">
          Nessun condomino presente. Per favore, aggiungi dei condomini per
          visualizzare la tabella.
        </p>
      </div>
    )
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
                giorni / (calculate.giorniPerAppartamento[c.appartamento] || 1)
              const quotaFissaIndividuale =
                bolletta.quotaFissa * percentualePermanenza

              const quotaVar =
                (c.consumo / calculate.totaleConsumi) *
                  calculate.quotaVariabileTotale || 0
              const eccedenza =
                calculate.quotaEccedenza / bolletta.numeroCondomini || 0
              const imposteIndividuali =
                bolletta.imposte / bolletta.numeroCondomini
              const costiAggiuntiviIndividuali =
                bolletta.costiAggiuntivi / bolletta.numeroCondomini

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
