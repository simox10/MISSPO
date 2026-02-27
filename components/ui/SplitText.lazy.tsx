"use client"

import dynamic from 'next/dynamic'
import { ComponentProps } from 'react'

// Lazy load SplitText to reduce initial bundle
const SplitTextComponent = dynamic(() => import('./SplitText'), {
  ssr: false,
  loading: () => null,
})

export default function SplitTextLazy(props: ComponentProps<typeof SplitTextComponent>) {
  return <SplitTextComponent {...props} />
}
