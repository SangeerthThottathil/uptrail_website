import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 py-20 animate-fade-in">
      <div className="relative flex items-center justify-center">
        {/* Outer ring */}
        <div className="absolute size-12 rounded-full border-4 border-accent/10" />
        {/* Spinning indicator */}
        <Loader2 className="size-8 animate-spin text-accent" />
      </div>
      <p className="text-xs font-mono tracking-wider text-muted-foreground uppercase">
        Loading...
      </p>
    </div>
  )
}
