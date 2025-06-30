"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProtoStore } from "@/store/proto-store"
import { Code, FileText, Music, ImageIcon, Video, Edit3, Eye } from "lucide-react"

interface InputRowCardData {
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

const typeIcons = {
  script: Code,
  text: FileText,
  audio: Music,
  image: ImageIcon,
  video: Video,
}

const typeColors = {
  script: "bg-green-500/20 text-green-400 border-green-500/30",
  text: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  audio: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  image: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  video: "bg-red-500/20 text-red-400 border-red-500/30",
}

function InputRowCard({
  card,
  onUpdate,
  onSelect,
  isSelected,
}: {
  card: InputRowCardData
  onUpdate: (id: string, updates: Partial<InputRowCardData>) => void
  onSelect: (id: string) => void
  isSelected: boolean
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(card.title)
  const [editContent, setEditContent] = useState(card.content)

  const Icon = typeIcons[card.type]

  const handleSave = () => {
    onUpdate(card.id, { title: editTitle, content: editContent })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditTitle(card.title)
    setEditContent(card.content)
    setIsEditing(false)
  }

  return (
    <Card
      className={`p-4 cursor-pointer transition-all duration-200 ${
        isSelected ? "ring-2 ring-blue-500 bg-blue-500/10" : "hover:bg-gray-800/50"
      }`}
      onClick={() => onSelect(card.id)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon className="w-4 h-4" />
          <Badge variant="outline" className={typeColors[card.type]}>
            {card.type}
          </Badge>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation()
            setIsEditing(!isEditing)
          }}
        >
          {isEditing ? <Eye className="w-3 h-3" /> : <Edit3 className="w-3 h-3" />}
        </Button>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Card title"
            className="bg-gray-800 border-gray-600"
          />
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Card content"
            className="bg-gray-800 border-gray-600 min-h-[80px]"
          />
          <div className="flex space-x-2">
            <Button onClick={handleSave} size="sm">
              Save
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm">
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <h4 className="font-medium text-white mb-2">{card.title}</h4>
          <p className="text-sm text-gray-300 line-clamp-3">{card.content}</p>
        </div>
      )}
    </Card>
  )
}

function InputRowBus() {
  const [cards, setCards] = useState<any[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    // Subscribe to store changes safely
    const unsubscribe = useProtoStore.subscribe(
      (state) => ({ cards: state.cards, selectedId: state.selectedId }),
      ({ cards, selectedId }) => {
        setCards(cards)
        setSelectedId(selectedId)
      },
    )

    // Initial state
    const state = useProtoStore.getState()
    setCards(state.cards)
    setSelectedId(state.selectedId)

    return unsubscribe
  }, [])

  const handleSelect = (id: string) => {
    useProtoStore.getState().selectCard(id)
  }

  const handleUpdate = (id: string, updates: Partial<InputRowCardData>) => {
    useProtoStore.getState().updateContent(id, updates)
  }

  // Group cards by rows
  const cardRows = cards.reduce(
    (acc, card, index) => {
      const rowIndex = Math.floor(index / 5)
      if (!acc[rowIndex]) acc[rowIndex] = []
      acc[rowIndex].push(card)
      return acc
    },
    {} as Record<number, any[]>,
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Input Row Bus</h3>
        <Badge variant="outline">{cards.length} Cards</Badge>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-4">
          {Object.entries(cardRows).map(([rowIndex, rowCards]) => (
            <div key={rowIndex} className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-sm font-medium text-gray-400">Row {Number.parseInt(rowIndex) + 1}</span>
                <div className="flex-1 h-px bg-gray-700"></div>
              </div>
              <div className="grid grid-cols-1 gap-2 pl-4">
                {rowCards.map((card) => (
                  <InputRowCard
                    key={card.id}
                    card={card}
                    onUpdate={handleUpdate}
                    onSelect={handleSelect}
                    isSelected={selectedId === card.id}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

function CardContentPreview() {
  const [selectedCard, setSelectedCard] = useState<any>(null)

  useEffect(() => {
    // Subscribe to store changes safely
    const unsubscribe = useProtoStore.subscribe(
      (state) => ({ cards: state.cards, selectedId: state.selectedId }),
      ({ cards, selectedId }) => {
        const card = cards.find((c: any) => c.id === selectedId)
        setSelectedCard(card || null)
      },
    )

    // Initial state
    const state = useProtoStore.getState()
    const card = state.cards.find((c: any) => c.id === state.selectedId)
    setSelectedCard(card || null)

    return unsubscribe
  }, [])

  if (!selectedCard) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Select a card to preview content</p>
        </div>
      </div>
    )
  }

  const Icon = typeIcons[selectedCard.type]

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-700">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{
            backgroundImage: `url(${selectedCard.gradient.url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-white">{selectedCard.title}</h3>
          <Badge variant="outline" className={typeColors[selectedCard.type]}>
            {selectedCard.type}
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-400 mb-2 block">Content</label>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">{selectedCard.content}</pre>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-400 mb-2 block">Properties</label>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Type:</span>
                <span className="text-white">{selectedCard.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Row:</span>
                <span className="text-white">{selectedCard.row + 1}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Gradient:</span>
                <span className="text-white">{selectedCard.gradient.name}</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

export function PanelView() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="h-full bg-gray-900 text-white flex items-center justify-center">
        <div className="text-white">Loading Panel View...</div>
      </div>
    )
  }

  return (
    <div className="h-full bg-gray-900 text-white">
      <Tabs defaultValue="bus" className="h-full flex flex-col">
        <div className="border-b border-gray-700 px-4 py-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bus">Input Row Bus</TabsTrigger>
            <TabsTrigger value="preview">Content Preview</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="bus" className="h-full p-4 m-0">
            <InputRowBus />
          </TabsContent>

          <TabsContent value="preview" className="h-full p-4 m-0">
            <CardContentPreview />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
