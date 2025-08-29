'use client'
import { useEffect } from 'react'
import confetti from 'canvas-confetti'

interface CelebrationProps {
  trigger: boolean;
}

export function Celebration({ trigger }: CelebrationProps) {
  useEffect(() => {
    if (trigger) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }, [trigger]) // Now properly responds to prop changes

  // return (
  //   <button
  //     onClick={() => {
  //       confetti({
  //         particleCount: 150,
  //         spread: 70,
  //         origin: { y: 0.6 }
  //       })
  //     }}
  //     className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition"
  //   >
  //     🎉 Celebrate Team
  //   </button>
  // )
}