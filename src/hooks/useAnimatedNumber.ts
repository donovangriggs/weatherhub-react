import { useSpring, useMotionValue } from 'motion/react'
import { useEffect, useState } from 'react'

export const useAnimatedNumber = (target: number) => {
  const motionValue = useMotionValue(target)
  const springValue = useSpring(motionValue, { stiffness: 300, damping: 30, mass: 0.8 })
  const [display, setDisplay] = useState(Math.round(target))

  useEffect(() => {
    motionValue.set(target)
  }, [target, motionValue])

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest: number) => {
      setDisplay(Math.round(latest))
    })
    return unsubscribe
  }, [springValue])

  return display
}
