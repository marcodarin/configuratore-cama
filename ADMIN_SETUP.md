# Setup Admin e Database

## 1. Configurazione Database Neon

1. Il database Neon è già stato creato su Vercel
2. Le variabili d'ambiente sono automaticamente disponibili nel progetto
3. Assicurati che la variabile `DATABASE_URL` sia presente in Vercel

## 2. Inizializzazione Database

Esegui lo script per creare la tabella `fabrics`:

```bash
npx tsx scripts/init-db.ts
```

Questo creerà la tabella con la seguente struttura:
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR 255)
- `image_url` (TEXT)
- `created_at` (TIMESTAMP)

## 3. Accesso Pannello Admin

1. Vai su `/admin`
2. Password: `momo123`

## 4. Gestione Tessuti

Nel pannello admin puoi:
- **Aggiungere tessuti**: inserisci nome e URL dell'immagine
- **Eliminare tessuti**: clicca sul pulsante "Elimina" sotto ogni tessuto
- Visualizzare tutti i tessuti esistenti

## 5. URL Immagini

Le immagini devono essere hostati esternamente. Opzioni consigliate:
- **Cloudinary** - CDN per immagini, piano gratuito generoso
- **ImgBB** - hosting immagini gratuito
- **Imgur** - hosting immagini gratuito
- **Vercel Blob** - storage nativo Vercel (a pagamento)
- Qualsiasi URL pubblico di immagine

Esempio URL validi:
```
https://res.cloudinary.com/demo/image/upload/sample.jpg
https://i.imgur.com/example.jpg
https://example.com/images/fabric.jpg
```

## 6. Note Importanti

- La password admin è hard-coded nel codice (`momo123`)
- Per cambiarla, modifica la costante `ADMIN_PASSWORD` in:
  - `src/app/api/admin/auth/route.ts`
  - `src/app/api/admin/fabrics/route.ts`
- Il sistema usa autenticazione Bearer token (la password stessa)
- Non è un sistema di autenticazione production-ready, va bene per uso interno

## 7. Deployment su Vercel

Quando fai il deploy:
1. Il database Neon è già collegato
2. Non dimenticare di inizializzare il database con lo script
3. Puoi eseguire lo script anche da locale (si connetterà al DB remoto)

