import { useState } from 'react'

import type { Condomino } from '@/types'

interface Props {
  onSubmit: (aggiornamenti: Partial<Condomino>) => void
}

export default function CondominoForm({ onSubmit }: Readonly<Props>) {
  const [nome, setNome] = useState('')
  const [appartamento, setAppartamento] = useState('')
  const [proprietario, setProprietario] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (nome.trim()) {
      onSubmit({
        nome: nome.trim(),
        appartamento,
        proprietario,
      })
      setNome('')
      setAppartamento('')
      setProprietario(false)
    }
  }

  return (
    <form className="flex w-full flex-col gap-2" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold">Inserimento Condomini</h2>
      <hr className="my-4" />
      <div className="flex w-full items-center justify-center gap-2">
        <input
          placeholder="Nome condomino"
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <select
          value={appartamento}
          onChange={(e) => setAppartamento(e.target.value)}
        >
          <option value="">Seleziona Appartamento</option>
          <option value="A1">A1</option>
          <option value="A2">A2</option>
          <option value="T1">T1</option>
        </select>
        <label htmlFor={`proprietario`}>Proprietario</label>
        <input
          checked={proprietario}
          className="max-w-5"
          id={`proprietario`}
          type="checkbox"
          onChange={(e) => setProprietario(e.target.checked)}
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
