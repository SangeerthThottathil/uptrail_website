import Image from 'next/image'
import { Container, SectionLabel } from '@/components/site-ui'
import { PixelFlame } from '@/components/pixel-flame'

export function PageHeader({
  label,
  title,
  description,
  flame = true,
  image,
  imageAlt,
}: {
  label: string
  title: string
  description?: string
  flame?: boolean
  image?: string
  imageAlt?: string
}) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {flame && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 opacity-80">
          <PixelFlame rows={7} cols={56} className="h-full" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        </div>
      )}
      <Container className="relative pt-28 pb-14 sm:pt-32 sm:pb-16">
        {image ? (
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
            <div className="max-w-2xl animate-fade-up">
              <SectionLabel>{label}</SectionLabel>
              <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
                {title}
              </h1>
              {description && (
                <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
            <div className="relative aspect-[4/3] animate-fade-up overflow-hidden rounded-2xl border border-border lg:aspect-[5/4]">
              <Image
                src={image || '/placeholder.svg'}
                alt={imageAlt || title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover"
              />
            </div>
          </div>
        ) : (
          <div className="max-w-3xl animate-fade-up">
            <SectionLabel>{label}</SectionLabel>
            <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              {title}
            </h1>
            {description && (
              <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}
      </Container>
    </section>
  )
}
