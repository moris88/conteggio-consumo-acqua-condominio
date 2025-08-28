# Conteggio Consumo Acqua Condominio

Questa è una semplice applicazione web progettata per semplificare il calcolo e la ripartizione dei costi delle bollette dell'acqua in un condominio. L'applicazione aiuta amministratori o condomini a gestire i consumi in modo equo e trasparente, calcolando la quota di ogni utente in base alle letture dei singoli contatori.

## Funzionalità Principali

- **Inserimento Dati Bolletta**: Permette di inserire i dati generali della bolletta dell'acqua, come il costo totale e il totale dei metri cubi fatturati.
- **Gestione Condomini**: Aggiunge o modifica i nominativi dei condomini presenti.
- **Registrazione Letture**: Associa a ogni condomino la lettura del proprio contatore.
- **Calcolo Automatico**: Calcola la quota che ogni condomino deve pagare in base al consumo individuale.
- **Tabella Stampabile**: Genera una tabella riepilogativa chiara e pronta per la stampa con il dettaglio dei costi per ciascun condomino.

## Tecnologie Utilizzate

- **Frontend**: React, TypeScript
- **Build Tool**: Vite
- **Linting**: ESLint
- **Code Formatting**: Prettier
- **Package Manager**: npm

## Come Iniziare

Segui questi passaggi per eseguire il progetto in locale.

### Prerequisiti

Assicurati di avere [Node.js](https://nodejs.org/) (versione 18.x o superiore) installato sul tuo sistema.

### Installazione

1. Clona la repository sul tuo computer:

    ```sh
    git clone https://github.com/tuo-username/conteggio-consumo-acqua-condominio.git
    ```

2. Entra nella directory del progetto:

    ```sh
    cd conteggio-consumo-acqua-condominio
    ```

3. Installa le dipendenze:

    ```sh
    npm install
    ```

### Utilizzo

Per avviare l'applicazione in modalità di sviluppo, esegui:

```sh
npm run dev
```

Questo comando avvierà un server di sviluppo locale. Apri il browser e vai all'indirizzo indicato nel terminale (solitamente `http://localhost:5173`).

## Build

Per creare una versione di produzione ottimizzata dell'applicazione, esegui:

```sh
npm run build
```

I file verranno generati nella cartella `dist`.
