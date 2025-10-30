'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Loader2, Trash2, Plus, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { convertGoogleDriveUrl } from '@/lib/utils'

interface Fabric {
  id: number
  name: string
  imageUrl: string
  fabricType?: string
  color?: string
  createdAt?: string
}

export default function AdminPage () {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [fabrics, setFabrics] = useState<Fabric[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newFabricName, setNewFabricName] = useState('')
  const [newFabricUrl, setNewFabricUrl] = useState('')
  const [newFabricType, setNewFabricType] = useState('')
  const [newFabricColor, setNewFabricColor] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [token, setToken] = useState('')

  const fabricTypes = [
    'Tessuti filtranti',
    'Tessuti oscuranti',
    'Tessuti a fantasia',
    'Tessuti night&day',
    'Tessuti screen'
  ]

  const colors = [
    'Arancio',
    'Azzurro',
    'Beige/ avorio',
    'Bianco',
    'Giallo',
    'Grigio/ tortora',
    'Marroni/bronzi',
    'Multicolor',
    'Rosa',
    'Rosso',
    'Verde'
  ]

  useEffect(() => {
    const savedToken = sessionStorage.getItem('adminToken')
    if (savedToken) {
      setToken(savedToken)
      setIsAuthenticated(true)
      loadFabrics(savedToken)
    } else {
      setIsLoading(false)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      const data = await response.json()

      if (data.success) {
        setToken(data.token)
        setIsAuthenticated(true)
        sessionStorage.setItem('adminToken', data.token)
        toast.success('Accesso effettuato')
        loadFabrics(data.token)
      } else {
        toast.error('Password non valida')
      }
    } catch {
      toast.error('Errore durante il login')
    } finally {
      setIsLoggingIn(false)
    }
  }

  const loadFabrics = async (authToken: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/fabrics', {
        headers: { Authorization: `Bearer ${authToken}` }
      })

      const data = await response.json()

      if (data.success) {
        setFabrics(data.fabrics.map((f: Fabric) => ({
          ...f,
          fabricType: f.fabricType || '',
          color: f.color || ''
        })))
      } else {
        toast.error('Errore nel caricamento dei tessuti')
      }
    } catch {
      toast.error('Errore durante il caricamento')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddFabric = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newFabricName || !newFabricUrl) {
      toast.error('Compila tutti i campi')
      return
    }

    setIsAdding(true)

    try {
      const response = await fetch('/api/admin/fabrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newFabricName,
          imageUrl: newFabricUrl,
          fabricType: newFabricType,
          color: newFabricColor
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Tessuto aggiunto')
        setNewFabricName('')
        setNewFabricUrl('')
        setNewFabricType('')
        setNewFabricColor('')
        loadFabrics(token)
      } else {
        toast.error(data.error || 'Errore durante l\'aggiunta')
      }
    } catch {
      toast.error('Errore durante l\'aggiunta')
    } finally {
      setIsAdding(false)
    }
  }

  const handleDeleteFabric = async (id: number) => {
    if (!confirm('Sei sicuro di voler eliminare questo tessuto?')) {
      return
    }

    try {
      const response = await fetch('/api/admin/fabrics', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Tessuto eliminato')
        loadFabrics(token)
      } else {
        toast.error('Errore durante l\'eliminazione')
      }
    } catch {
      toast.error('Errore durante l\'eliminazione')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken')
    setIsAuthenticated(false)
    setToken('')
    setPassword('')
    setFabrics([])
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Admin Panel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Inserisci password"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-[#AB9B8C] hover:bg-[#9B8B7C]"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Accesso...
                  </>
                ) : (
                  'Accedi'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="w-full h-16 bg-[#AB9B8C] px-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">
          Pannello Admin - Gestione Tessuti
        </h1>
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="bg-white/10 text-white border-white/20 hover:bg-white/20"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Esci
        </Button>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Aggiungi Nuovo Tessuto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddFabric} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Tessuto
                  </label>
                  <Input
                    type="text"
                    value={newFabricName}
                    onChange={(e) => setNewFabricName(e.target.value)}
                    placeholder="es. Cotone Bianco"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Immagine
                  </label>
                  <Input
                    type="url"
                    value={newFabricUrl}
                    onChange={(e) => setNewFabricUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipologia Tessuto
                  </label>
                  <Select value={newFabricType} onValueChange={setNewFabricType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona tipologia" />
                    </SelectTrigger>
                    <SelectContent>
                      {fabricTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Colore
                  </label>
                  <Select value={newFabricColor} onValueChange={setNewFabricColor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona colore" />
                    </SelectTrigger>
                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem key={color} value={color}>
                          {color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                type="submit"
                disabled={isAdding}
                className="bg-[#AB9B8C] hover:bg-[#9B8B7C]"
              >
                {isAdding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Aggiunta in corso...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Aggiungi Tessuto
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tessuti Esistenti ({fabrics.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : fabrics.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>Nessun tessuto disponibile</p>
                <p className="text-sm mt-2">Aggiungi il primo tessuto usando il form sopra</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fabrics.map((fabric) => (
                  <Card key={fabric.id}>
                    <CardContent className="p-4">
                      <div className="relative aspect-square mb-3 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={convertGoogleDriveUrl(fabric.imageUrl)}
                          alt={fabric.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                      <h3 className="font-medium text-gray-900 mb-2">
                        {fabric.name}
                      </h3>
                      {fabric.fabricType && (
                        <p className="text-xs text-gray-600 mb-1">
                          <span className="font-medium">Tipologia:</span> {fabric.fabricType}
                        </p>
                      )}
                      {fabric.color && (
                        <p className="text-xs text-gray-600 mb-2">
                          <span className="font-medium">Colore:</span> {fabric.color}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mb-3 truncate">
                        {fabric.imageUrl}
                      </p>
                      <Button
                        onClick={() => handleDeleteFabric(fabric.id)}
                        variant="destructive"
                        size="sm"
                        className="w-full"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Elimina
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

