# Dica Dev: Blog Tech

![screen](/public/noproject/criandoGIFcomImagens_by_Brenno.gif)

Benvenuto su **Dica-Dev**! Questo è un blog tech con consigli per sviluppatori di software. I post del blog sono generati dalle issues del repository GitHub di questo progetto.

## Tecnologie Utilizzate

- [Next.js](https://nextjs.org/): Framework React per il rendering lato server e la generazione di siti statici.
- [Biome.js](https://biomejs.dev/): Strumento per il linting e la formattazione del codice.
- [Tailwind CSS](https://tailwindcss.com/docs/guides/nextjs): Framework CSS utilitario per una rapida stilizzazione.
- [CSS Modules](): Per il scope locale del CSS.
- [TypeScript](https://www.typescriptlang.org/): Superset di JavaScript che aggiunge la tipizzazione statica al codice.
- [Axios](https://axios-http.com/docs/intro#:~:text=What%20is%20Axios?%20Axios%20is%20a%20promise-based%20HTTP%20Client%20for): Client HTTP per effettuare richieste all'API di GitHub.
- [date-fns](https://date-fns.org/): Libreria per la manipolazione e la formattazione delle date.
- [API de Contexto do React](https://react.dev/reference/react/useContext): Per la gestione dello stato globale.
- [React Hook](https://react.dev/reference/react/hooks): Per gestire lo stato e gli effetti collaterali in React.

## Funzionalità

- **Post del Blog**: Le issues del repository GitHub sono utilizzate come post del blog. Ogni issue creata nel repository diventa un nuovo articolo sul blog.
- **Interfaccia Frontend**: Costruita con Next.js, Tailwind CSS e CSS Modules per un'esperienza utente moderna e reattiva.
- **Richieste all'API di GitHub**: Utilizza Axios per recuperare tutte le issues dal repository e visualizzarle come post del blog.

## Come Eseguire il Progetto

1. Clona il repository:
   ```bash
   git clone https://github.com/brennoclins/dica-dev.git
   ```

2. Installa le dipendenze:
    ```bash
    cd dica-dev
    npm install
    ```

3. Configura le variabili d’ambiente: Crea un file **.env.local** nella radice del progetto e aggiungi le seguenti variabili:
    ```bash
    NEXT_PUBLIC_GITHUB_USER=brennoclins
    NEXT_PUBLIC_GITHUB_REPO=dica-dev
    ```

4. Esegui il progetto:
    ```bash
    npm run dev
    ```

5. Accedi al progetto nel browser:
    ```bash
    http://localhost:3000
    ```

## Contributi
I contributi sono benvenuti! Sentiti libero di aprire issues e pull requests.


## Link del Blog
- [Accedi al blog: Dica-Dev](https://dica-dev.vercel.app/)