"use client"

import { Suspense, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, useGLTF, Environment, Html } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Square } from "lucide-react"
import type * as THREE from "three"

function MPCModelComponent() {
  const { scene } = useGLTF("/models/prototype_v4_03_01.glb")
  const modelRef = useRef<THREE.Group>(null)
  const [isRotating, setIsRotating] = useState(true)

  useFrame((state, delta) => {
    if (modelRef.current && isRotating) {
      modelRef.current.rotation.y += delta * 0.2
    }
  })

  return (
    <group ref={modelRef}>
      <primitive object={scene} scale={[2, 2, 2]} position={[0, -1, 0]} />

      {/* Interactive UI Elements */}
      <Html position={[2, 1, 0]} transform occlude>
        <Card className="p-4 bg-black/80 backdrop-blur-sm border-gray-700 min-w-[200px]">
          <div className="space-y-2">
            <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
              3D Model Active
            </Badge>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant={isRotating ? "destructive" : "default"}
                onClick={() => setIsRotating(!isRotating)}
              >
                {isRotating ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                {isRotating ? "Stop" : "Rotate"}
              </Button>
            </div>
            <p className="text-xs text-gray-400">Use mouse to orbit, zoom, and pan</p>
          </div>
        </Card>
      </Html>
    </group>
  )
}

export function MPCModel() {
  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }} className="bg-gradient-to-b from-gray-900 to-black">
        <Suspense
          fallback={
            <Html center>
              <div className="text-white">Loading 3D Model...</div>
            </Html>
          }
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} />

          <MPCModelComponent />

          <Environment preset="studio" />
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minDistance={3} maxDistance={15} />
        </Suspense>
      </Canvas>

      {/* 3D Controls Overlay */}
      <div className="absolute top-4 left-4">
        <Card className="p-3 bg-black/80 backdrop-blur-sm border-gray-700">
          <h3 className="font-medium mb-2">3D Controls</h3>
          <div className="text-xs text-gray-400 space-y-1">
            <div>• Left click + drag: Rotate</div>
            <div>• Right click + drag: Pan</div>
            <div>• Scroll: Zoom</div>
          </div>
        </Card>
      </div>
    </div>
  )
}

// Preload the model
useGLTF.preload("/models/prototype_v4_03_01.glb")
