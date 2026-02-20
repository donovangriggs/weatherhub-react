import type { Variants, Transition } from 'motion/react'

// --- Shared transitions ---

export const springGentle: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 25,
  mass: 0.8,
}

export const springSnappy: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
}

export const easeFade: Transition = {
  duration: 0.4,
  ease: [0.25, 0.1, 0.25, 1],
}

// --- Page entrance (staggered sections) ---

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
}

export const fadeSlideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...easeFade, duration: 0.5 },
  },
}

// --- Hero content swap (day change / unit change) ---

export const contentSwap: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

export const contentSwapTransition: Transition = {
  duration: 0.25,
  ease: 'easeInOut',
}

// --- Search dropdown ---

export const dropdownVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -4,
    scale: 0.98,
    transition: { duration: 0.12 },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    y: -4,
    scale: 0.98,
    transition: { duration: 0.12 },
  },
}

// --- Weather illustration floating ---

export const floatingAnimation = {
  y: [0, -6, 0],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  },
}

// --- DayTile stagger ---

export const tileStaggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
}

export const tileEntrance: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springGentle,
  },
}

// --- QuickStats stagger ---

export const statsContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
}

export const statItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: springGentle },
}

// --- Toast notifications ---

export const toastVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, x: 80, transition: { duration: 0.2 } },
}

export const toastTransition: Transition = {
  type: 'spring',
  stiffness: 350,
  damping: 28,
}
