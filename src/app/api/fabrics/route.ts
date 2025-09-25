import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const fabricsDir = path.join(process.cwd(), 'public', 'fabrics')
    
    // Check if directory exists
    if (!fs.existsSync(fabricsDir)) {
      return NextResponse.json([])
    }

    const files = fs.readdirSync(fabricsDir)
    
    const fabrics = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase()
        return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext)
      })
      .map(file => ({
        name: path.parse(file).name,
        imagePath: `/fabrics/${file}`
      }))

    return NextResponse.json(fabrics)
  } catch (error) {
    console.error('Errore nel caricamento dei tessuti:', error)
    return NextResponse.json([])
  }
}
