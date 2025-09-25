# Configuratore Tende a Rullo Cama

Una webapp per generare render realistici di tende a rullo utilizzando l'AI di Google Gemini.

## Caratteristiche

- Interfaccia moderna e intuitiva
- Selezione tessuti da cartella immagini
- Upload immagini stanza con drag & drop
- **Generazione render realistici** con Google Gemini 2.5 Flash Image Preview
- Design responsive ottimizzato per mobile
- Notifiche toast per feedback utente

## Setup del Progetto

### 1. Installazione Dipendenze

```bash
npm install
```

### 2. Configurazione Variabili d'Ambiente

Copia il file `env.example` in `.env.local`:

```bash
cp env.example .env.local
```

Modifica `.env.local` con le tue credenziali:

```env
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Aggiungere Tessuti

1. Crea la cartella `public/fabrics` se non esiste
2. Aggiungi le immagini dei tessuti (JPG, PNG, WebP)
3. Il nome del file diventerà il nome del tessuto nell'interfaccia

Esempio:
```
public/fabrics/
├── cotone-bianco.jpg
├── lino-naturale.png
├── seta-blu.webp
└── canvas-grigio.jpg
```

### 4. Avvio Sviluppo

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser.

## Deploy su Vercel

### 1. Setup Repository

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy su Vercel

1. Connetti il repository a Vercel
2. Configura le variabili d'ambiente nel dashboard Vercel:
   - `GOOGLE_GEMINI_API_KEY`
   - `NEXT_PUBLIC_BASE_URL` (URL del tuo deploy)

### 3. Configurazione Dominio

Aggiorna `NEXT_PUBLIC_BASE_URL` con l'URL finale del deploy.

## Struttura del Progetto

```
src/
├── app/
│   ├── api/
│   │   ├── fabrics/         # API per ottenere lista tessuti
│   │   └── generate-render/ # API per generazione render
│   ├── layout.tsx          # Layout principale
│   └── page.tsx            # Homepage
├── components/
│   ├── ui/                 # Componenti Shadcn UI
│   ├── fabric-selector.tsx # Selezione tessuti
│   ├── render-generator.tsx # Generazione render
│   ├── room-uploader.tsx   # Upload immagini
│   └── topbar.tsx          # Header con logo
└── store/
    └── app-store.ts        # Store Zustand per stato globale
```

## Tecnologie Utilizzate

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling utility-first
- **Shadcn/ui** - Componenti UI moderni
- **Zustand** - Gestione stato globale
- **Google Gemini AI** - Generazione render con AI
- **Sonner** - Notifiche toast
- **Lucide React** - Icone

## API Endpoints

### GET /api/fabrics
Restituisce la lista dei tessuti disponibili dalla cartella `public/fabrics`.

### POST /api/generate-render
Genera un render utilizzando Google Gemini.

**Body (FormData):**
- `roomImage`: File immagine della stanza
- `fabricImagePath`: Path del tessuto selezionato

## Note per lo Sviluppo

1. **Tessuti**: Aggiungi le immagini dei tessuti nella cartella `public/fabrics`
2. **API Key**: Ottieni una chiave API Google Gemini da [Google AI Studio](https://makersuite.google.com/app/apikey)
3. **Limiti**: Controlla i limiti di rate delle API Google Gemini
4. **Immagini**: Supporta JPG, PNG, WebP fino a 10MB

## Prossimi Sviluppi

- [ ] Integrazione con servizi di generazione immagini (Midjourney, DALL-E)
- [ ] Cache dei render generati
- [ ] Sistema di autenticazione utenti
- [ ] Galleria render salvati
- [ ] Esportazione render in diversi formati
- [ ] Integrazione e-commerce per ordinazione tende