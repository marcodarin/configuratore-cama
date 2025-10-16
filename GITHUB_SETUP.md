# Setup Repository GitHub

## Istruzioni per pubblicare il progetto

### Opzione 1: Creazione Repository da GitHub Web

1. **Vai su GitHub**: https://github.com/marcodarin
2. **Clicca "New repository"**
3. **Nome repository**: `configuratore-cama`
4. **Descrizione**: `Configuratore tende a rullo con AI per Cama`
5. **Visibilità**: Scegli Public o Private
6. **NON inizializzare** con README, .gitignore o license (già presenti nel progetto)
7. **Clicca "Create repository"**

### Opzione 2: Creazione Repository da Terminale (se hai GitHub CLI)

```bash
# Installa GitHub CLI se non presente
brew install gh

# Login a GitHub
gh auth login

# Crea il repository
gh repo create marcodarin/configuratore-cama --public --description "Configuratore tende a rullo con AI per Cama"
```

### Push del Codice

Dopo aver creato il repository, esegui:

```bash
cd "/Users/marcodarinzanco/Downloads/cama - configuratore"

# Se hai già aggiunto il remote (già fatto)
git push -u origin main

# Se serve rimuovere e riaggiungere il remote
git remote remove origin
git remote add origin https://github.com/marcodarin/configuratore-cama.git
git push -u origin main
```

### Autenticazione GitHub

Se richiesta l'autenticazione:

#### Token Personal Access (Raccomandato)
1. Vai su GitHub → Settings → Developer settings → Personal access tokens
2. Crea un nuovo token con permessi `repo`
3. Usa il token come password quando richiesto

#### GitHub CLI (Più semplice)
```bash
gh auth login
# Segui le istruzioni per autenticarti
```

### Verifica Pubblicazione

Una volta completato il push, il repository sarà disponibile su:
**https://github.com/marcodarin/configuratore-cama**

## Deploy Automatico su Vercel

Dopo la pubblicazione su GitHub:

1. **Connetti Vercel**: https://vercel.com/new
2. **Importa repository**: `marcodarin/configuratore-cama`
3. **Configura variabili d'ambiente**:
   - `GOOGLE_GEMINI_API_KEY`: La tua API key
   - `NEXT_PUBLIC_BASE_URL`: URL del deploy Vercel
4. **Deploy automatico** ad ogni push su main

## Repository Struttura

```
configuratore-cama/
├── README.md              # Documentazione principale
├── DEPLOYMENT.md          # Guida deploy
├── GITHUB_SETUP.md        # Questa guida
├── package.json           # Dipendenze
├── next.config.js         # Configurazione Next.js
├── src/                   # Codice sorgente
├── public/fabrics/        # Immagini tessuti
└── public/uploads/        # Render generati
```
