"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { translations, type Locale, type TranslationKey } from "./i18n"

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: TranslationKey
  dir: "ltr" | "rtl"
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr")

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    document.documentElement.lang = newLocale
    document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr"
    if (newLocale === "ar") {
      document.body.classList.add("font-arabic")
    } else {
      document.body.classList.remove("font-arabic")
    }
  }, [])

  const dir = locale === "ar" ? "rtl" : "ltr"
  const t = translations[locale]

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
