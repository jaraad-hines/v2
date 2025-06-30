"use client"

import { Suspense, useRef, useMemo, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, useGLTF, Environment, Html } from "@react-three/drei"
import { useProtoStore } from "@/store/proto-store"
import type * as THREE from "three"

function MPCModelWithExistingPlanes() {
  const { scene } = useGLTF("/models/prototype_v4_03_01.glb")
  const modelRef = useRef<THREE.Group>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [cards, setCards] = useState<any[]>([])

  useEffect(() => {
    // Subscribe to store changes safely
    const unsubscribe = useProtoStore.subscribe(
      (state) => ({ isPlaying: state.isPlaying, cards: state.cards }),
      ({ isPlaying, cards }) => {
        setIsPlaying(isPlaying)
        setCards(cards)
      },
    )

    // Initial state
    const state = useProtoStore.getState()
    setIsPlaying(state.isPlaying)
    setCards(state.cards)

    return unsubscribe
  }, [])

  // Extract existing planes from the GLTF model (keep the detection fix)
  const planeRefs = useMemo(() => {
    const map = new Map<string, THREE.Object3D>()

    scene.traverse((obj) => {
      // Look for meshes that could be planes
      if (
        obj.isMesh &&
        (obj.name.includes("Plane") ||
          obj.name.includes("Pad") ||
          obj.name.includes("Button") ||
          obj.name.startsWith("Obj"))
      ) {
        map.set(obj.name, obj)
      }
    })

    // If no named planes found, create references to the first few meshes
    if (map.size === 0) {
      let count = 0
      scene.traverse((obj) => {
        if (obj.isMesh && count < 25) {
          map.set(`plane-${count}`, obj)
          count++
        }
      })
    }

    console.log("🎯 Detected planes:", Array.from(map.keys()))
    return map
  }, [scene])

  // Model rotation when playing
  useFrame((state, delta) => {
    if (modelRef.current && isPlaying) {
      modelRef.current.rotation.y += delta * 0.2
    }
  })

  return (
    <group ref={modelRef}>
      <primitive object={scene} scale={[2, 2, 2]} position={[0, -1, 0]} />
    </group>
  )
}

export function ProtoScene() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <div className="text-white">Loading 3D Scene...</div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }} className="bg-gradient-to-b from-gray-900 to-black">
        <Suspense
          fallback={
            <Html center>
              <div className="text-white">Loading 3D Scene...</div>
            </Html>
          }
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} />

          <MPCModelWithExistingPlanes />

          <Environment preset="studio" />
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minDistance={2} maxDistance={10} />
        </Suspense>
      </Canvas>
    </div>
  )
}

useGLTF.preload("/models/prototype_v4_03_01.glb")
