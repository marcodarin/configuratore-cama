import { Topbar } from '@/components/topbar'
import { FabricSelector } from '@/components/fabric-selector'
import { RoomUploader } from '@/components/room-uploader'
import { RenderGenerator } from '@/components/render-generator'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Configuratore Tende a Rullo
          </h1>
          <p className="text-gray-600">
            Seleziona un tessuto, carica l&apos;immagine della tua stanza e genera un render realistico
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <FabricSelector />
            <RoomUploader />
          </div>
          
          <div>
            <RenderGenerator />
          </div>
        </div>
      </main>
    </div>
  )
}
