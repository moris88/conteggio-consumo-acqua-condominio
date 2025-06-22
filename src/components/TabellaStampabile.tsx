import React from 'react'

import type { Bolletta, Condomino } from '@/types'
import { exportToPDF, getGiorni } from '@/utils'

interface Props {
  condomini: Condomino[]
  bolletta: Bolletta
}

export default function TabellaStampabile({
  condomini,
  bolletta,
}: Readonly<Props>) {
  const tableRef = React.useRef<HTMLDivElement>(null)

  const datiCalcolati = React.useMemo(() => {
    const totaleConsumi = Math.max(
      1,
      condomini.reduce((sum, c) => sum + (isNaN(c.consumo) ? 0 : c.consumo), 0)
    )

    const {
      importoTotale,
      quotaFissa,
      imposte,
      consumoGenerale,
      dataInizio,
      dataFine,
    } = bolletta

    const totaleQuotaVariabileEccedenza = importoTotale - quotaFissa - imposte
    const costoUnitario = totaleQuotaVariabileEccedenza / totaleConsumi
    const eccedenzaMC = Math.max(0, consumoGenerale - totaleConsumi)
    const quotaEccedenza = costoUnitario * eccedenzaMC
    const quotaVariabileTotale = totaleQuotaVariabileEccedenza - quotaEccedenza

    const giorniPerAppartamento: Record<string, number> = {}
    for (const c of condomini) {
      const giorni = getGiorni(c.inizio, c.fine)
      giorniPerAppartamento[c.appartamento] =
        (giorniPerAppartamento[c.appartamento] || 0) + giorni
    }

    const giorniTotali =
      dataInizio && dataFine ? getGiorni(dataInizio, dataFine) : 0

    return {
      totaleConsumi,
      eccedenzaMC,
      quotaEccedenza,
      quotaVariabileTotale,
      giorniPerAppartamento,
      giorniTotali,
    }
  }, [bolletta, condomini])

  const handleEsportaPDF = () => {
    if (!bolletta?.dataScadenza) {
      alert('Imposta una data di scadenza per esportare in PDF.')
      return
    }
    exportToPDF({ dataScadenza: bolletta.dataScadenza, tableRef })
  }

  const nCondominiSenzaEccedenza =
    condomini.filter((c) => !c.eccedenza).length || 1
  const nConsumatori = condomini.filter((c) => c.consumo > 0).length || 1

  let sommaQuotaFissa = 0
  let sommaQuotaVariabile = 0
  let sommaEccedenza = 0
  let sommaTotale = 0

  return (
    <>
      <div
        ref={tableRef}
        className="mt-6 overflow-y-auto bg-white p-2 text-black"
      >
        <h2 className="my-2 text-xl font-semibold">Tabella Ripartizione</h2>

        <table className="w-full border-collapse border border-black text-sm">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Contatore Precedente</th>
              <th>Ultima Lettura</th>
              <th>Consumo (mc)</th>
              <th>Quota fissa (€)</th>
              <th>Quota variabile (€)</th>
              <th>Eccedenza (€)</th>
              <th>Imposte (€)</th>
              <th>Sub Totale (€)</th>
              <th>Costi agg. (€)</th>
              <th>Totale (€)</th>
            </tr>
          </thead>
          <tbody>
            {condomini.map((c) => {
              const giorni = getGiorni(c.inizio, c.fine)
              const giorniApp =
                datiCalcolati.giorniPerAppartamento[c.appartamento] || 1
              const percentuale = giorni / giorniApp

              let quotaFissa = bolletta?.quotaFissa / nCondominiSenzaEccedenza
              if (giorniApp < datiCalcolati.giorniTotali) {
                quotaFissa *= percentuale
              }

              const quotaVar =
                (c.consumo / datiCalcolati.totaleConsumi) *
                  datiCalcolati.quotaVariabileTotale || 0
              const eccedenza =
                c.eccedenza || c.consumo === 0
                  ? 0
                  : datiCalcolati.quotaEccedenza / nConsumatori

              const imposte =
                (bolletta.imposte / nCondominiSenzaEccedenza) * percentuale
              const costiAgg =
                (bolletta.costiAggiuntivi / nCondominiSenzaEccedenza) *
                percentuale

              const totale =
                quotaFissa + quotaVar + eccedenza + imposte + costiAgg

              sommaQuotaFissa += quotaFissa
              sommaQuotaVariabile += quotaVar
              sommaEccedenza += eccedenza
              sommaTotale += totale

              return (
                <tr key={c.id}>
                  <td>
                    {c.nome} ({c.appartamento})
                  </td>
                  <td>{c.contatoreIniziale}</td>
                  <td>{c.contatoreFinale}</td>
                  <td>{c.consumo}</td>
                  <td>{quotaFissa.toFixed(2)}</td>
                  <td>{quotaVar.toFixed(2)}</td>
                  <td>{eccedenza.toFixed(2)}</td>
                  <td>{imposte.toFixed(2)}</td>
                  <td>{(totale - costiAgg).toFixed(2)}</td>
                  <td>{costiAgg.toFixed(2)}</td>
                  <td className="bg-green-200 font-bold">
                    {totale.toFixed(2)}
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="font-semibold">
              <td className="text-right" colSpan={3}>
                Totale
              </td>
              <td>{datiCalcolati.totaleConsumi}</td>
              <td>{sommaQuotaFissa.toFixed(2)}</td>
              <td>{sommaQuotaVariabile.toFixed(2)}</td>
              <td>{sommaEccedenza.toFixed(2)}</td>
              <td>{bolletta?.imposte?.toFixed(2)}</td>
              <td>{(sommaTotale - bolletta.costiAggiuntivi).toFixed(2)}</td>
              <td>{bolletta.costiAggiuntivi.toFixed(2)}</td>
              <td className="bg-yellow-200">{sommaTotale.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        <div className="mt-4 space-y-2 text-sm">
          <p>
            <strong>Scadenza fattura:</strong>{' '}
            <i>
              {bolletta?.dataScadenza ? (
                new Date(bolletta.dataScadenza).toLocaleDateString()
              ) : (
                <span className="text-red-500">{'Non impostata'}</span>
              )}
            </i>
          </p>
          <p>
            <strong>Consumo Cont. Generale:</strong> {bolletta.consumoGenerale}{' '}
            mc ({(sommaQuotaVariabile + sommaEccedenza).toFixed(2)} €)
          </p>
          <p>
            <strong>Consumo Condomini:</strong> {datiCalcolati.totaleConsumi} mc
            ({sommaQuotaVariabile.toFixed(2)} €)
          </p>
          <p>
            <strong>Eccedenza:</strong> {datiCalcolati.eccedenzaMC} mc (
            {sommaEccedenza.toFixed(2)} €){' '}
            <i>suddiviso per condomini consumatori</i>
          </p>
          <p>
            <strong>Imposte fisse:</strong> {bolletta.imposte.toFixed(2)} €
          </p>
          <p>
            <strong>Quota fissa totale:</strong> {sommaQuotaFissa.toFixed(2)} €
          </p>
          <p>
            <strong>Costi aggiuntivi (Commissione bollettino postale):</strong>{' '}
            {bolletta.costiAggiuntivi.toFixed(2)} €
          </p>
        </div>
      </div>

      <div className="flex w-full justify-end">
        <button
          className="mb-4 rounded bg-blue-600 px-4 py-1 text-white hover:bg-blue-700 disabled:opacity-50"
          disabled={condomini.length === 0 || !bolletta?.dataScadenza}
          onClick={handleEsportaPDF}
        >
          Esporta PDF
        </button>
      </div>
    </>
  )
}
