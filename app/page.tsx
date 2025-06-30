"use client"

import dynamic from "next/dynamic"

// Dynamically import the main layout to avoid SSR issues
const Layout2D3D = dynamic(() => import("@/components/layout-2d3d").then((mod) => ({ default: mod.Layout2D3D })), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      <div className="text-white">Loading Visual MPC IDE...</div>
    </div>
  ),
})

const InputCardBoard = dynamic(
  () => import("@/components/input-card-board").then((mod) => ({ default: mod.InputCardBoard })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <div className="text-white">Loading Cards...</div>
      </div>
    ),
  },
)

export default function VisualMPCIDE() {
  return (
    <Layout2D3D>
      <div className="min-h-full bg-black text-white">
        {/* Main Content */}
        <main className="h-full">
          <div className="h-full p-6">
            <InputCardBoard />
          </div>
        </main>
      </div>
    </Layout2D3D>
  )
}
