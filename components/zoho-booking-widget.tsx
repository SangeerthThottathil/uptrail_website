'use client'

import Script from 'next/script'
import { useEffect, useRef } from 'react'

interface ZohoBookingWidgetProps {
  bookingWidgetUrl: string
}

export function ZohoBookingWidget({ bookingWidgetUrl }: ZohoBookingWidgetProps) {
  const isInitialized = useRef(false)

  const initWidget = () => {
    if (isInitialized.current) return

    // @ts-ignore
    const bookings = window.Bookings
    if (bookings && bookings.inlineEmbed) {
      try {
        bookings.inlineEmbed({
          url: bookingWidgetUrl,
          parent: '#inline-container',
          height: '600px',
        })
        isInitialized.current = true
      } catch (err) {
        console.error('Error running Bookings.inlineEmbed:', err)
      }
    }
  }

  useEffect(() => {
    // @ts-ignore
    if (window.Bookings) {
      const container = document.getElementById('inline-container')
      if (container) {
        container.innerHTML = ''
      }
      isInitialized.current = false
      initWidget()
    }
  }, [bookingWidgetUrl])

  return (
    <div className="rounded-2xl border border-border bg-background p-4 shadow-md sm:p-6 min-h-[650px] flex flex-col w-full">
      <h2 className="text-xl font-semibold tracking-tight px-2 pb-3 border-b border-border mb-4">
        Select Date &amp; Time
      </h2>
      <div className="flex-1 w-full relative min-h-[600px]">
        <div
          id="inline-container"
          className="absolute inset-0 h-full w-full bg-transparent rounded-lg overflow-hidden"
        />
      </div>
      <Script
        src="https://bookings.nimbuspop.com/assets/embed.js"
        strategy="afterInteractive"
        onLoad={initWidget}
      />
    </div>
  )
}
