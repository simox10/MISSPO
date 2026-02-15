"use client"

import Link from "next/link"
import Image from "next/image"
import { MapPin, Phone, Mail } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function Footer() {
  const { t, dir } = useLanguage()

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/services", label: t.nav.services },
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
  ]

  return (
    <footer className="bg-misspo-rose-dark text-white" dir={dir}>
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Image
              src="/logo .jpg"
              alt="MISSPO Logo"
              width={120}
              height={43}
              className="h-10 w-auto object-contain rounded bg-white/90 px-2 py-1"
            />
            <p className="max-w-xs text-sm text-white/80 leading-relaxed">
              {t.footer.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/90">
              {t.footer.quickLinks}
            </h3>
            <ul className="flex flex-col gap-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/90">
              {t.footer.contactInfo}
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-2 text-sm text-white/70">
                <MapPin className="h-4 w-4 shrink-0 text-misspo-blue" />
                {t.contact.location}
              </li>
              <li>
                <a
                  href="tel:0622945571"
                  className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
                >
                  <Phone className="h-4 w-4 shrink-0 text-misspo-blue" />
                  0622945571
                </a>
              </li>
              <li>
                <a
                  href="mailto:wafaaoubouali91@gmail.com"
                  className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4 shrink-0 text-misspo-blue" />
                  wafaaoubouali91@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/20 pt-6 text-center">
          <p className="text-sm text-white/60">{t.footer.rights}</p>
        </div>
      </div>
    </footer>
  )
}
