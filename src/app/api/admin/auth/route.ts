import { NextRequest, NextResponse } from 'next/server'

const ADMIN_PASSWORD = 'momo123'

export async function POST (request: NextRequest) {
  try {
    const { password } = await request.json()

    if (password === ADMIN_PASSWORD) {
      return NextResponse.json({
        success: true,
        token: ADMIN_PASSWORD
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid password' },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

