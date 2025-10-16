import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function GET () {
  try {
    // Se DATABASE_URL non è configurato, restituisci array vuoto
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === 'your_neon_database_url_here') {
      console.log('Database not configured, returning empty array')
      return NextResponse.json([])
    }

    const sql = neon(process.env.DATABASE_URL)
    
    // Carica i tessuti dal database
    const fabrics = await sql`
      SELECT id, name, image_url, fabric_type, color, created_at 
      FROM fabrics 
      ORDER BY created_at DESC
    `

    // Mappa i risultati nel formato atteso dal frontend
    const formattedFabrics = fabrics.map(f => ({
      id: f.id,
      name: f.name,
      imageUrl: f.image_url,
      fabricType: f.fabric_type || '',
      color: f.color || '',
      createdAt: f.created_at
    }))

    return NextResponse.json(formattedFabrics)
  } catch (error) {
    console.error('Error loading fabrics from database:', error)
    return NextResponse.json(
      { error: 'Failed to load fabrics' },
      { status: 500 }
    )
  }
}

