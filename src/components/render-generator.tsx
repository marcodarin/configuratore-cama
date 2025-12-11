'use client'

import Image from 'next/image'
import { Loader2, Download, RefreshCw, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppStore } from '@/store/app-store'
import { toast } from 'sonner'
import { convertGoogleDriveUrl } from '@/lib/utils'

export function RenderGenerator() {
  const {
    selectedFabric,
    roomImage,
    generatedRender,
    isGenerating,
    setGeneratedRender,
    setIsGenerating
  } = useAppStore()

  const canGenerate = selectedFabric && roomImage

  const generateRender = async () => {
    if (!selectedFabric || !roomImage) {
      toast.error('Seleziona un tessuto e carica un\'immagine della stanza')
      return
    }

    setIsGenerating(true)
    setGeneratedRender(null)

    try {
      const formData = new FormData()
      formData.append('roomImage', roomImage)
      formData.append('fabricImageUrl', selectedFabric.imageUrl)

      const response = await fetch('/api/generate-render', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success && data.renderUrl) {
        setGeneratedRender(data.renderUrl)
        toast.success('Render generato con successo!')
      } else {
        toast.error(data.error || 'Errore nella generazione del render')
      }
    } catch (error) {
      console.error('Errore:', error)
      toast.error('Errore nella comunicazione con il server')
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadRender = () => {
    if (generatedRender) {
      const link = document.createElement('a')
      link.href = generatedRender
      link.download = `render-${selectedFabric?.name || 'tenda'}.jpg`
      link.click()
    }
  }

  // Se c'è un render generato, mostralo in alto con le opzioni
  if (generatedRender) {
    return (
      <Card className="mb-8 border-2 border-[#AB9B8C]">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#AB9B8C]" />
            Render Generato
          </CardTitle>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:inline">
              Non ti piace o non è corretto?
            </span>
            <Button
              onClick={generateRender}
              disabled={isGenerating || !canGenerate}
              variant="outline"
              size="sm"
              className="border-[#AB9B8C] text-[#AB9B8C] hover:bg-[#AB9B8C] hover:text-white"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rigenerazione...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Rigenera immagine
                </>
              )}
            </Button>
            <Button
              onClick={downloadRender}
              size="sm"
              className="bg-[#AB9B8C] hover:bg-[#9B8B7C]"
            >
              <Download className="mr-2 h-4 w-4" />
              Scarica
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={generatedRender}
              alt="Render generato"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 80vw"
            />
          </div>
          {selectedFabric && (
            <p className="text-sm text-gray-600 mt-3 text-center">
              Tessuto utilizzato: <span className="font-medium">{selectedFabric.name}</span>
            </p>
          )}
        </CardContent>
      </Card>
    )
  }

  // Stato di generazione in corso
  if (isGenerating) {
    return (
      <Card className="mb-8">
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#AB9B8C] mb-4" />
            <p className="text-lg font-medium text-gray-700">
              Generazione del render in corso...
            </p>
            <p className="text-sm text-gray-500 mt-2">
              L&apos;AI sta creando il fotomontaggio. Potrebbe richiedere qualche secondo.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Sezione per generare il render (quando si può generare)
  if (canGenerate) {
    return (
      <Card className="mb-8 bg-gradient-to-r from-[#f8f6f4] to-[#f5f2ef] border-[#AB9B8C]">
        <CardContent className="py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                  <Image
                    src={URL.createObjectURL(roomImage)}
                    alt="Stanza"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                  <Image
                    src={convertGoogleDriveUrl(selectedFabric.imageUrl)}
                    alt={selectedFabric.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  Pronto per la generazione!
                </p>
                <p className="text-sm text-gray-600">
                  Tessuto: {selectedFabric.name}
                </p>
              </div>
            </div>
            <Button
              onClick={generateRender}
              className="bg-[#AB9B8C] hover:bg-[#9B8B7C] px-8"
              size="lg"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Genera Render
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Stato iniziale - mostra cosa manca
  return (
    <Card className="mb-8 bg-gray-50 border-dashed">
      <CardContent className="py-6">
        <div className="text-center text-gray-500">
          <Sparkles className="h-8 w-8 mx-auto mb-3 text-gray-400" />
          <p className="font-medium mb-2">Per generare il render:</p>
          <ul className="text-sm space-y-1">
            {!roomImage && <li className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Carica l&apos;immagine di una stanza
            </li>}
            {!selectedFabric && <li className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Seleziona un tessuto
            </li>}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
