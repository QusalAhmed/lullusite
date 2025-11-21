"use client"

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

type RevealProps = {
  children: React.ReactNode
  className?: string
  delay?: number
  hover?: boolean
}

export default function Reveal({ children, className = '', delay = 0, hover = false }: RevealProps) {
  const shouldReduceMotion = useReducedMotion()

  const hoverProps = hover && !shouldReduceMotion
    ? { whileHover: { scale: 1.03 }, whileTap: { scale: 0.995 } }
    : {}

  // If user prefers reduced motion, render children without motion wrapper to avoid any animation
  if (shouldReduceMotion) {
    return (
      <div className={className}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay }}
      {...hoverProps}
      className={className}
    >
      {children}
    </motion.div>
  )
}
