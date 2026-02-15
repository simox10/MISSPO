"use client"

import type { ReactNode } from "react"
import { LanguageProvider } from "@/lib/language-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </LanguageProvider>
  )
}
