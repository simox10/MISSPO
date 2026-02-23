"use client"

import { motion } from "framer-motion"

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  isVisible?: boolean;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
}

const SplitText = ({
  text,
  className = '',
  delay = 0.03,
  duration = 0.5,
  isVisible = false,
  tag = 'h3',
}: SplitTextProps) => {
  const letters = text.split('')

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: delay, delayChildren: 0 },
    }),
  }

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
    },
  }

  const MotionComponent = motion[tag] as any

  return (
    <MotionComponent
      className={className}
      variants={container}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      {letters.map((letter, index) => (
        <motion.span key={index} variants={child}>
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </MotionComponent>
  )
}

export default SplitText
