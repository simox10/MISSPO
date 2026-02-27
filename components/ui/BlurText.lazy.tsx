"use client"

import dynamic from 'next/dynamic'
import { ComponentProps } from 'react'

// Lazy load BlurText to reduce initial bundle
const BlurTextComponent = dynamic(() => import('./BlurText'), {
  ssr: false,
  loading: () => null,
})

export default function BlurTextLazy(props: ComponentProps<typeof BlurTextComponent>) {
  return <BlurTextComponent {...props} />
}
