"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, ImageIcon, Music, Video, Code, X, Save } from "lucide-react"
import type { InputCardData } from "./input-card"

interface EnhancedViewportProps {
  selectedCard: InputCardData | null
  onClose: () => void
  onUpdate: (id: string, updates: Partial<InputCardData>) => void
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

export function EnhancedViewport({ selectedCard, onClose, onUpdate }: EnhancedViewportProps) {
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setEditContent(file.name)
    }
  }

  const handleTypeChange = (newType: string) => {
    setEditType(newType as "script" | "text" | "audio" | "image" | "video")
  }

  const renderViewportContent = () => {
    const Icon = typeIcons[editType]

    switch (editType) {
      case "image":
        return (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
            <div className="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center">
              {editContent && editContent !== "Enter content..." ? (
                <div className="text-center">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-300">{editContent}</p>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
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
          <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
            <div className="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center">
              {editContent && editContent !== "Enter content..." ? (
                <div className="text-center">
                  <Music className="w-12 h-12 mx-auto mb-2 text-purple-400" />
                  <p className="text-sm text-gray-300">{editContent}</p>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <Music className="w-12 h-12 mx-auto mb-2 opacity-50" />
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
          <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
            <div className="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center">
              {editContent && editContent !== "Enter content..." ? (
                <div className="text-center">
                  <Video className="w-12 h-12 mx-auto mb-2 text-red-400" />
                  <p className="text-sm text-gray-300">{editContent}</p>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <Video className="w-12 h-12 mx-auto mb-2 opacity-50" />
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
          <div className="w-full h-full p-4">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Enter your text content..."
              className="w-full h-full bg-gray-800 border-gray-600 text-gray-300 resize-none"
            />
          </div>
        )
      case "script":
        return (
          <div className="w-full h-full p-4">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Enter your script code..."
              className="w-full h-full bg-gray-900 border-gray-600 text-green-400 font-mono resize-none"
            />
          </div>
        )
      default:
        return (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Icon className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Select content type to begin</p>
            </div>
          </div>
        )
    }
  }

  const Icon = typeIcons[editType]

  return (
    <div className="w-full h-[140px] mb-6">
      <Card className="h-full border-gray-700 bg-gray-900/50 backdrop-blur-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <Icon className="w-5 h-5" />
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Card title"
              className="bg-gray-800 border-gray-600 text-white font-medium w-48"
            />
            <Select value={editType} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-32 bg-gray-800 border-gray-600">
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
              <Save className="w-3 h-3 mr-1" />
              Save
            </Button>
            <Button onClick={onClose} size="sm" variant="outline">
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-60px)]">{renderViewportContent()}</div>
      </Card>
    </div>
  )
}
