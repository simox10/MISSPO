"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, Globe } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { locale, setLocale, t, dir } = useLanguage()
  const pathname = usePathname()

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/services", label: t.nav.services },
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
  ]

  const toggleLang = () => {
    setLocale(locale === "fr" ? "ar" : "fr")
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-misspo-rose-pale/50 shadow-sm" dir={dir}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logomisspocomplet.png"
            alt="MISSPO Logo"
            width={140}
            height={50}
            className="h-10 w-auto object-contain"
            priority
            quality={80}
            sizes="140px"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-misspo-rose-dark ${
                  isActive ? "text-misspo-rose-dark" : "text-foreground/80"
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 rounded-lg border border-misspo-blue-light px-3 py-1.5 text-sm font-medium text-misspo-blue-dark transition-colors hover:bg-misspo-blue-pale"
            aria-label="Switch language"
          >
            <Globe className="h-4 w-4" />
            {locale === "fr" ? t.lang.ar : t.lang.fr}
          </button>
          <Link href="/booking">
            <Button className="bg-misspo-rose-dark text-white hover:bg-misspo-rose transition-all shadow-md hover:shadow-lg">
              {t.nav.booking}
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-foreground p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t border-misspo-rose-pale/50 bg-white/90 backdrop-blur-lg lg:hidden animate-fade-in-up" dir={dir}>
          <nav className="flex flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-misspo-rose-pale hover:text-misspo-rose-dark ${
                    isActive ? "bg-misspo-rose-pale text-misspo-rose-dark" : "text-foreground/80"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <div className="mt-3 flex flex-col gap-2 border-t border-misspo-rose-pale pt-3">
              <button
                onClick={() => { toggleLang(); setMobileOpen(false) }}
                className="flex items-center gap-2 rounded-lg border border-misspo-blue-light px-4 py-2.5 text-sm font-medium text-misspo-blue-dark hover:bg-misspo-blue-pale"
              >
                <Globe className="h-4 w-4" />
                {locale === "fr" ? t.lang.ar : t.lang.fr}
              </button>
              <Link href="/booking" onClick={() => setMobileOpen(false)}>
                <Button className="w-full bg-misspo-rose-dark text-white hover:bg-misspo-rose">
                  {t.nav.booking}
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
