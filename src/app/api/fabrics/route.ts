import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    const result = await sql`
      SELECT id, name, image_url as "imageUrl", created_at as "createdAt"
      FROM fabrics
      ORDER BY created_at DESC
    `

    return NextResponse.json(result)
  } catch (error) {
    console.error('Errore nel caricamento dei tessuti:', error)
    return NextResponse.json([])
  }
}
