import type { Bolletta } from '@/types'

interface Props {
  bolletta: Bolletta
  setBolletta: React.Dispatch<React.SetStateAction<Bolletta>>
}

export default function RipartizioneBolletta({
  bolletta,
  setBolletta,
}: Readonly<Props>) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Invio dati bolletta', bolletta)
    const numeroCondomini = bolletta.numeroCondomini
    const totale = bolletta.importoTotale
    const fissa = bolletta.quotaFissa / numeroCondomini
    const costiAggiuntivi = bolletta.costiAggiuntivi / numeroCondomini
    const imposte = bolletta.imposte / numeroCondomini
    const contIniz = bolletta.contatoreIniziale ?? 0
    const contFin = bolletta.contatoreFinale ?? 0
    const consumo = Math.max(0, contFin - contIniz)

    console.log('Calcolo ripartizione bolletta', {
      numeroCondomini,
      totale,
      fissa,
      costiAggiuntivi,
      imposte,
      contIniz,
      contFin,
      consumo,
    })
    if (!isNaN(totale) && !isNaN(fissa) && !isNaN(consumo)) {
      setBolletta((prev) => ({
        ...prev,
        consumoGenerale: consumo,
        totaleConsumi: consumo,
        importoTotale: totale,
        quotaFissa: fissa,
        costiAggiuntivi: costiAggiuntivi,
        imposte: imposte,
      }))
    }
  }

  return (
    <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold">Dati Bolletta Acqua Generale</h2>
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
      <p className="text-center text-gray-400">Periodo bolletta</p>
      <div className="flex flex-col gap-2 rounded-lg border border-gray-200 p-4">
        <div className="flex w-full items-center justify-between gap-2">
          <label htmlFor="dataInizio">Data inizio bolletta: </label>
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
          <label htmlFor="dataFine">Data fine bolletta: </label>
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
      <div className="flex w-full items-center justify-between gap-2">
        <label htmlFor="dataFine">Data scadenza bolletta: </label>
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
      <div className="flex justify-end">
        <span className="text-lg font-semibold">
          Consumo generale calcolato:{' '}
          {Math.max(0, bolletta.contatoreFinale - bolletta.contatoreIniziale)}{' '}
          mc
        </span>
      </div>
      <div className="flex justify-end">
        <button
          className="cursor-pointer rounded bg-green-500 px-4 py-1 text-white hover:bg-green-700"
          type="submit"
        >
          Calcola ripartizione
        </button>
      </div>
    </form>
  )
}
