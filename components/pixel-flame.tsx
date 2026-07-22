import { cn } from '@/lib/utils'

/**
 * A deterministic pixelated "flame" gradient inspired by Mistral's hero motif.
 * Renders a grid of square cells whose colour is driven by a heat function,
 * giving a warm yellow -> orange -> red band of pixels.
 */
export function PixelFlame({
  rows = 7,
  cols = 40,
  animated = true,
  className,
}: {
  rows?: number
  cols?: number
  animated?: boolean
  className?: string
}) {
  // A simple deterministic pseudo-random so server and client agree.
  const rand = (x: number, y: number) => {
    const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
    return n - Math.floor(n)
  }

  const cells: { key: string; color: string; opacity: number }[] = []
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // heat: hotter toward bottom rows and center-weighted noise
      const vertical = y / (rows - 1) // 0 top -> 1 bottom
      const noise = rand(x, y)
      const heat = vertical * 0.7 + noise * 0.5

      let color = 'transparent'
      let opacity = 0
      if (heat > 0.34) {
        if (heat > 0.92) color = 'var(--flame-deep)'
        else if (heat > 0.74) color = 'var(--flame-red)'
        else if (heat > 0.55) color = 'var(--flame-orange)'
        else color = 'var(--flame-yellow)'
        opacity = Math.min(1, 0.45 + heat * 0.6)
      }
      cells.push({ key: `${x}-${y}`, color, opacity })
    }
  }

  return (
    <div
      aria-hidden="true"
      className={cn('grid w-full gap-[2px]', animated && 'animate-flicker', className)}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      }}
    >
      {cells.map((c) => (
        <div
          key={c.key}
          className="aspect-square rounded-[2px]"
          style={{ backgroundColor: c.color, opacity: c.opacity }}
        />
      ))}
    </div>
  )
}
