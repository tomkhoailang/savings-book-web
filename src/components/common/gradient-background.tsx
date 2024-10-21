import React from "react"

export default function GradientBackground({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-900 via-black  to-blue-800">
      <div className="min-h-screen">{children}</div>
    </div>
  )
}
