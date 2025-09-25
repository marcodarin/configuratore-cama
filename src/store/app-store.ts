import { create } from 'zustand'

export interface Fabric {
  name: string
  imagePath: string
}

interface AppState {
  selectedFabric: Fabric | null
  roomImage: File | null
  generatedRender: string | null
  isGenerating: boolean
  fabrics: Fabric[]
  setSelectedFabric: (fabric: Fabric | null) => void
  setRoomImage: (image: File | null) => void
  setGeneratedRender: (render: string | null) => void
  setIsGenerating: (generating: boolean) => void
  setFabrics: (fabrics: Fabric[]) => void
}

export const useAppStore = create<AppState>((set) => ({
  selectedFabric: null,
  roomImage: null,
  generatedRender: null,
  isGenerating: false,
  fabrics: [],
  setSelectedFabric: (fabric) => set({ selectedFabric: fabric }),
  setRoomImage: (image) => set({ roomImage: image }),
  setGeneratedRender: (render) => set({ generatedRender: render }),
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  setFabrics: (fabrics) => set({ fabrics })
}))
