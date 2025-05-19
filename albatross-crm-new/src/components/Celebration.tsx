// app/components/Celebration.tsx
'use client'

import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'

interface CelebrationProps {
  trigger: boolean;
}

export function Celebration({ trigger }: CelebrationProps) {
  const [isCelebrating, setIsCelebrating] = useState(trigger)

  useEffect(() => {
    if (trigger) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      })
      
      const timer = setTimeout(() => setIsCelebrating(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isCelebrating])

  return (
    <button
      onClick={() => setIsCelebrating(true)}
      className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition"
    >
      🎉 Celebrate Team
    </button>
  )
}