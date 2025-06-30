"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useProtoStore } from "@/store/proto-store"
import { Button } from "@/components/ui/button"
import { Maximize2, Minimize2, Split, Play, Square } from "lucide-react"
import { ProtoScene } from "./proto-scene"

interface Layout2D3DProps {
  children: React.ReactNode
}

export function Layout2D3D({ children }: Layout2D3DProps) {
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
    if (isMounted) {
      useProtoStore.getState().setMode(newMode)
    }
  }

  const handlePlayToggle = () => {
    if (isMounted) {
      useProtoStore.getState().setPlaying(!isPlaying)
    }
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
        <div className="text-white">Loading Interface...</div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      {/* Mode Toggle Controls */}
      <div className="absolute top-4 right-4 z-50 flex space-x-2">
        <ViewModeButton targetMode="2D" icon={Minimize2} label="2D Body" />
        <ViewModeButton targetMode="hybrid" icon={Split} label="Hybrid" />
        <ViewModeButton targetMode="3D" icon={Maximize2} label="3D Head" />
      </div>

      {/* 3D Head Viewport */}
      <div
        className={`
          transition-all duration-500 ease-in-out overflow-hidden
          ${mode === "2D" ? "h-0" : mode === "3D" ? "h-full" : "h-1/2"}
          ${mode === "hybrid" ? "border-b border-gray-700" : ""}
        `}
      >
        {mode !== "2D" && (
          <div className="h-full relative">
            <ProtoScene />

            {/* Play Button - Only in 3D Head view */}
            {mode === "3D" && (
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

      {/* 2D Body Interface */}
      <div
        className={`
          transition-all duration-500 ease-in-out overflow-hidden
          ${mode === "3D" ? "h-0" : mode === "2D" ? "h-full" : "h-1/2"}
        `}
      >
        {mode !== "3D" && (
          <div className="h-full relative">
            <div className="h-full overflow-y-auto">{children}</div>
          </div>
        )}
      </div>

      {/* Connection Indicator */}
      {mode === "hybrid" && (
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-purple-500/20 border border-purple-500/50 rounded-full p-2">
            <Split className="w-4 h-4 text-purple-400" />
          </div>
        </div>
      )}
    </div>
  )
}
