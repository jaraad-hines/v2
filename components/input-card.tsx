"use client"

import type React from "react"

import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Code, FileText, Music, ImageIcon, Video } from "lucide-react"

export interface InputCardData {
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

interface InputCardProps {
  card: InputCardData
  onUpdate: (id: string, updates: Partial<InputCardData>) => void
  onDelete: (id: string) => void
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

export function InputCard({ card, onUpdate, onDelete }: InputCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [editTitle, setEditTitle] = useState(card.title)
  const [editContent, setEditContent] = useState(card.content)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onUpdate(card.id, { content: file.name })
    }
  }

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onDoubleClick={handleDoubleClick}
      className={`relative overflow-hidden bg-gray-900/50 backdrop-blur-sm transition-all duration-300 min-h-[140px] cursor-grab active:cursor-grabbing border-gray-700 border ${
        isDragging ? "opacity-50" : ""
      } ${isHovered ? "scale-105 shadow-lg shadow-black/25" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient Background */}
      <div
        className="absolute inset-0 opacity-40 rounded-lg overflow-hidden"
        style={{
          backgroundImage: `url(${card.gradient.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20" />
      </div>

      {/* Type Badge - Top Right */}
      <div
        className={`absolute top-3 right-3 transition-all duration-300 ${
          isHovered || isEditing ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-2"
        }`}
      >
        <div className="flex items-center space-x-2">
          <Icon className="w-4 h-4" />
          <Badge variant="outline" className={typeColors[card.type]}>
            {card.type}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="relative p-4 h-full flex flex-col justify-center">
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
              className="bg-gray-800 border-gray-600 min-h-[60px]"
            />
            {(card.type === "audio" || card.type === "image" || card.type === "video") && (
              <input
                type="file"
                onChange={handleFileUpload}
                accept={card.type === "audio" ? "audio/*" : card.type === "image" ? "image/*" : "video/*"}
                className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600"
              />
            )}
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
          <div
            className={`text-center transition-all duration-300 ${
              isHovered ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-2"
            }`}
          >
            <h3 className="font-medium text-white mb-1">{card.title}</h3>
            <p className="text-sm text-gray-300 line-clamp-2">{card.content}</p>
          </div>
        )}
      </div>

      {/* Hover Overlay */}
      {isHovered && !isEditing && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none transition-all duration-300" />
      )}
    </Card>
  )
}
