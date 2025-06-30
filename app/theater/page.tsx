"use client"

import dynamic from "next/dynamic"

// Dynamically import the TheaterLayout to avoid SSR issues
const TheaterLayout = dynamic(
  () => import("@/components/theater-layout").then((mod) => ({ default: mod.TheaterLayout })),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <div className="text-white">Loading Theater Mode...</div>
      </div>
    ),
  },
)

export default function TheaterMode() {
  return <TheaterLayout />
}
