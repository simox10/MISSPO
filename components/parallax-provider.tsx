"use client"

import { ParallaxProvider as ScrollParallaxProvider } from "react-scroll-parallax"
import { ReactNode } from "react"

export function ParallaxProvider({ children }: { children: ReactNode }) {
  return <ScrollParallaxProvider>{children}</ScrollParallaxProvider>
}
