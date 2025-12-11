import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

// Aumenta il timeout per permettere a Gemini 3 Pro di completare la generazione
// Vercel Hobby: max 60s, Vercel Pro: max 300s
export const maxDuration = 120

const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY || '' })

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

    const prompt = `Sei un esperto di fotomontaggi iperrealistici specializzato in tende a rullo.

La prima immagine è la foto reale di una finestra in un ambiente di casa.
La seconda immagine mostra una tenda a rullo.

Il tuo compito: crea un fotomontaggio iperrealistico che ambienti la tenda a rullo della seconda immagine nella foto dell'ambiente della prima immagine.

REQUISITI FONDAMENTALI DEL FOTOMONTAGGIO:
- La tenda a rullo DEVE TOCCARE IL SOFFITTO PRINCIPALE DELLA STANZA
- La tenda a rullo DEVE COPRIRE COMPLETAMENTE LA FINESTRA con installazione OUTSIDE MOUNTING (montaggio esterno)
- Il tessuto della tenda deve avere esattamente la stessa texture, pattern e colore della seconda immagine
- Mantieni l'illuminazione e lo stile originale della stanza
- Il risultato deve essere fotorealistico e professionale
- Non aggiungere testo, watermark o didascalie

Genera il fotomontaggio finale.`

    const response = await genAI.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
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
          ]
        }
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
        imageConfig: {
          aspectRatio: '4:3',
          imageSize: '1K'
        }
      }
    })
    
    // Check if response contains image
    if (!response.candidates || response.candidates.length === 0) {
      console.error('No candidates in response')
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
          const mimeType = part.inlineData.mimeType || 'image/png'
          const dataUrl = `data:${mimeType};base64,${imageData}`
          
          return NextResponse.json({
            success: true,
            renderUrl: dataUrl
          })
        }
      }
    }

    // If no image data found, return error
    console.error('No image data in response parts')
    return NextResponse.json(
      { success: false, error: 'No image data in response' },
      { status: 500 }
    )
  } catch (error) {
    console.error('Error generating render:', error)
    // Log more details for debugging
    if (error instanceof Error) {
      console.error('Error stack:', error.stack)
      console.error('Error name:', error.name)
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate render'
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}

