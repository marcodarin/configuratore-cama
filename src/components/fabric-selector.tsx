'use client'

import { useEffect, useMemo } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAppStore } from '@/store/app-store'
import { convertGoogleDriveUrl } from '@/lib/utils'

const fabricTypes = [
  { value: 'all', label: 'Tutte le tipologie' },
  { value: 'Tessuti filtranti', label: 'Tessuti filtranti' },
  { value: 'Tessuti oscuranti', label: 'Tessuti oscuranti' },
  { value: 'Tessuti a fantasia', label: 'Tessuti a fantasia' },
  { value: 'Tessuti night&day', label: 'Tessuti night&day' },
  { value: 'Tessuti screen', label: 'Tessuti screen' }
]

const colors = [
  { value: 'all', label: 'Tutti i colori' },
  { value: 'Bianco', label: 'Bianco' },
  { value: 'Beige/ avorio', label: 'Beige/Avorio' },
  { value: 'Marroni/bronzi', label: 'Marroni/Bronzi' },
  { value: 'Grigio/ tortora', label: 'Grigio/Tortora' },
  { value: 'Rosa', label: 'Rosa' },
  { value: 'Rosso', label: 'Rosso' },
  { value: 'Arancio', label: 'Arancio' },
  { value: 'Verde', label: 'Verde' },
  { value: 'Azzurro', label: 'Azzurro' },
  { value: 'Giallo', label: 'Giallo' },
  { value: 'Multicolor', label: 'Multicolor' }
]

export function FabricSelector () {
  const {
    fabrics,
    selectedFabric,
    selectedFabricType,
    selectedColor,
    setSelectedFabric,
    setFabrics,
    setSelectedFabricType,
    setSelectedColor
  } = useAppStore()

  useEffect(() => {
    // Fetch fabrics from API
    fetch('/api/fabrics')
      .then(res => res.json())
      .then(data => setFabrics(data))
      .catch(err => console.error('Errore nel caricamento dei tessuti:', err))
  }, [setFabrics])

  // Filtra i tessuti in base ai filtri selezionati
  const filteredFabrics = useMemo(() => {
    return fabrics.filter(fabric => {
      const matchesFabricType = selectedFabricType === 'all' || !selectedFabricType || fabric.fabricType === selectedFabricType
      const matchesColor = selectedColor === 'all' || !selectedColor || fabric.color === selectedColor
      return matchesFabricType && matchesColor
    })
  }, [fabrics, selectedFabricType, selectedColor])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          Seleziona un tessuto
        </h2>
      </div>

      {/* Filtri */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filtra per tipologia
          </label>
          <Select value={selectedFabricType} onValueChange={setSelectedFabricType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fabricTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filtra per colore
          </label>
          <Select value={selectedColor} onValueChange={setSelectedColor}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {colors.map((color) => (
                <SelectItem key={color.value} value={color.value}>
                  {color.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {fabrics.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            <p>Caricamento tessuti...</p>
            <p className="text-sm mt-2">
              Aggiungi immagini di tessuti nella cartella public/fabrics per iniziare
            </p>
          </CardContent>
        </Card>
      ) : filteredFabrics.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            <p>Nessun tessuto corrisponde ai filtri selezionati</p>
            <p className="text-sm mt-2">
              Prova a modificare i filtri o aggiungi nuovi tessuti
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="text-sm text-gray-600 mb-2">
            {filteredFabrics.length} {filteredFabrics.length === 1 ? 'tessuto trovato' : 'tessuti trovati'}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredFabrics.map((fabric) => (
              <Card
                key={fabric.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedFabric?.id === fabric.id
                    ? 'ring-2 ring-[#AB9B8C] shadow-lg'
                    : ''
                }`}
                onClick={() => setSelectedFabric(fabric)}
              >
                <CardContent className="p-3">
                  <div className="relative aspect-square mb-2 rounded-md overflow-hidden">
                    <Image
                      src={convertGoogleDriveUrl(fabric.imageUrl)}
                      alt={fabric.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>
                  <p className="text-sm font-medium text-center text-gray-700 truncate">
                    {fabric.name}
                  </p>
                  {fabric.fabricType && (
                    <p className="text-xs text-center text-gray-500 truncate mt-1">
                      {fabric.fabricType}
                    </p>
                  )}
                  {fabric.color && (
                    <p className="text-xs text-center text-gray-400 truncate">
                      {fabric.color}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
