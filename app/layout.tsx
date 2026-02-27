import type { Metadata } from "next"
import { Poppins, Cairo } from "next/font/google"
import "./globals.css"
import { ClientLayout } from "@/components/client-layout"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
  preload: true,
})

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cairo",
  display: "swap",
  preload: true,
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
      <head>
        {/* Preconnect to external origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS Prefetch for faster lookups */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        
        {/* Preload critical LCP image */}
        <link
          rel="preload"
          as="image"
          href="/oncom.png"
          imageSrcSet="/_next/image?url=%2Foncom.png&w=640&q=65 640w, /_next/image?url=%2Foncom.png&w=1080&q=65 1080w, /_next/image?url=%2Foncom.png&w=1200&q=65 1200w"
          imageSizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          fetchPriority="high"
        />
      </head>
      <body className={`${poppins.variable} ${cairo.variable} font-sans antialiased`} suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
