import { neon } from '@neondatabase/serverless'
import { config } from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
config({ path: path.join(process.cwd(), '.env.local') })

async function initDatabase() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('❌ DATABASE_URL non configurato! Assicurati che sia presente nel file .env o nelle variabili d\'ambiente.')
    }

    const sql = neon(process.env.DATABASE_URL)

    // Create fabrics table
    await sql`
      CREATE TABLE IF NOT EXISTS fabrics (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image_url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    console.log('✅ Tabella fabrics creata con successo!')
  } catch (error) {
    console.error('❌ Errore nella creazione della tabella:', error)
    throw error
  }
}

initDatabase()
  .then(() => {
    console.log('🎉 Database inizializzato!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Errore:', error)
    process.exit(1)
  })

