"use client"

import { useState, useEffect } from "react"
import { DndContext, type DragEndEvent, DragOverlay, type DragStartEvent } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { InputCard, type InputCardData } from "./input-card"
import { EnhancedViewport } from "./enhanced-viewport"
import { ViewportEditor } from "./viewport-editor"
import { Button } from "@/components/ui/button"
import { Plus, Minus } from "lucide-react"

const gradients = [
  { name: "Purple", url: "/gradients/time-up-purple.png", color: "from-purple-400 to-violet-600" },
  { name: "Green", url: "/gradients/time-up-green.png", color: "from-green-400 to-emerald-600" },
  { name: "Blue", url: "/gradients/time-up-blue.png", color: "from-blue-400 to-cyan-600" },
  { name: "Orange", url: "/gradients/time-up-orange.png", color: "from-orange-400 to-red-500" },
  { name: "Tangerine", url: "/gradients/time-up-tangerine.png", color: "from-orange-300 to-pink-400" },
  { name: "Brown", url: "/gradients/time-up-brown.png", color: "from-amber-600 to-orange-800" },
]

const MAX_ROWS = gradients.length // 6 rows max
const CARDS_PER_ROW = 5

export function InputCardBoard() {
  const [isMounted, setIsMounted] = useState(false)
  const [cards, setCards] = useState<InputCardData[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [selectedCard, setSelectedCard] = useState<InputCardData | null>(null)
  const [viewportMode, setViewportMode] = useState<"enhanced" | "editor" | null>(null)

  useEffect(() => {
    setIsMounted(true)

    // Initialize with default cards
    setCards([
      {
        id: "1",
        type: "script",
        title: "Beat Pattern 1",
        content: "kick, snare, kick, snare",
        gradient: gradients[0], // Purple for row 1
        row: 0,
      },
      {
        id: "2",
        type: "audio",
        title: "Sample Loop",
        content: "sample.wav",
        gradient: gradients[0], // Purple for row 1
        row: 0,
      },
      {
        id: "3",
        type: "text",
        title: "Notes",
        content: "Remember to add reverb",
        gradient: gradients[0], // Purple for row 1
        row: 0,
      },
    ])
  }, [])

  if (!isMounted) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-white">Loading Cards...</div>
      </div>
    )
  }

  // Calculate current number of rows
  const currentRows = Math.max(1, Math.ceil(cards.length / CARDS_PER_ROW))
  const canAddRow = currentRows < MAX_ROWS
  const canRemoveRow = currentRows > 1

  // Check if we can add individual cards
  const lastRowCardCount = cards.length % CARDS_PER_ROW || (cards.length > 0 ? CARDS_PER_ROW : 0)
  const isLastRowFull = lastRowCardCount === CARDS_PER_ROW
  const canAddCard = !isLastRowFull || canAddRow // Can add if last row isn't full OR if we can add a new row

  // Function to get the next available gradient color for individual cards
  const getNextAvailableGradient = () => {
    // Count cards by gradient
    const gradientCounts = gradients.map((gradient) => ({
      gradient,
      count: cards.filter((card) => card.gradient.name === gradient.name).length,
    }))

    // Find the first gradient with less than 5 cards
    const availableGradient = gradientCounts.find((item) => item.count < CARDS_PER_ROW)

    // If all gradients have 5 cards, cycle back to the first one
    return availableGradient ? availableGradient.gradient : gradients[0]
  }

  // Function to get the next row gradient (for Add New Row)
  const getNextRowGradient = () => {
    // Get all gradients currently used by existing cards
    const usedGradientNames = new Set(cards.map((card) => card.gradient.name))

    // Find the first gradient that hasn't been used at all
    const unusedGradient = gradients.find((gradient) => !usedGradientNames.has(gradient.name))

    if (unusedGradient) {
      return unusedGradient
    }

    // If all gradients are used, find the one with the fewest cards
    const gradientCounts = gradients.map((gradient) => ({
      gradient,
      count: cards.filter((card) => card.gradient.name === gradient.name).length,
    }))

    // Sort by count and return the gradient with the least cards
    gradientCounts.sort((a, b) => a.count - b.count)
    return gradientCounts[0].gradient
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setCards((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        const newItems = [...items]
        const [reorderedItem] = newItems.splice(oldIndex, 1)
        newItems.splice(newIndex, 0, reorderedItem)

        // Recalculate row assignments and gradients after reordering
        return newItems.map((card, index) => ({
          ...card,
          row: Math.floor(index / CARDS_PER_ROW),
          gradient: gradients[Math.floor(index / CARDS_PER_ROW)],
        }))
      })
    }

    setActiveId(null)
  }

  const addNewRow = () => {
    if (!canAddRow) return

    // Use the next available gradient for the new row
    const newRowGradient = getNextRowGradient()
    const newRowIndex = currentRows

    // Add 5 new cards for the new row
    const newCards: InputCardData[] = []
    for (let i = 0; i < CARDS_PER_ROW; i++) {
      newCards.push({
        id: `${Date.now()}-${i}`,
        type: "text",
        title: `New Card`,
        content: "Enter content...",
        gradient: newRowGradient,
        row: newRowIndex,
      })
    }

    setCards([...cards, ...newCards])
  }

  const removeLastRow = () => {
    if (!canRemoveRow) return

    // Remove all cards from the last row
    const cardsToKeep = cards.slice(0, (currentRows - 1) * CARDS_PER_ROW)
    setCards(cardsToKeep)
  }

  const addNewCard = () => {
    if (!canAddCard) return

    // Use the next available gradient color instead of row-based assignment
    const nextGradient = getNextAvailableGradient()

    const newCard: InputCardData = {
      id: Date.now().toString(),
      type: "text",
      title: "New Card",
      content: "Enter content...",
      gradient: nextGradient,
      row: Math.floor(cards.length / CARDS_PER_ROW),
    }
    setCards([...cards, newCard])
  }

  const removeLastCard = () => {
    if (cards.length > 0) {
      setCards(cards.slice(0, -1))
    }
  }

  const updateCard = (id: string, updates: Partial<InputCardData>) => {
    setCards(cards.map((card) => (card.id === id ? { ...card, ...updates } : card)))
    // Update selected card if it's the one being updated
    if (selectedCard && selectedCard.id === id) {
      setSelectedCard({ ...selectedCard, ...updates })
    }
  }

  const deleteCard = (id: string) => {
    const newCards = cards.filter((card) => card.id !== id)
    // Recalculate row assignments and gradients after deletion
    const updatedCards = newCards.map((card, index) => ({
      ...card,
      row: Math.floor(index / CARDS_PER_ROW),
      gradient: gradients[Math.floor(index / CARDS_PER_ROW)],
    }))
    setCards(updatedCards)
    // Close viewport if deleted card was selected
    if (selectedCard && selectedCard.id === id) {
      setSelectedCard(null)
      setViewportMode(null)
    }
  }

  const handleCardClick = (card: InputCardData) => {
    setSelectedCard(card)
    setViewportMode("editor")
  }

  const handleViewportClose = () => {
    setSelectedCard(null)
    setViewportMode(null)
  }

  const handleCardSelect = (card: InputCardData) => {
    setSelectedCard(card)
  }

  // Group cards by rows
  const cardRows = cards.reduce(
    (acc, card, index) => {
      const rowIndex = Math.floor(index / CARDS_PER_ROW)
      if (!acc[rowIndex]) acc[rowIndex] = []
      acc[rowIndex].push(card)
      return acc
    },
    {} as Record<number, InputCardData[]>,
  )

  // Show viewport editor if a card is selected
  if (viewportMode === "editor" && selectedCard) {
    return (
      <ViewportEditor
        selectedCard={selectedCard}
        cards={cards}
        onClose={handleViewportClose}
        onUpdate={updateCard}
        onCardSelect={handleCardSelect}
      />
    )
  }

  return (
    <div className="h-full flex flex-col w-full max-w-7xl mx-auto px-6">
      {/* Enhanced Viewport - Positioned in the empty space at top */}
      <div className="mt-6">
        {viewportMode === "enhanced" && selectedCard && (
          <EnhancedViewport selectedCard={selectedCard} onClose={handleViewportClose} onUpdate={updateCard} />
        )}
      </div>

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {/* Card Grid Container - Moved down by one row height + gap */}
        <div className={`flex-1 space-y-6 overflow-y-auto w-full ${selectedCard && viewportMode === "enhanced" ? "mt-0" : "mt-[164px]"}`}>
          {Object.entries(cardRows).map(([rowIndex, rowCards]) => (
            <div key={rowIndex} className="w-full">
              <SortableContext items={rowCards.map((card) => card.id)} strategy={verticalListSortingStrategy}>
                <div className="grid grid-cols-5 gap-4 auto-rows-fr w-full">
                  {rowCards.map((card) => (
                    <div key={card.id} onClick={() => handleCardClick(card)}>
                      <InputCard card={card} onUpdate={updateCard} onDelete={deleteCard} />
                    </div>
                  ))}
                </div>
              </SortableContext>
            </div>
          ))}
        </div>

        <DragOverlay>
          {activeId ? (
            <InputCard card={cards.find((card) => card.id === activeId)!} onUpdate={() => {}} onDelete={() => {}} />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Button Controls - Keep in same position */}
      <div className="flex items-center justify-between mt-6 w-full">
        <div className="flex items-center space-x-2">
          <Button onClick={removeLastRow} size="sm" variant="outline" disabled={!canRemoveRow}>
            <Minus className="w-4 h-4" />
          </Button>
          <Button onClick={addNewRow} size="sm" variant="outline" disabled={!canAddRow}>
            <Plus className="w-4 h-4" />
            Add New Row
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={removeLastCard} size="sm" variant="outline" disabled={cards.length === 0}>
            <Minus className="w-4 h-4" />
          </Button>
          <Button onClick={addNewCard} size="sm" variant="outline" disabled={!canAddCard}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}