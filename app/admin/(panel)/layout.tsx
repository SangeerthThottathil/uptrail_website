import type { Metadata } from 'next'
import { AdminSidebar } from '@/components/admin/sidebar'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Admin | Uptrail',
  robots: { index: false, follow: false },
}

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-background">
      <AdminSidebar />
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Truly fixed/sticky top navigation bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card/85 backdrop-blur-md px-5 sm:px-8 z-40">
          <div id="admin-header-title" className="text-lg font-semibold tracking-tight text-foreground truncate" />
          <div id="admin-header-actions" className="flex items-center gap-2" />
        </header>

        {/* Scrollable content container */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
