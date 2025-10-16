import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET () {
  try {
    const fabricsDir = path.join(process.cwd(), 'public', 'fabrics')
    
    // Check if directory exists
    try {
      await fs.access(fabricsDir)
    } catch {
      return NextResponse.json([])
    }

    const files = await fs.readdir(fabricsDir)
    
    // Filter for image files
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp']
    const fabricFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase()
      return imageExtensions.includes(ext) && !file.startsWith('.')
    })

    // Create fabric objects
    const fabrics = fabricFiles.map((file, index) => {
      const name = path.basename(file, path.extname(file))
        .replace(/-/g, ' ')
        .replace(/_/g, ' ')
      
      return {
        id: index + 1,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        imageUrl: `/fabrics/${file}`,
        fabricType: '',
        color: ''
      }
    })

    return NextResponse.json(fabrics)
  } catch (error) {
    console.error('Error reading fabrics directory:', error)
    return NextResponse.json(
      { error: 'Failed to load fabrics' },
      { status: 500 }
    )
  }
}

