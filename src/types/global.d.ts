export interface Condomino {
  id: number
  nome: string
  contatoreIniziale: number
  contatoreFinale: number
  consumo: number
  inizio: string
  fine: string
  appartamento: string
  proprietario: boolean
}

export interface Bolletta {
  importoTotale: number
  consumoGenerale: number
  readonly quotaFissa: number
  readonly costiAggiuntivi: number
  readonly imposte: number
  readonly dataInizio: string
  readonly dataFine: string
  readonly dataScadenza: string
  readonly contatoreIniziale: number
  readonly contatoreFinale: number
}
