import { useState } from 'react'

import type { Condomino } from '@/types'

interface Props {
  onSubmit: (aggiornamenti: Partial<Condomino>) => void
}

export default function CondominoForm({ onSubmit }: Readonly<Props>) {
  const [nome, setNome] = useState('')
  const [appartamento, setAppartamento] = useState('')
  const [eccedenza, setEccedenza] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (nome.trim()) {
      onSubmit({
        nome: nome.trim(),
        appartamento,
        eccedenza,
      })
      setNome('')
      setAppartamento('')
      setEccedenza(false)
    }
  }

  return (
    <form className="flex w-full flex-col gap-2" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold">Inserimento Condomini</h2>
      <hr className="my-4" />
      <div className="flex w-full items-center justify-center gap-2">
        <input
          placeholder="Cognome del condomino"
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          placeholder="Inserisci un identificativo dell'appartamento"
          type="text"
          value={appartamento}
          onChange={(e) => setAppartamento(e.target.value)}
        />
        <label htmlFor={`eccedenza`}>
          Non rientra nei calcoli di eccedenza?
        </label>
        <input
          checked={eccedenza}
          className="max-w-5"
          id={`eccedenza`}
          type="checkbox"
          onChange={(e) => setEccedenza(e.target.checked)}
        />
        <button
          className="cursor-pointer rounded bg-blue-600 px-4 py-1 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
        >
          Aggiungi
        </button>
      </div>
    </form>
  )
}
