"use client"

import React, { useState } from "react"
import {
  Maximize2,
  MoreVertical,
  Upload,
  FileText,
  ImageIcon,
  Music,
  Video,
  Code,
  Minimize2
} from "lucide-react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

// ✅ Z Plane integration
import { ViewportRendererExtended } from "./ViewportRendererExtended"
import { getZPlane } from "./zPlaneRegistry"
import { ScaledZPlane } from "./ScaledZPlane"

interface ViewportData {
  id: string
  title: string
  type: "empty" | "text" | "image" | "audio" | "video" | "code"
  content?: string
  isMaximized?: boolean
}

export function ViewportGrid() {
  const [viewports, setViewports] = useState<ViewportData[]>([
    { id: "1", title: "Viewport 1", type: "empty" },
    { id: "2", title: "Viewport 2", type: "image", content: "/placeholder.svg?height=200&width=300" },
    { id: "3", title: "Viewport 3", type: "text", content: "Sample text content for viewport 3..." },
    {
      id: "4",
      title: "Viewport 4",
      type: "code",
      content: 'function beatPattern() {\n  return "kick, snare, kick, snare";\n}',
    },
  ])

  const [maximizedViewport, setMaximizedViewport] = useState<string | null>(null)

  const updateViewport = (id: string, updates: Partial<ViewportData>) => {
    setViewports(viewports.map((vp) => (vp.id === id ? { ...vp, ...updates } : vp)))
  }

  const handleFileUpload = (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const fileType = file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("audio/")
          ? "audio"
          : file.type.startsWith("video/")
            ? "video"
            : "text"

      updateViewport(id, {
        type: fileType,
        content: URL.createObjectURL(file),
        title: file.name,
      })
    }
  }

  const toggleMaximize = (id: string) => {
    setMaximizedViewport(maximizedViewport === id ? null : id)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image": return ImageIcon
      case "audio": return Music
      case "video": return Video
      case "text": return FileText
      case "code": return Code
      default: return Upload
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "image": return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "audio": return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "video": return "bg-red-500/20 text-red-400 border-red-500/30"
      case "text": return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "code": return "bg-green-500/20 text-green-400 border-green-500/30"
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const zPlane = getZPlane()

  const renderViewportContent = (viewport: ViewportData) => {
    let contentBlock

    switch (viewport.type) {
      case "image":
        contentBlock = (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={viewport.content || "/placeholder.svg"}
              alt={viewport.title}
              className="max-w-full max-h-full object-contain rounded"
            />
          </div>
        )
        break
      case "audio":
        contentBlock = (
          <div className="w-full h-full flex items-center justify-center">
            <audio controls className="w-full">
              <source src={viewport.content} />
              Your browser does not support the audio element.
            </audio>
          </div>
        )
        break
      case "video":
        contentBlock = (
          <div className="w-full h-full flex items-center justify-center">
            <video controls className="max-w-full max-h-full rounded">
              <source src={viewport.content} />
              Your browser does not support the video element.
            </video>
          </div>
        )
        break
      case "text":
        contentBlock = (
          <div className="w-full h-full p-4 overflow-auto">
            <pre className="text-sm text-gray-300 whitespace-pre-wrap">{viewport.content}</pre>
          </div>
        )
        break
      case "code":
        contentBlock = (
          <div className="w-full h-full p-4 overflow-auto bg-gray-900 rounded">
            <pre className="text-sm text-green-400 font-mono">{viewport.content}</pre>
          </div>
        )
        break
      default:
        contentBlock = (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Upload className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Drop files here or click to upload</p>
            </div>
          </div>
        )
    }

    return (
      <>
        {contentBlock}
        <ViewportRendererExtended card_id={viewport.id} content={viewport.content || ""} />
        {zPlane.mesh && <ScaledZPlane mesh={zPlane.mesh} content={viewport.content || ""} />}
      </>
    )
  }

  if (maximizedViewport) {
    const viewport = viewports.find((vp) => vp.id === maximizedViewport)!
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={getTypeColor(viewport.type)}>
              {React.createElement(getTypeIcon(viewport.type), { className: "w-3 h-3 mr-1" })}
              {viewport.type}
            </Badge>
            <h3 className="font-medium">{viewport.title}</h3>
          </div>
          <Button onClick={() => toggleMaximize(viewport.id)} variant="outline" size="sm">
            <Minimize2 className="w-4 h-4" />
          </Button>
        </div>
        <Card className="flex-1 border-gray-700 bg-gray-900/50 overflow-hidden">
          {renderViewportContent(viewport)}
        </Card>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Viewports</h2>
        <div className="text-sm text-gray-400">2×2 Grid</div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4">
        {viewports.map((viewport) => {
          const TypeIcon = getTypeIcon(viewport.type)

          return (
            <Card
              key={viewport.id}
              className="border-gray-700 bg-gray-900/50 backdrop-blur-sm overflow-hidden group hover:border-gray-600 transition-colors"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-3 border-b border-gray-700">
                <div className="flex items-center space-x-2">
                  <TypeIcon className="w-4 h-4" />
                  <span className="text-sm font-medium truncate">{viewport.title}</span>
                  {viewport.type !== "empty" && (
                    <Badge variant="outline" className={getTypeColor(viewport.type)}>
                      {viewport.type}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center space-x-1">
                  <Button
                    onClick={() => toggleMaximize(viewport.id)}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <label className="flex items-center cursor-pointer">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload File
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => handleFileUpload(viewport.id, e)}
                            accept="image/*,audio/*,video/*,.txt,.js,.json,.md"
                          />
                        </label>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          updateViewport(viewport.id, {
                            type: "empty",
                            content: undefined,
                            title: `Viewport ${viewport.id}`,
                          })
                        }
                      >
                        Clear
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Content */}
              <div className="h-48 relative">
                {renderViewportContent(viewport)}
                {viewport.type === "empty" && (
                  <label className="absolute inset-0 cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileUpload(viewport.id, e)}
                      accept="image/*,audio/*,video/*,.txt,.js,.json,.md"
                    />
                  </label>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
