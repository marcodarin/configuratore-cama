'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { useAppStore } from '@/store/app-store'

export function FabricSelector() {
  const { fabrics, selectedFabric, setSelectedFabric, setFabrics } = useAppStore()

  useEffect(() => {
    // Fetch fabrics from API
    fetch('/api/fabrics')
      .then(res => res.json())
      .then(data => setFabrics(data))
      .catch(err => console.error('Errore nel caricamento dei tessuti:', err))
  }, [setFabrics])

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">
        Seleziona un tessuto
      </h2>
      
      {fabrics.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            <p>Caricamento tessuti...</p>
            <p className="text-sm mt-2">
              Aggiungi immagini di tessuti nella cartella public/fabrics per iniziare
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {fabrics.map((fabric) => (
            <Card
              key={fabric.name}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedFabric?.name === fabric.name
                  ? 'ring-2 ring-[#AB9B8C] shadow-lg'
                  : ''
              }`}
              onClick={() => setSelectedFabric(fabric)}
            >
              <CardContent className="p-3">
                <div className="relative aspect-square mb-2 rounded-md overflow-hidden">
                  <Image
                    src={fabric.imageUrl}
                    alt={fabric.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>
                <p className="text-sm font-medium text-center text-gray-700 truncate">
                  {fabric.name}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
