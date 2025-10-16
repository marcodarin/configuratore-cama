import { create } from 'zustand'

export interface Fabric {
  id: number
  name: string
  imageUrl: string
  fabricType?: string
  color?: string
  createdAt?: string
}

interface AppState {
  selectedFabric: Fabric | null
  roomImage: File | null
  generatedRender: string | null
  isGenerating: boolean
  fabrics: Fabric[]
  selectedFabricType: string
  selectedColor: string
  setSelectedFabric: (fabric: Fabric | null) => void
  setRoomImage: (image: File | null) => void
  setGeneratedRender: (render: string | null) => void
  setIsGenerating: (generating: boolean) => void
  setFabrics: (fabrics: Fabric[]) => void
  setSelectedFabricType: (type: string) => void
  setSelectedColor: (color: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  selectedFabric: null,
  roomImage: null,
  generatedRender: null,
  isGenerating: false,
  fabrics: [],
  selectedFabricType: '',
  selectedColor: '',
  setSelectedFabric: (fabric) => set({ selectedFabric: fabric }),
  setRoomImage: (image) => set({ roomImage: image }),
  setGeneratedRender: (render) => set({ generatedRender: render }),
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  setFabrics: (fabrics) => set({ fabrics }),
  setSelectedFabricType: (type) => set({ selectedFabricType: type }),
  setSelectedColor: (color) => set({ selectedColor: color })
}))
