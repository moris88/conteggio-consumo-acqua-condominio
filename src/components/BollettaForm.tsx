import React from 'react'

import type { Bolletta } from '@/types'

const oggi = new Date()
const treMesiFa = new Date()
treMesiFa.setMonth(oggi.getMonth() - 3)
const bollettaInital: Bolletta = {
  importoTotale: 0,
  quotaFissa: 0,
  consumoGenerale: 0,
  costiAggiuntivi: 0,
  imposte: 0,
  contatoreIniziale: 0,
  contatoreFinale: 0,
  dataInizio: treMesiFa.toISOString().split('T')[0],
  dataFine: oggi.toISOString().split('T')[0],
  dataScadenza: '',
}

interface Props {
  onChange: (bolletta: Bolletta) => void
  onError?: () => void
}

export default function BollettaForm({
  onChange,
  onError = () => {},
}: Readonly<Props>) {
  const [bolletta, setBolletta] = React.useState<Bolletta>(bollettaInital)

  const consumo = React.useMemo(() => {
    const contIniz = isNaN(bolletta.contatoreIniziale)
      ? 0
      : bolletta.contatoreIniziale
    const contFin = isNaN(bolletta.contatoreFinale)
      ? 0
      : bolletta.contatoreFinale
    return Math.max(0, contFin - contIniz)
  }, [bolletta.contatoreIniziale, bolletta.contatoreFinale])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (consumo >= 0) {
      onChange({
        ...bolletta,
        consumoGenerale: consumo,
      })
    } else {
      alert(
        'Per favore, assicurati che tutti i campi siano compilati correttamente.'
      )
      onError()
    }
  }

  return (
    <form className="flex w-full flex-col gap-2" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold">Dati Bolletta Acqua Generale</h2>
      <hr className="my-4" />
      <p className="text-center text-gray-400">Dati principali</p>
      <div className="flex flex-col gap-2 rounded-lg border border-gray-200 p-4">
        <div className="flex w-full items-center justify-between gap-2">
          <label htmlFor="importoTotale">Importo totale bolletta (€): </label>
          <input
            className="max-w-1/2"
            id="importoTotale"
            placeholder="Importo totale bolletta (€)"
            type="number"
            value={bolletta.importoTotale}
            onChange={(e) =>
              setBolletta((prev) => ({
                ...prev,
                importoTotale: parseFloat(e.target.value),
              }))
            }
          />
        </div>
        <div className="flex w-full items-center justify-between gap-2">
          <label htmlFor="quotaFissa">Quota fissa totale (€): </label>
          <input
            className="max-w-1/2"
            id="quotaFissa"
            placeholder="Quota fissa totale (€)"
            type="number"
            value={bolletta.quotaFissa}
            onChange={(e) =>
              setBolletta((prev) => ({
                ...prev,
                quotaFissa: parseFloat(e.target.value),
              }))
            }
          />
        </div>
        <div className="flex w-full items-center justify-between gap-2">
          <label htmlFor="tasse">Tasse e imposte fisse (€): </label>
          <input
            className="max-w-1/2"
            id="tasse"
            placeholder="Tasse e imposte fisse (€)"
            type="number"
            value={bolletta.imposte}
            onChange={(e) =>
              setBolletta((prev) => ({
                ...prev,
                imposte: parseFloat(e.target.value),
              }))
            }
          />
        </div>
        <div className="flex w-full items-center justify-between gap-2">
          <label htmlFor="costiAddizionali">Costi addizionali (€): </label>
          <input
            className="max-w-1/2"
            id="costiAddizionali"
            placeholder="Costi addizionali (€)"
            type="number"
            value={bolletta.costiAggiuntivi}
            onChange={(e) =>
              setBolletta((prev) => ({
                ...prev,
                costiAggiuntivi: parseFloat(e.target.value),
              }))
            }
          />
        </div>
      </div>
      <p className="text-center text-gray-400">Consumo generale</p>
      <div className="flex flex-col gap-2 rounded-lg border border-gray-200 p-4">
        <div className="flex w-full items-center justify-between gap-2">
          <label htmlFor="contatoreIniziale">
            Lettura contatore generale precedente (mc):{' '}
          </label>
          <input
            className="max-w-1/2"
            id="contatoreIniziale"
            placeholder="Lettura contatore generale precedente (mc)"
            type="number"
            value={bolletta.contatoreIniziale}
            onChange={(e) =>
              setBolletta((prev) => ({
                ...prev,
                contatoreIniziale: parseFloat(e.target.value),
              }))
            }
          />
        </div>
        <div className="flex w-full items-center justify-between gap-2">
          <label htmlFor="contatoreFinale">
            Ultima lettura contatore generale (mc):{' '}
          </label>
          <input
            className="max-w-1/2"
            id="contatoreFinale"
            placeholder="Ultima lettura contatore generale (mc)"
            type="number"
            value={bolletta.contatoreFinale}
            onChange={(e) =>
              setBolletta((prev) => ({
                ...prev,
                contatoreFinale: parseFloat(e.target.value),
              }))
            }
          />
        </div>
      </div>
      <p className="text-center text-gray-400">Periodo Riferimento</p>
      <div className="flex flex-col gap-2 rounded-lg border border-gray-200 p-4">
        <div className="flex w-full items-center justify-between gap-2">
          <label htmlFor="dataInizio">Data inizio riferimento: </label>
          <input
            className="max-w-1/2"
            id="dataInizio"
            type="date"
            value={bolletta.dataInizio}
            onChange={(e) =>
              setBolletta((prev) => ({
                ...prev,
                dataInizio: e.target.value,
              }))
            }
          />
        </div>
        <div className="flex w-full items-center justify-between gap-2">
          <label htmlFor="dataFine">Data fine riferimento: </label>
          <input
            className="max-w-1/2"
            id="dataFine"
            type="date"
            value={bolletta.dataFine}
            onChange={(e) =>
              setBolletta((prev) => ({
                ...prev,
                dataFine: e.target.value,
              }))
            }
          />
        </div>
      </div>
      <p className="text-center text-gray-400">Scadenza pagamento</p>
      <div className="flex flex-col gap-2 rounded-lg border border-gray-200 p-4">
        <div className="flex w-full items-center justify-between gap-2">
          <label htmlFor="dataFine">Data scadenza: </label>
          <input
            className="max-w-1/2"
            id="dataScadenza"
            type="date"
            value={bolletta.dataScadenza}
            onChange={(e) =>
              setBolletta((prev) => ({
                ...prev,
                dataScadenza: e.target.value,
              }))
            }
          />
        </div>
      </div>
      <div className="flex justify-end">
        <span className="text-lg font-semibold">
          Consumo generale calcolato: {Math.max(0, consumo)} mc
        </span>
      </div>
      <div className="flex justify-end">
        <button
          className="cursor-pointer rounded bg-green-500 px-4 py-1 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={consumo === 0}
          type="submit"
        >
          Calcola ripartizione
        </button>
      </div>
    </form>
  )
}
