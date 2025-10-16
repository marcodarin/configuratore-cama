import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '')

function convertGoogleDriveUrl (url: string): string {
  if (!url) return url
  
  const driveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/
  const match = url.match(driveRegex)
  
  if (match && match[1]) {
    const fileId = match[1]
    return `https://drive.google.com/uc?export=view&id=${fileId}`
  }
  
  return url
}

export async function POST (request: NextRequest) {
  try {
    const formData = await request.formData()
    const roomImage = formData.get('roomImage') as File
    const fabricImageUrl = formData.get('fabricImageUrl') as string

    if (!roomImage || !fabricImageUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Convert room image to base64
    const roomBuffer = await roomImage.arrayBuffer()
    const roomBase64 = Buffer.from(roomBuffer).toString('base64')

    // Fetch fabric image - gestisce sia URL locali che Google Drive
    let fabricUrl = fabricImageUrl
    
    // Se è un URL relativo (inizia con /), aggiungi il base URL
    if (fabricImageUrl.startsWith('/')) {
      fabricUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${fabricImageUrl}`
    } else {
      // Se è un URL di Google Drive, convertilo
      fabricUrl = convertGoogleDriveUrl(fabricImageUrl)
    }
    
    const fabricResponse = await fetch(fabricUrl)
    const fabricBuffer = await fabricResponse.arrayBuffer()
    const fabricBase64 = Buffer.from(fabricBuffer).toString('base64')

    // Get fabric file extension
    const fabricExt = fabricImageUrl.split('.').pop()?.toLowerCase() || 'jpeg'
    const fabricMimeType = fabricExt === 'png' ? 'image/png' : fabricExt === 'webp' ? 'image/webp' : 'image/jpeg'

    // Get room image mime type
    const roomMimeType = roomImage.type || 'image/jpeg'

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

    const prompt = `Sei un esperto di interior design specializzato nella visualizzazione di tende a rullo.

Ti fornisco due immagini:
1. Una stanza con finestre
2. Un tessuto per tende a rullo

Il tuo compito è generare un render fotorealistico che mostri come apparirebbero le tende a rullo realizzate con questo tessuto, installate sulle finestre della stanza.

Linee guida importanti:
- Le tende devono essere a RULLO (roller blinds), non altri tipi di tende
- Il tessuto delle tende deve riflettere fedelmente la texture e il colore del tessuto fornito
- Le tende devono essere posizionate all'interno del vano finestra o appena sopra
- Mantieni lo stile e l'illuminazione della stanza originale
- Il risultato deve essere fotorealistico e professionale
- Le tende devono apparire naturali e ben integrate nell'ambiente

Genera SOLO l'immagine del risultato finale, senza testo o didascalie.`

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: roomMimeType,
          data: roomBase64
        }
      },
      {
        inlineData: {
          mimeType: fabricMimeType,
          data: fabricBase64
        }
      }
    ])

    const response = await result.response
    
    // Check if response contains image
    if (!response.candidates || response.candidates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No image generated' },
        { status: 500 }
      )
    }

    const candidate = response.candidates[0]
    
    // Extract image data from response
    if (candidate.content && candidate.content.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          const imageData = part.inlineData.data
          const mimeType = part.inlineData.mimeType || 'image/jpeg'
          const dataUrl = `data:${mimeType};base64,${imageData}`
          
          return NextResponse.json({
            success: true,
            renderUrl: dataUrl
          })
        }
      }
    }

    // If no image data found, return error
    return NextResponse.json(
      { success: false, error: 'No image data in response' },
      { status: 500 }
    )
  } catch (error) {
    console.error('Error generating render:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate render'
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}

