export function calcolaPercentualeGiorni(
  c: { inizio?: string; fine?: string },
  dataInizioPeriodo: Date,
  dataFinePeriodo: Date
): number {
  if (!c.inizio || !c.fine) return 1 // considera intero periodo

  const inizio = new Date(c.inizio)
  const fine = new Date(c.fine)

  const effInizio = inizio < dataInizioPeriodo ? dataInizioPeriodo : inizio
  const effFine = fine > dataFinePeriodo ? dataFinePeriodo : fine

  const giorniTotali = Math.max(
    1,
    (dataFinePeriodo.getTime() - dataInizioPeriodo.getTime()) /
      (1000 * 3600 * 24) +
      1
  )
  const giorniEffettivi = Math.max(
    0,
    (effFine.getTime() - effInizio.getTime()) / (1000 * 3600 * 24) + 1
  )

  return giorniEffettivi / giorniTotali
}
