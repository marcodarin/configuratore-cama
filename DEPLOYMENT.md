# Guida al Deploy - Configuratore Tende Cama

## Setup Rapido

### 1. Configurazione Locale

```bash
# Clona o scarica il progetto
# Installa dipendenze
npm install

# Copia e configura le variabili d'ambiente
cp env.example .env.local
```

Modifica `.env.local`:
```env
GOOGLE_GEMINI_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 2. Aggiungere Tessuti

Aggiungi immagini di tessuti nella cartella `public/fabrics/`:
```bash
public/fabrics/
├── cotone-bianco.jpg
├── lino-naturale.png
├── seta-blu.webp
└── canvas-grigio.jpg
```

Il nome del file diventerà il nome del tessuto nell'interfaccia.

### 3. Avvio Locale

```bash
npm run dev
```

Apri http://localhost:3000

## Deploy su Vercel

### 1. Setup Repository

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/tuousername/cama-configuratore.git
git push -u origin main
```

### 2. Deploy Vercel

1. Vai su [vercel.com](https://vercel.com)
2. Importa il repository GitHub
3. Configura le variabili d'ambiente:
   - `GOOGLE_GEMINI_API_KEY`: La tua chiave API Google Gemini
   - `NEXT_PUBLIC_BASE_URL`: URL del deploy (es: https://cama-configuratore.vercel.app)

### 3. Deploy Automatico

Vercel effettuerà il deploy automaticamente ad ogni push su main.

## Ottenere la API Key Google Gemini

1. Vai su [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea un nuovo progetto o seleziona esistente
3. Genera una nuova API key
4. Copia la chiave in `.env.local` (locale) o nelle variabili d'ambiente Vercel

## Test dell'Applicazione

### Funzionalità da Testare:

1. **Caricamento Tessuti**: Aggiungi immagini in `public/fabrics` e verifica che compaiano
2. **Upload Immagine**: Testa il drag & drop e la selezione file
3. **Selezione Tessuto**: Verifica che la selezione funzioni
4. **Generazione Render**: Testa con API key valida
5. **Responsive**: Testa su mobile e desktop

### Risoluzione Problemi:

- **Tessuti non caricano**: Verifica che le immagini siano in `public/fabrics` con estensioni supportate
- **Upload non funziona**: Controlla la dimensione del file (max 10MB)
- **Render non genera**: Verifica la validità della API key Google Gemini
- **Build fallisce**: Controlla gli errori ESLint e TypeScript

## Prossimi Sviluppi Suggeriti

1. **Integrazione Servizi Immagini**: Midjourney, DALL-E, Stable Diffusion
2. **Cache Render**: Salvare render già generati
3. **Autenticazione**: Sistema login utenti
4. **Database**: Salvare preferenze e cronologia
5. **E-commerce**: Integrazione per ordinazione tende

## Supporto

Per problemi tecnici o miglioramenti, consultare:
- [Documentazione Next.js](https://nextjs.org/docs)
- [Google Gemini API](https://ai.google.dev/docs)
- [Shadcn/ui](https://ui.shadcn.com)
- [Vercel Deploy Guide](https://vercel.com/docs)
