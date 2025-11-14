'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAppStore } from '@/store/app-store'
import { toast } from 'sonner'

export function RoomUploader() {
  const { roomImage, setRoomImage } = useAppStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Per favore seleziona un file immagine valido')
      return
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('Il file è troppo grande. Massimo 10MB.')
      return
    }

    setRoomImage(file)
    toast.success('Immagine caricata con successo!')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const removeImage = () => {
    setRoomImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">
        Carica l&apos;immagine della stanza
      </h2>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Come scattare la foto della finestra
        </h3>
        <ul className="space-y-2 text-sm text-blue-900">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold mt-0.5">•</span>
            <span>
              <strong>Inquadratura completa:</strong> La foto deve includere <strong>tutta la parete dal soffitto al pavimento</strong>, con tutti e 4 gli angoli della finestra visibili
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold mt-0.5">•</span>
            <span>
              <strong>Posizionamento:</strong> Scatta la foto frontalmente alla finestra, mantenendo la fotocamera parallela al muro per evitare distorsioni prospettiche
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold mt-0.5">•</span>
            <span>
              <strong>Tende:</strong> Rimuovi le tende o aprile completamente per rendere la superficie della finestra il più visibile possibile
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold mt-0.5">•</span>
            <span>
              <strong>Illuminazione:</strong> Assicurati che la luce sia uniforme e che la finestra sia ben illuminata
            </span>
          </li>
        </ul>
      </div>
      
      {!roomImage ? (
        <Card
          className={`border-2 border-dashed transition-colors ${
            dragOver ? 'border-[#AB9B8C] bg-gray-50' : 'border-gray-300'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <CardContent className="p-8 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-600 mb-2">
              Trascina qui la tua immagine
            </p>
            <p className="text-sm text-gray-500 mb-4">
              oppure clicca per selezionare un file
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#AB9B8C] hover:bg-[#9B8B7C]"
            >
              Seleziona immagine
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInput}
            />
            <p className="text-xs text-gray-400 mt-2">
              Formati supportati: JPG, PNG, WebP (max 10MB)
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={URL.createObjectURL(roomImage)}
                  alt="Immagine della stanza"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <Button
                onClick={removeImage}
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              File: {roomImage.name} ({(roomImage.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
