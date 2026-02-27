"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { MapPin, Phone, Mail } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { Parallax } from "react-scroll-parallax"

export function Footer() {
  const { t, dir } = useLanguage()
  const pathname = usePathname()

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/services", label: t.nav.services },
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
  ]

  return (
    <footer className="relative bg-white text-foreground border-t border-gray-200" dir={dir}>

      <div className="relative mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <Parallax speed={-2}>
            <div className="flex flex-col gap-4 items-center md:items-start" dir="ltr">
              <Image
                src="/logomisspocomplet.png"
                alt="MISSPO Logo"
                width={180}
                height={64}
                className="h-16 w-auto object-contain md:-ml-2"
              />
              <p className="max-w-xs text-sm text-muted-foreground leading-relaxed text-center md:text-left">
                {t.footer.description}
              </p>
            </div>
          </Parallax>

          {/* Quick Links */}
          <Parallax speed={0}>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-misspo-blue-dark">
                {t.footer.quickLinks}
              </h3>
              <ul className="flex flex-col gap-2">
                {links.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`text-sm transition-colors hover:text-misspo-blue-dark ${
                          isActive ? 'text-misspo-blue-dark font-semibold' : 'text-muted-foreground'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </Parallax>

          {/* Contact */}
          <Parallax speed={2}>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-misspo-rose-dark">
                {t.footer.contactInfo}
              </h3>
              <ul className="flex flex-col gap-3">
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0 text-misspo-blue-dark" />
                  {t.contact.location}
                </li>
                <li>
                  <a
                    href="tel:0622945571"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-misspo-blue-dark transition-colors"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-misspo-blue-dark" />
                    0622945571
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:wafaaoubouali91@gmail.com"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-misspo-blue-dark transition-colors"
                  >
                    <Mail className="h-4 w-4 shrink-0 text-misspo-blue-dark" />
                    wafaaoubouali91@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </Parallax>
        </div>

        <div className="mt-10 border-t border-misspo-blue-light/30 pt-6 text-center">
          <p className="text-sm text-muted-foreground">© 2026 MISSPO. Tous droits réservés. Développé par BLJServices.</p>
        </div>
      </div>
    </footer>
  )
}
