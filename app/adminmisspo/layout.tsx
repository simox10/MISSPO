import type { Metadata } from "next"
import "../globals.css"

export const metadata: Metadata = {
  title: "MISSPO Admin",
  description: "Panneau d'administration MISSPO",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
