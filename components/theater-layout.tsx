"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useProtoStore } from "@/store/proto-store"
import { Button } from "@/components/ui/button"
import { Minimize2, Split, Play, Square, Theater } from "lucide-react"
import { TheaterViewport } from "./theater-viewport"
import { PanelView } from "./panel-view"

interface TheaterLayoutProps {
  children?: React.ReactNode
}

export function TheaterLayout({ children }: TheaterLayoutProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [mode, setMode] = useState<"2D" | "3D" | "hybrid">("hybrid")
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    // Subscribe to store changes safely
    const unsubscribe = useProtoStore.subscribe(
      (state) => ({ mode: state.mode, isPlaying: state.isPlaying }),
      ({ mode, isPlaying }) => {
        setMode(mode)
        setIsPlaying(isPlaying)
      },
    )

    // Initial state
    const state = useProtoStore.getState()
    setMode(state.mode)
    setIsPlaying(state.isPlaying)

    return unsubscribe
  }, [])

  const handleModeChange = (newMode: "2D" | "3D" | "hybrid") => {
    useProtoStore.getState().setMode(newMode)
  }

  const handlePlayToggle = () => {
    useProtoStore.getState().setPlaying(!isPlaying)
  }

  const ViewModeButton = ({
    targetMode,
    icon: Icon,
    label,
  }: {
    targetMode: "2D" | "3D" | "hybrid"
    icon: any
    label: string
  }) => (
    <Button
      variant={mode === targetMode ? "default" : "outline"}
      size="sm"
      onClick={() => handleModeChange(targetMode)}
      className="flex items-center space-x-1"
    >
      <Icon className="w-4 h-4" />
      <span className="hidden sm:inline">{label}</span>
    </Button>
  )

  if (!isMounted) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <div className="text-white">Loading Theater Interface...</div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      {/* Mode Toggle Controls */}
      <div className="absolute top-4 right-4 z-50 flex space-x-2">
        <ViewModeButton targetMode="2D" icon={Minimize2} label="2D Panel" />
        <ViewModeButton targetMode="hybrid" icon={Split} label="Theater" />
        <ViewModeButton targetMode="3D" icon={Theater} label="3D Stage" />
      </div>

      {/* 3D Theater Viewport */}
      <div
        className={`
          transition-all duration-500 ease-in-out overflow-hidden
          ${mode === "2D" ? "h-0" : mode === "3D" ? "h-full" : "h-2/3"}
          ${mode === "hybrid" ? "border-b border-gray-700" : ""}
        `}
      >
        {mode !== "2D" && (
          <div className="h-full relative">
            <TheaterViewport />

            {/* Play Button - Theater Mode */}
            {(mode === "3D" || mode === "hybrid") && (
              <div className="absolute top-4 left-4 z-40">
                <Button variant={isPlaying ? "destructive" : "default"} size="sm" onClick={handlePlayToggle}>
                  {isPlaying ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? "Stop" : "Play"}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2D Panel Interface */}
      <div
        className={`
          transition-all duration-500 ease-in-out overflow-hidden
          ${mode === "3D" ? "h-0" : mode === "2D" ? "h-full" : "h-1/3"}
        `}
      >
        {mode !== "3D" && (
          <div className="h-full relative">
            <PanelView />
          </div>
        )}
      </div>

      {/* Theater Mode Indicator */}
      {mode === "hybrid" && (
        <div className="absolute left-1/2 top-2/3 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-orange-500/20 border border-orange-500/50 rounded-full p-2">
            <Theater className="w-4 h-4 text-orange-400" />
          </div>
        </div>
      )}
    </div>
  )
}
