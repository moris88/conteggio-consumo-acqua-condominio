import { Star, Trash, User } from 'iconoir-react'
import React from 'react'

import type { Condomino } from '@/types'

interface Props {
  condomini: Condomino[]
  onChange: (id: number, aggiornamenti: Partial<Condomino>) => void
  onDelete: (id: number) => void
}

export default function ContatoriForm({
  condomini,
  onChange,
  onDelete,
}: Readonly<Props>) {
  return (
    <div className="flex w-full flex-col gap-2">
      <h2 className="text-xl font-semibold">Consumo Acqua per Condomino</h2>
      <hr className="my-4" />
      {condomini.map((c) => (
        <React.Fragment key={c.id}>
          <div className="flex items-center justify-between gap-2 overflow-hidden">
            <span className="flex items-center gap-2 rounded-lg border bg-amber-200 px-2 py-1 text-sm">
              {!c.proprietario && <User className="h-4 w-4 shrink-0" />}
              {c.proprietario && <Star className="h-4 w-4 shrink-0" />}
              <span className="max-w-[100px] truncate">{c.nome}</span>
              <span className="max-w-[100px] truncate">
                {' - '}
                {c.appartamento}
              </span>
            </span>
            <button
              className="cursor-pointer rounded border border-black bg-red-200 px-3 py-1 text-black hover:bg-red-700 hover:text-white"
              onClick={() => onDelete(c.id)}
            >
              <Trash className="h-4 w-4" />
            </button>
          </div>
          <div key={c.id} className="my-2 grid w-full grid-cols-5 gap-2 py-2">
            <div className="col-span-2 flex flex-wrap items-end gap-1 text-sm">
              <label htmlFor={`contatoreIniziale-${c.id}`}>
                Contatore Lettura Iniziale
              </label>
              <input
                className="w-20"
                id={`contatoreIniziale-${c.id}`}
                type="number"
                value={c.contatoreIniziale}
                onChange={(e) =>
                  onChange(c.id, {
                    ...c,
                    contatoreIniziale: parseFloat(e.target.value),
                  })
                }
              />
              <label htmlFor={`contatoreFinale-${c.id}`}>
                Contatore Lettura Finale
              </label>
              <input
                className="w-20"
                type="number"
                value={c.contatoreFinale}
                onChange={(e) =>
                  onChange(c.id, {
                    ...c,
                    contatoreFinale: parseFloat(e.target.value),
                  })
                }
              />
            </div>

            <div className="col-span-2 flex flex-wrap items-end gap-1 text-sm">
              <label htmlFor={`inizio-${c.id}`}>Data Inizio</label>
              <input
                className="w-28"
                type="date"
                value={c.inizio}
                onChange={(e) =>
                  onChange(c.id, {
                    ...c,
                    inizio: e.target.value,
                  })
                }
              />
              <label htmlFor={`fine-${c.id}`}>Data Fine</label>
              <input
                className="w-28"
                type="date"
                value={c.fine}
                onChange={(e) =>
                  onChange(c.id, {
                    ...c,
                    fine: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex flex-col items-end justify-end text-sm">
              <span>Consumo</span>
              <span className="mt-2 rounded-lg border bg-amber-200 px-2 py-1">
                {!isNaN(c.contatoreFinale) && !isNaN(c.contatoreIniziale)
                  ? c.contatoreFinale - c.contatoreIniziale
                  : 0}
                {` mc`}
              </span>
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}
