'use client'

import { useEffect, useState } from 'react'

const WORDS = ['Matter', 'Build Expertise', 'Gets Hired!']

export function RotatingHeadline() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const cycle = setInterval(() => {
      // fade out, swap word, fade back in
      setVisible(false)
      const swap = setTimeout(() => {
        setIndex((i) => (i + 1) % WORDS.length)
        setVisible(true)
      }, 350)
      return () => clearTimeout(swap)
    }, 2600)

    return () => clearInterval(cycle)
  }, [])

  return (
    <h1 className="text-balance text-5xl font-medium leading-[0.95] tracking-tight sm:text-6xl md:text-7xl lg:text-[5.75rem]">
      Build Skills That
      <br />
      <span
        className={`inline-block text-accent transition-all duration-300 ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
        }`}
        aria-live="polite"
      >
        {WORDS[index]}
      </span>
    </h1>
  )
}
