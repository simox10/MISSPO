import { ClientLayout } from "@/components/client-layout"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
}
