"use client"

import React, { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  X, 
  FileText, 
  ImageIcon, 
  Music, 
  Video, 
  Code, 
  Upload,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  MoreVertical
} from "lucide-react"
import type { InputCardData } from "./input-card"

interface ViewportEditorProps {
  selectedCard: InputCardData | null
  cards: InputCardData[]
  onClose: () => void
  onUpdate: (id: string, updates: Partial<InputCardData>) => void
  onCardSelect: (card: InputCardData) => void
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

export function ViewportEditor({ selectedCard, cards, onClose, onUpdate, onCardSelect }: ViewportEditorProps) {
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")
  const [editType, setEditType] = useState<"script" | "text" | "audio" | "image" | "video">("text")

  useEffect(() => {
    if (selectedCard) {
      setEditTitle(selectedCard.title)
      setEditContent(selectedCard.content)
      setEditType(selectedCard.type)
    }
  }, [selectedCard])

  if (!selectedCard) return null

  const handleSave = () => {
    onUpdate(selectedCard.id, {
      title: editTitle,
      content: editContent,
      type: editType,
    })
  }

  const handleTypeChange = (newType: string) => {
    const type = newType as "script" | "text" | "audio" | "image" | "video"
    setEditType(type)
    onUpdate(selectedCard.id, { type })
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setEditContent(file.name)
        onUpdate(selectedCard.id, { content: file.name })
      }
      reader.readAsText(file)
    }
  }

  const renderMainViewportContent = () => {
    const Icon = typeIcons[editType]

    switch (editType) {
      case "image":
        return (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-4 p-6">
            <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600">
              {editContent && editContent !== "Enter content..." ? (
                <div className="text-center">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 text-orange-400" />
                  <p className="text-sm text-gray-300">{editContent}</p>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No image selected</p>
                </div>
              )}
            </div>
            <input
              type="file"
              onChange={handleFileUpload}
              accept="image/*"
              className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600"
            />
          </div>
        )
      case "audio":
        return (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-4 p-6">
            <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600">
              {editContent && editContent !== "Enter content..." ? (
                <div className="text-center">
                  <Music className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                  <p className="text-sm text-gray-300">{editContent}</p>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <Music className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No audio file selected</p>
                </div>
              )}
            </div>
            <input
              type="file"
              onChange={handleFileUpload}
              accept="audio/*"
              className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600"
            />
          </div>
        )
      case "video":
        return (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-4 p-6">
            <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600">
              {editContent && editContent !== "Enter content..." ? (
                <div className="text-center">
                  <Video className="w-16 h-16 mx-auto mb-4 text-red-400" />
                  <p className="text-sm text-gray-300">{editContent}</p>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No video file selected</p>
                </div>
              )}
            </div>
            <input
              type="file"
              onChange={handleFileUpload}
              accept="video/*"
              className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600"
            />
          </div>
        )
      case "text":
        return (
          <div className="w-full h-full p-6">
            <Textarea
              value={editContent}
              onChange={(e) => {
                setEditContent(e.target.value)
                onUpdate(selectedCard.id, { content: e.target.value })
              }}
              placeholder="Enter your text content..."
              className="w-full h-full bg-gray-800 border-gray-600 text-gray-300 resize-none min-h-[300px]"
            />
          </div>
        )
      case "script":
        return (
          <div className="w-full h-full p-6">
            <Textarea
              value={editContent}
              onChange={(e) => {
                setEditContent(e.target.value)
                onUpdate(selectedCard.id, { content: e.target.value })
              }}
              placeholder="Enter your script code..."
              className="w-full h-full bg-gray-900 border-gray-600 text-green-400 font-mono resize-none min-h-[300px]"
            />
          </div>
        )
      default:
        return (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Icon className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Select content type to begin</p>
            </div>
          </div>
        )
    }
  }

  // Find the index of the selected card and reorder cards starting from it
  const selectedIndex = cards.findIndex(card => card.id === selectedCard.id)
  const reorderedCards = selectedIndex !== -1 
    ? [...cards.slice(selectedIndex), ...cards.slice(0, selectedIndex)]
    : cards

  const Icon = typeIcons[editType]

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex">
      {/* Left Panel - Input Cards List */}
      <div className="w-80 bg-gray-900 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Input Cards</h3>
            <Button onClick={onClose} variant="ghost" size="sm">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-400 mt-1">Row 1</p>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {reorderedCards.map((card, index) => {
              const CardIcon = typeIcons[card.type]
              const isSelected = card.id === selectedCard.id
              
              return (
                <Card
                  key={card.id}
                  className={`p-3 cursor-pointer transition-all duration-200 border-gray-700 ${
                    isSelected 
                      ? "bg-blue-500/20 border-blue-500/50 ring-1 ring-blue-500/30" 
                      : "bg-gray-800/50 hover:bg-gray-800"
                  }`}
                  onClick={() => onCardSelect(card)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div
                        className="w-8 h-8 rounded flex items-center justify-center"
                        style={{
                          backgroundImage: `url(${card.gradient.url})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        <CardIcon className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-medium text-white truncate">{card.title}</h4>
                        <Badge variant="outline" className={typeColors[card.type]} size="sm">
                          {card.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2">{card.content}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Right Panel - Main Viewport */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gray-900 border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Icon className="w-5 h-5" />
                <Input
                  value={editTitle}
                  onChange={(e) => {
                    setEditTitle(e.target.value)
                    onUpdate(selectedCard.id, { title: e.target.value })
                  }}
                  placeholder="Card title"
                  className="bg-gray-800 border-gray-600 text-white font-medium w-64"
                />
              </div>
              
              <Select value={editType} onValueChange={handleTypeChange}>
                <SelectTrigger className="w-40 bg-gray-800 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>Text</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="script">
                    <div className="flex items-center space-x-2">
                      <Code className="w-4 h-4" />
                      <span>Script</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="audio">
                    <div className="flex items-center space-x-2">
                      <Music className="w-4 h-4" />
                      <span>Audio</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="image">
                    <div className="flex items-center space-x-2">
                      <ImageIcon className="w-4 h-4" />
                      <span>Image</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="video">
                    <div className="flex items-center space-x-2">
                      <Video className="w-4 h-4" />
                      <span>Video</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Badge variant="outline" className={typeColors[editType]}>
                {editType}
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <Button onClick={handleSave} size="sm" variant="default">
                Save
              </Button>
              <Button onClick={onClose} size="sm" variant="outline">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-gray-900">
          <Card className="h-full border-gray-700 bg-gray-900/50 backdrop-blur-sm overflow-hidden rounded-none border-0">
            {renderMainViewportContent()}
          </Card>
        </div>
      </div>
    </div>
  )
}