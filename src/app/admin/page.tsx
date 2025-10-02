'use client'

import { useState, useEffect } from 'react'
import { Loader2, Plus, Trash2, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Fabric } from '@/store/app-store'
import Image from 'next/image'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [fabrics, setFabrics] = useState<Fabric[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [newFabricName, setNewFabricName] = useState('')
  const [newFabricUrl, setNewFabricUrl] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [authToken, setAuthToken] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      loadFabrics()
    }
  }, [isAuthenticated])

  const loadFabrics = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/fabrics')
      const data = await response.json()
      setFabrics(data)
    } catch (error) {
      console.error('Errore nel caricamento dei tessuti:', error)
      toast.error('Errore nel caricamento dei tessuti')
    } finally {
      setIsLoading(false)
    }
  }

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
        setIsAuthenticated(true)
        setAuthToken(password)
        toast.success('Accesso effettuato!')
      } else {
        toast.error('Password non corretta')
      }
    } catch (error) {
      console.error('Errore nel login:', error)
      toast.error('Errore nel login')
    } finally {
      setIsLoggingIn(false)
      setPassword('')
    }
  }

  const handleAddFabric = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newFabricName.trim() || !newFabricUrl.trim()) {
      toast.error('Compila tutti i campi')
      return
    }

    setIsAdding(true)

    try {
      const response = await fetch('/api/admin/fabrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          name: newFabricName,
          imageUrl: newFabricUrl
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Tessuto aggiunto con successo!')
        setNewFabricName('')
        setNewFabricUrl('')
        loadFabrics()
      } else {
        toast.error(data.error || 'Errore nell\'aggiunta del tessuto')
      }
    } catch (error) {
      console.error('Errore nell\'aggiunta del tessuto:', error)
      toast.error('Errore nell\'aggiunta del tessuto')
    } finally {
      setIsAdding(false)
    }
  }

  const handleDeleteFabric = async (id: number, name: string) => {
    if (!confirm(`Sei sicuro di voler eliminare il tessuto "${name}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/fabrics?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Tessuto eliminato con successo!')
        loadFabrics()
      } else {
        toast.error(data.error || 'Errore nell\'eliminazione del tessuto')
      }
    } catch (error) {
      console.error('Errore nell\'eliminazione del tessuto:', error)
      toast.error('Errore nell\'eliminazione del tessuto')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setAuthToken('')
    setFabrics([])
    toast.success('Disconnesso con successo')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-gray-800">
              Pannello Admin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Inserisci la password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoggingIn}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#AB9B8C] hover:bg-[#9B8B7C]"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Accesso in corso...
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">
            Gestione Tessuti
          </h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Esci
          </Button>
        </div>

        {/* Add Fabric Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">
              Aggiungi Nuovo Tessuto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddFabric} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Nome Tessuto
                  </label>
                  <Input
                    type="text"
                    placeholder="Es: Lino Beige"
                    value={newFabricName}
                    onChange={(e) => setNewFabricName(e.target.value)}
                    disabled={isAdding}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    URL Immagine
                  </label>
                  <Input
                    type="url"
                    placeholder="https://..."
                    value={newFabricUrl}
                    onChange={(e) => setNewFabricUrl(e.target.value)}
                    disabled={isAdding}
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="bg-[#AB9B8C] hover:bg-[#9B8B7C]"
                disabled={isAdding}
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

        {/* Fabrics List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">
              Tessuti Esistenti ({fabrics.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                <p className="text-gray-500 mt-4">Caricamento tessuti...</p>
              </div>
            ) : fabrics.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>Nessun tessuto presente.</p>
                <p className="text-sm mt-2">Aggiungi il primo tessuto usando il form sopra.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fabrics.map((fabric) => (
                  <Card key={fabric.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="relative aspect-square mb-3 rounded-md overflow-hidden bg-gray-100">
                        <Image
                          src={fabric.imageUrl}
                          alt={fabric.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {fabric.name}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">
                          ID: {fabric.id}
                        </p>
                        <Button
                          onClick={() => handleDeleteFabric(fabric.id, fabric.name)}
                          variant="destructive"
                          size="sm"
                          className="w-full"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Elimina
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

