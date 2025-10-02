import { NextRequest, NextResponse } from 'next/server'

const ADMIN_PASSWORD = 'momo123'

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()

    if (password === ADMIN_PASSWORD) {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: 'Password non corretta' },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Errore nella verifica della password' },
      { status: 500 }
    )
  }
}

