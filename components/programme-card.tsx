import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Clock } from 'lucide-react'
import type { Programme } from '@/lib/data'

export function ProgrammeCard({ programme }: { programme: Programme }) {
  const basePath =
    programme.track === 'bootcamp'
      ? '/bootcamps'
      : programme.track === 'certification'
        ? '/certifications'
        : '/programmes'
  return (
    <Link
      href={`${basePath}/${programme.slug}`}
      className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)]"
    >
      <div>
        <div className="relative aspect-[16/9] overflow-hidden border-b border-border">
          <Image
            src={programme.image || '/placeholder.svg'}
            alt={`${programme.title} thumbnail`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="p-6">
        <div className="flex items-center justify-between">
          <span className="label-mono text-accent">{programme.category}</span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3.5" />
            {programme.duration}
          </span>
        </div>

        <h3 className="mt-4 text-xl font-semibold tracking-tight">
          {programme.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {programme.blurb}
        </p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {programme.skills.map((skill) => (
            <li
              key={skill}
              className="rounded-md border border-border bg-secondary/60 px-2.5 py-1 text-xs text-foreground/70"
            >
              {skill}
            </li>
          ))}
        </ul>
        </div>
      </div>

      <div className="mx-6 mb-6 flex items-center justify-between border-t border-border pt-4">
        <span className="text-sm font-medium text-foreground">
          {programme.level}
        </span>
        <span className="flex items-center gap-1 text-sm font-medium text-accent">
          Explore
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  )
}
