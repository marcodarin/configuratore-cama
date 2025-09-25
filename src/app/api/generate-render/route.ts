import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import fs from 'fs'
import path from 'path'

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY!
})

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const roomImageFile = formData.get('roomImage') as File
    const fabricImagePath = formData.get('fabricImagePath') as string

    if (!roomImageFile || !fabricImagePath) {
      return NextResponse.json(
        { error: 'Mancano parametri necessari' },
        { status: 400 }
      )
    }

    // Convert room image to base64
    const roomImageBuffer = await roomImageFile.arrayBuffer()
    const roomImageBase64 = Buffer.from(roomImageBuffer).toString('base64')

    // Get fabric image from local filesystem
    const fabricImageFullPath = path.join(process.cwd(), 'public', fabricImagePath)
    const fabricImageBuffer = fs.readFileSync(fabricImageFullPath)
    const fabricImageBase64 = fabricImageBuffer.toString('base64')

    // Determine MIME types
    const roomImageMimeType = roomImageFile.type
    const fabricImageExtension = path.extname(fabricImagePath).toLowerCase()
    let fabricImageMimeType = 'image/jpeg'
    
    if (fabricImageExtension === '.png') {
      fabricImageMimeType = 'image/png'
    } else if (fabricImageExtension === '.webp') {
      fabricImageMimeType = 'image/webp'
    }

    // Create the prompt for image generation
    const prompt = [
      {
        inlineData: {
          mimeType: roomImageMimeType,
          data: roomImageBase64,
        },
      },
      {
        inlineData: {
          mimeType: fabricImageMimeType,
          data: fabricImageBase64,
        },
      },
      { 
        text: `Crea una fotografia professionale di interior design. Prendi il tessuto dalla seconda immagine e utilizzalo per creare una tenda a rullo perfettamente installata sulla finestra della stanza mostrata nella prima immagine. 

Genera un'immagine fotorealistica che mostri:
- La tenda a rullo realizzata con il tessuto fornito, perfettamente dimensionata per la finestra
- Il tessuto deve mantenere esattamente colori, texture e pattern originali
- Illuminazione naturale e ombre coerenti con l'ambiente della stanza
- La tenda deve apparire professionale e ben installata
- L'atmosfera e lo stile devono integrarsi armoniosamente con l'arredamento esistente
- Prospettiva e proporzioni realistiche

Il risultato deve essere una fotografia di alta qualità che potrebbe essere utilizzata per scopi commerciali.` 
      },
    ]

    // Generate image using Gemini 2.5 Flash Image Preview
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image-preview",
      contents: prompt,
    })

    // Process the response
    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0]
      if (candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData && part.inlineData.data) {
            // Save the generated image
            const imageData = part.inlineData.data
            const buffer = Buffer.from(imageData, 'base64')
            
            // Create uploads directory if it doesn't exist
            const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
            if (!fs.existsSync(uploadsDir)) {
              fs.mkdirSync(uploadsDir, { recursive: true })
            }
            
            // Generate unique filename
            const timestamp = Date.now()
            const filename = `render_${timestamp}.png`
            const filepath = path.join(uploadsDir, filename)
            
            // Save the image
            fs.writeFileSync(filepath, buffer)
            
            return NextResponse.json({
              success: true,
              renderUrl: `/uploads/${filename}`,
              message: 'Render generato con successo!'
            })
          }
        }
      }
    }

    // If no image was generated, return error
    return NextResponse.json(
      { error: 'Nessuna immagine generata dal modello AI' },
      { status: 500 }
    )

  } catch (error) {
    console.error('Errore nella generazione del render:', error)
    const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto'
    return NextResponse.json(
      { error: `Errore nella generazione: ${errorMessage}` },
      { status: 500 }
    )
  }
}
