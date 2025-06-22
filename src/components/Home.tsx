import { useState } from 'react'

import {
  BollettaForm,
  CondominoForm,
  ContatoriForm,
  TabellaStampabile,
} from '@/components'
import type { Bolletta, Condomino } from '@/types'

function Home() {
  const [condomini, setCondomini] = useState<Condomino[]>([])
  const [bolletta, setBolletta] = useState<Bolletta>()

  const handleAggiungiCondomino = (aggiornamenti: Partial<Condomino>) => {
    const nuovo = {
      id: Date.now(),
      ...aggiornamenti,
      contatoreIniziale: 0,
      contatoreFinale: 0,
      consumo: 0,
      inizio: new Date().toISOString().split('T')[0],
      fine: new Date().toISOString().split('T')[0],
    } as Condomino
    const condominiAggiornati = [...condomini, nuovo]
    setCondomini(condominiAggiornati)
  }

  const handleAggiornaCondomino = (
    id: number,
    aggiornamenti: Partial<Condomino>
  ) => {
    setCondomini((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              ...aggiornamenti,
              consumo:
                (aggiornamenti.contatoreFinale ?? 0) -
                (aggiornamenti.contatoreIniziale ?? 0),
            }
          : c
      )
    )
  }

  const isCorrectBolletta =
    bolletta &&
    bolletta.importoTotale > 0 &&
    bolletta.quotaFissa >= 0 &&
    bolletta.imposte >= 0 &&
    bolletta.contatoreIniziale >= 0 &&
    bolletta.contatoreFinale >= 0

  return (
    <div className="mx-auto max-w-screen space-y-6 p-4 lg:max-w-5xl">
      <h1 className="text-center text-2xl font-bold">
        Gestione Consumo Acqua Condominiale
      </h1>
      <CondominoForm onSubmit={handleAggiungiCondomino} />
      <ContatoriForm
        condomini={condomini}
        onChange={handleAggiornaCondomino}
        onDelete={(id) => {
          setCondomini(condomini.filter((c) => c.id !== id))
        }}
      />
      <BollettaForm
        onChange={(bollettaAggiornata) => {
          setBolletta(bollettaAggiornata)
        }}
        onError={() => setBolletta(undefined)}
      />
      {condomini.length === 0 && (
        <p className="text-center text-red-500">
          Per visualizzare la tabella stampabile, aggiungi i condomini.
        </p>
      )}
      {!isCorrectBolletta && (
        <p className="text-center text-red-500">
          Per visualizzare la tabella stampabile, completa i dati della
          bolletta.
        </p>
      )}
      {bolletta && (
        <TabellaStampabile bolletta={bolletta} condomini={condomini} />
      )}
    </div>
  )
}

export default Home
