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
    const numeroCondomini = bolletta.numeroCondomini
    const totale = bolletta.importoTotale
    const fissa = bolletta.quotaFissa / numeroCondomini
    const costiAggiuntivi = bolletta.costiAggiuntivi / numeroCondomini
    const imposte = bolletta.imposte / numeroCondomini
    const contIniz = bolletta.contatoreIniziale
    const contFin = bolletta.contatoreFinale
    const consumo = Math.max(0, contFin - contIniz)

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
        <label htmlFor="importoTotale">Importo Totale: </label>
        <input
          className="max-w-1/2"
          id="importoTotale"
          placeholder="Importo totale (€)"
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
        <label htmlFor="quotaFissa">Quota Fissa: </label>
        <input
          className="max-w-1/2"
          id="quotaFissa"
          placeholder="Quota fissa (€)"
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
        <label htmlFor="contatoreIniziale">Contatore Iniziale: </label>
        <input
          className="max-w-1/2"
          id="contatoreIniziale"
          placeholder="Contatore generale iniziale"
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
        <label htmlFor="contatoreFinale">Contatore Finale: </label>
        <input
          className="max-w-1/2"
          id="contatoreFinale"
          placeholder="Contatore generale finale"
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
      <div className="flex w-full items-center justify-between gap-2">
        <label htmlFor="costiAddizionali">Costi Addizionali: </label>
        <input
          className="max-w-1/2"
          id="costiAddizionali"
          placeholder="Costi Addizionali"
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
        <label htmlFor="tasse">Tasse e Imposte: </label>
        <input
          className="max-w-1/2"
          id="tasse"
          placeholder="Tasse e Imposte"
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
        <label htmlFor="dataInizio">Data Inizio Bolletta: </label>
        <input
          className="max-w-1/2"
          id="dataInizio"
          placeholder="Data Inizio Bolletta"
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
        <label htmlFor="dataFine">Data Fine Bolletta: </label>
        <input
          className="max-w-1/2"
          id="dataFine"
          placeholder="Data Fine Bolletta"
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
      <div className="flex w-full items-center justify-between gap-2">
        <label htmlFor="dataFine">Data Scadenza Bolletta: </label>
        <input
          className="max-w-1/2"
          id="dataScadenza"
          placeholder="Data Scadenza Bolletta"
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
        <button className="cursor-pointer rounded bg-green-500 px-4 py-1 text-white hover:bg-green-700">
          Calcola ripartizione
        </button>
      </div>
    </form>
  )
}
