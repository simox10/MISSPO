"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { LanguageProvider } from "@/lib/language-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith("/adminmisspo")

  if (isAdminRoute) {
    return <>{children}</>
  }

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
