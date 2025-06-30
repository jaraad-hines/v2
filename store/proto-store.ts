import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"

export interface ContentData {
  id: string
  type: "script" | "text" | "audio" | "image" | "video"
  title: string
  content: string
  gradient: {
    name: string
    url: string
    color: string
  }
  row: number
}

export interface ProtoState {
  // View Management
  mode: "2D" | "3D" | "hybrid"
  isPlaying: boolean

  // Content Management
  selectedId: string | null
  contentById: Record<string, ContentData>
  cards: ContentData[]

  // Actions
  setMode: (mode: "2D" | "3D" | "hybrid") => void
  setPlaying: (playing: boolean) => void
  selectCard: (id: string | null) => void
  updateContent: (id: string, updates: Partial<ContentData>) => void
  addCard: (card: ContentData) => void
  removeCard: (id: string) => void
  reorderCards: (cards: ContentData[]) => void

  // Helper functions
  getContentForCard: (id: string) => ContentData | null
}

export const useProtoStore = create<ProtoState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    mode: "hybrid",
    isPlaying: false,
    selectedId: null,
    contentById: {},
    cards: [],

    // View actions
    setMode: (mode) => set({ mode }),
    setPlaying: (playing) => set({ isPlaying: playing }),

    // Selection actions
    selectCard: (id) => set({ selectedId: id }),

    // Content actions
    updateContent: (id, updates) => {
      set((state) => {
        const updatedCards = state.cards.map((card) => (card.id === id ? { ...card, ...updates } : card))
        const updatedContentById = {
          ...state.contentById,
          [id]: { ...state.contentById[id], ...updates },
        }
        return {
          cards: updatedCards,
          contentById: updatedContentById,
        }
      })
    },

    addCard: (card) => {
      set((state) => ({
        cards: [...state.cards, card],
        contentById: { ...state.contentById, [card.id]: card },
      }))
    },

    removeCard: (id) => {
      set((state) => {
        const newCards = state.cards.filter((card) => card.id !== id)
        const newContentById = { ...state.contentById }
        delete newContentById[id]

        return {
          cards: newCards,
          contentById: newContentById,
          selectedId: state.selectedId === id ? null : state.selectedId,
        }
      })
    },

    reorderCards: (cards) => {
      set((state) => {
        const newContentById = { ...state.contentById }
        cards.forEach((card) => {
          newContentById[card.id] = card
        })
        return { cards, contentById: newContentById }
      })
    },

    // Helper functions
    getContentForCard: (id) => {
      return get().contentById[id] || null
    },
  })),
)

// Simple debugging
if (typeof window !== "undefined") {
  useProtoStore.subscribe(
    (state) => state.selectedId,
    (selectedId) => console.log("🎯 Selected card:", selectedId),
  )
}
