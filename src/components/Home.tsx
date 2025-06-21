import { useState } from 'react'

import {
  CondominoForm,
  ContatoriForm,
  RipartizioneBolletta,
  TabellaStampabile,
} from '@/components'
import type { Bolletta, Condomino } from '@/types'

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
  numeroCondomini: 0,
  totaleConsumi: 0,
}

function Home() {
  const [condomini, setCondomini] = useState<Condomino[]>([])
  const [bolletta, setBolletta] = useState<Bolletta>(bollettaInital)

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
    setBolletta((prev) => ({
      ...prev,
      numeroCondomini: condominiAggiornati.filter((c) => !c.proprietario)
        .length,
    }))
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
          setBolletta((prev) => ({
            ...prev,
            numeroCondomini: condomini.filter((c) => !c.proprietario).length,
          }))
          setCondomini(condomini.filter((c) => c.id !== id))
        }}
      />
      <RipartizioneBolletta bolletta={bolletta} setBolletta={setBolletta} />
      <TabellaStampabile bolletta={bolletta} condomini={condomini} />
    </div>
  )
}

export default Home
