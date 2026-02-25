import type { Metadata } from "next"
import { Poppins, Cairo } from "next/font/google"
import "./globals.css"
import { ClientLayout } from "@/components/client-layout"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cairo",
})

export const metadata: Metadata = {
  title: "MISSPO - Traitement Anti-Poux & Lentes | Casablanca",
  description:
    "MISSPO, sp\u00e9cialiste du traitement anti-poux \u00e0 Casablanca. Intervention professionnelle en milieu scolaire et \u00e0 domicile. M\u00e9thode douce, efficace et rassurante.",
  keywords: [
    "anti-poux",
    "traitement poux",
    "Casablanca",
    "lentes",
    "\u00e9cole",
    "domicile",
    "MISSPO",
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" dir="ltr" suppressHydrationWarning>
      <body className={`${poppins.variable} ${cairo.variable} font-sans antialiased`} suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
