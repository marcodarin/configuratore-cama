import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const ADMIN_PASSWORD = 'momo123'

function checkAuth(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader || authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
    return false
  }
  return true
}

// POST - Add new fabric
export async function POST(req: NextRequest) {
  try {
    if (!checkAuth(req)) {
      return NextResponse.json(
        { error: 'Non autorizzato' },
        { status: 401 }
      )
    }

    const { name, imageUrl } = await req.json()

    if (!name || !imageUrl) {
      return NextResponse.json(
        { error: 'Nome e URL immagine sono obbligatori' },
        { status: 400 }
      )
    }

    const sql = neon(process.env.DATABASE_URL!)
    
    const result = await sql`
      INSERT INTO fabrics (name, image_url)
      VALUES (${name}, ${imageUrl})
      RETURNING id, name, image_url as "imageUrl", created_at as "createdAt"
    `

    return NextResponse.json({ 
      success: true,
      fabric: result[0]
    })
  } catch (error) {
    console.error('Errore nell\'aggiunta del tessuto:', error)
    return NextResponse.json(
      { error: 'Errore nell\'aggiunta del tessuto' },
      { status: 500 }
    )
  }
}

// DELETE - Remove fabric
export async function DELETE(req: NextRequest) {
  try {
    if (!checkAuth(req)) {
      return NextResponse.json(
        { error: 'Non autorizzato' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID tessuto mancante' },
        { status: 400 }
      )
    }

    const sql = neon(process.env.DATABASE_URL!)
    
    await sql`DELETE FROM fabrics WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Errore nella rimozione del tessuto:', error)
    return NextResponse.json(
      { error: 'Errore nella rimozione del tessuto' },
      { status: 500 }
    )
  }
}

