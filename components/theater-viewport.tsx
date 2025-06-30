"use client"

import { Suspense, useRef, useMemo, useEffect, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, useGLTF, Environment, Html } from "@react-three/drei"
import { useProtoStore } from "@/store/proto-store"
import type * as THREE from "three"

function TheaterMPCModel() {
  const { scene } = useGLTF("/models/prototype_v4_03_01.glb")
  const modelRef = useRef<THREE.Group>(null)
  const { isPlaying, cards } = useProtoStore()

  // Extract existing planes from the GLTF model
  const planeRefs = useMemo(() => {
    const map = new Map<string, THREE.Object3D>()

    scene.traverse((obj) => {
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

    if (map.size === 0) {
      let count = 0
      scene.traverse((obj) => {
        if (obj.isMesh && count < 25) {
          map.set(`plane-${count}`, obj)
          count++
        }
      })
    }

    return map
  }, [scene])

  // Model rotation when playing
  useFrame((state, delta) => {
    if (modelRef.current && isPlaying) {
      modelRef.current.rotation.y += delta * 0.1
    }
  })

  return (
    <>
      {/* Scaled Z Plane (Table) */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 15]} />
        <meshStandardMaterial color="#1a1a1a" transparent opacity={0.3} />
      </mesh>

      {/* Main MPC Model */}
      <group ref={modelRef}>
        <primitive object={scene} scale={[3, 3, 3]} position={[0, -1, 0]} />
      </group>

      {/* Input Row Bus Visualization */}
      {cards.map((card, index) => {
        const rowIndex = Math.floor(index / 5)
        const cardIndex = index % 5
        const xPos = (cardIndex - 2) * 2
        const zPos = rowIndex * -2

        return (
          <group key={card.id} position={[xPos, 0.5, zPos]}>
            {/* Card representation in 3D */}
            <mesh>
              <boxGeometry args={[1.5, 0.1, 1]} />
              <meshStandardMaterial
                color={
                  card.gradient.color.includes("purple")
                    ? "#8b5cf6"
                    : card.gradient.color.includes("green")
                      ? "#10b981"
                      : card.gradient.color.includes("blue")
                        ? "#3b82f6"
                        : card.gradient.color.includes("orange")
                          ? "#f97316"
                          : "#6b7280"
                }
                transparent
                opacity={0.8}
              />
            </mesh>

            {/* Card info overlay */}
            <Html position={[0, 0.2, 0]} center>
              <div className="bg-black/80 backdrop-blur-sm rounded px-2 py-1 text-xs text-white min-w-[100px] text-center">
                <div className="font-medium">{card.title}</div>
                <div className="text-gray-400">{card.type}</div>
              </div>
            </Html>
          </group>
        )
      })}
    </>
  )
}

export function TheaterViewport() {
  const [isMounted, setIsMounted] = useState(false)
  const [cardCount, setCardCount] = useState(0)
  const [rowCount, setRowCount] = useState(0)

  useEffect(() => {
    setIsMounted(true)

    // Subscribe to store changes safely
    const unsubscribe = useProtoStore.subscribe(
      (state) => state.cards,
      (cards) => {
        setCardCount(cards.length)
        setRowCount(Math.ceil(cards.length / 5))
      },
    )

    // Initial state
    const state = useProtoStore.getState()
    setCardCount(state.cards.length)
    setRowCount(Math.ceil(state.cards.length / 5))

    return unsubscribe
  }, [])

  if (!isMounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-black">
        <div className="text-white">Loading Theater View...</div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{
          position: [0, 8, 12],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
        className="bg-gradient-to-b from-gray-900 via-gray-800 to-black"
      >
        <Suspense
          fallback={
            <Html center>
              <div className="text-white">Loading Theater View...</div>
            </Html>
          }
        >
          {/* Theater Lighting Setup */}
          <ambientLight intensity={0.3} />
          <directionalLight position={[10, 15, 5]} intensity={1.2} castShadow />
          <pointLight position={[-10, 10, -5]} intensity={0.8} />
          <spotLight position={[0, 20, 0]} angle={0.3} penumbra={1} intensity={1} castShadow />

          <TheaterMPCModel />

          <Environment preset="studio" />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={25}
            maxPolarAngle={Math.PI / 2.2}
          />
        </Suspense>
      </Canvas>

      {/* Theater Mode Indicator */}
      <div className="absolute top-4 left-4 z-40">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-gray-700">
          <h3 className="text-sm font-medium text-white">Theater Mode</h3>
          <p className="text-xs text-gray-400">Orthographic Row View</p>
        </div>
      </div>

      {/* Row Information */}
      <div className="absolute bottom-4 right-4 z-40">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-gray-700">
          <div className="text-sm text-white space-y-1">
            <div>Active Rows: {rowCount}</div>
            <div>Total Cards: {cardCount}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

useGLTF.preload("/models/prototype_v4_03_01.glb")
