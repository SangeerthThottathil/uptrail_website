import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import { headers } from 'next/headers'
import './globals.css'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { AnnouncementBar } from '@/components/announcement-bar'
import { getSettings, getFeaturedProgrammes } from '@/lib/store/store'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono-custom',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Uptrail — Live mentor-led career programmes',
  description:
    'Uptrail runs live, mentor-led career programmes that help graduates and career switchers break into data, business and digital roles. 1500+ learners trained across 55+ countries.',
  generator: 'v0.app',
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#0056d2',
}

import { ScrollToTop } from '@/components/scroll-to-top'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headerList = await headers()
  console.log("RootLayout incoming x-pathname header:", headerList.get('x-pathname'))
  const isAdmin = (headerList.get('x-pathname') ?? '').startsWith('/admin')
  const [settings, featuredProgrammes] = await Promise.all([
    getSettings(),
    getFeaturedProgrammes(),
  ])

  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} bg-background`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="font-sans antialiased">
        <ScrollToTop />
        {isAdmin ? (
          children
        ) : (
          <>
            <div className="sticky top-0 z-50 flex flex-col">
              <AnnouncementBar announcement={settings.announcement} />
              <SiteHeader header={settings.header} featuredProgrammes={featuredProgrammes} />
            </div>
            {children}
            <SiteFooter footer={settings.footer} social={settings.social} />
          </>
        )}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
