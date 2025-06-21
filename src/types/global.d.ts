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
  quotaFissa: number
  consumoGenerale: number
  costiAggiuntivi: number
  imposte: number
  dataInizio: string
  dataFine: string
  dataScadenza: string
  contatoreIniziale: number
  contatoreFinale: number
  numeroCondomini: number
  totaleConsumi: number
}
