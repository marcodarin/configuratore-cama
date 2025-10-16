'use client'

import Image from 'next/image'
import { Loader2, Download } from 'lucide-react'
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
      toast.error('Seleziona un tessuto e carica un&apos;immagine della stanza')
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">
            Genera Render
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!canGenerate && (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-2">Per generare il render:</p>
              <ul className="text-sm space-y-1">
                {!selectedFabric && <li>• Seleziona un tessuto</li>}
                {!roomImage && <li>• Carica l&apos;immagine di una stanza</li>}
              </ul>
            </div>
          )}

          {canGenerate && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Tessuto selezionato:
                  </p>
                  <div className="relative aspect-square rounded-lg overflow-hidden">
                    <Image
                      src={convertGoogleDriveUrl(selectedFabric.imageUrl)}
                      alt={selectedFabric.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <p className="text-sm text-center mt-1 text-gray-700">
                    {selectedFabric.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Immagine stanza:
                  </p>
                  <div className="relative aspect-square rounded-lg overflow-hidden">
                    <Image
                      src={URL.createObjectURL(roomImage)}
                      alt="Stanza"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={generateRender}
                disabled={isGenerating}
                className="w-full bg-[#AB9B8C] hover:bg-[#9B8B7C]"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generazione in corso...
                  </>
                ) : (
                  'Genera Render'
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>


      {generatedRender && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-gray-800">
              Render Generato
            </CardTitle>
            <Button
              onClick={downloadRender}
              variant="outline"
              size="sm"
            >
              <Download className="mr-2 h-4 w-4" />
              Scarica
            </Button>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={generatedRender}
                alt="Render generato"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
