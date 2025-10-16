import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const ADMIN_PASSWORD = 'momo123'

function verifyAuth (request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false
  }

  const token = authHeader.substring(7)
  return token === ADMIN_PASSWORD
}

export async function GET (request: NextRequest) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const sql = neon(process.env.DATABASE_URL!)
    const fabrics = await sql`SELECT * FROM fabrics ORDER BY created_at DESC`

    return NextResponse.json({
      success: true,
      fabrics: fabrics.map(f => ({
        id: f.id,
        name: f.name,
        imageUrl: f.image_url,
        fabricType: f.fabric_type,
        color: f.color,
        createdAt: f.created_at
      }))
    })
  } catch (error) {
    console.error('Error fetching fabrics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch fabrics' },
      { status: 500 }
    )
  }
}

export async function POST (request: NextRequest) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { name, imageUrl, fabricType, color } = await request.json()

    if (!name || !imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Name and imageUrl are required' },
        { status: 400 }
      )
    }

    const sql = neon(process.env.DATABASE_URL!)
    const result = await sql`
      INSERT INTO fabrics (name, image_url, fabric_type, color)
      VALUES (${name}, ${imageUrl}, ${fabricType || null}, ${color || null})
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      fabric: {
        id: result[0].id,
        name: result[0].name,
        imageUrl: result[0].image_url,
        fabricType: result[0].fabric_type,
        color: result[0].color,
        createdAt: result[0].created_at
      }
    })
  } catch (error) {
    console.error('Error adding fabric:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add fabric' },
      { status: 500 }
    )
  }
}

export async function DELETE (request: NextRequest) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await request.json()

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      )
    }

    const sql = neon(process.env.DATABASE_URL!)
    await sql`DELETE FROM fabrics WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting fabric:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete fabric' },
      { status: 500 }
    )
  }
}

