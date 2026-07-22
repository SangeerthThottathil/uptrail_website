import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { Container, SectionLabel } from '@/components/site-ui'
import { PageHeader } from '@/components/page-header'
import { getPosts } from '@/lib/store/store'

export const metadata: Metadata = {
  title: 'Blog | Uptrail',
  description:
    'Career advice, portfolio tips and industry insight to help you land your next role.',
}

export default async function BlogPage() {
  const posts = await getPosts()
  const featuredPost = posts.find((p) => p.isFeatured)

  const displayPosts = featuredPost
    ? posts.filter((p) => p.slug !== featuredPost.slug)
    : posts

  return (
    <>
      <PageHeader
        label="Blog"
        title="Advice for changing careers."
        description="Practical guidance from our mentors and careers team — on breaking in, building portfolios and landing offers."
      />

      {/* Featured */}
      {featuredPost ? (
        <section className="border-b border-border">
          <Container className="py-16 sm:py-20">
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="group grid gap-8 overflow-hidden rounded-2xl border border-border bg-secondary/40 transition-colors hover:bg-secondary lg:grid-cols-2 lg:items-center"
            >
              <div className="relative aspect-[16/10] overflow-hidden lg:h-full lg:aspect-auto">
                <Image
                  src={featuredPost.image || '/placeholder.svg'}
                  alt={featuredPost.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  priority
                />
              </div>
              <div className="p-7 sm:p-10">
                <div className="label-mono text-accent">{featuredPost.category}</div>
                <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                  {featuredPost.title}
                </h2>
                <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                  {featuredPost.excerpt}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
                  <span>{featuredPost.author}</span>
                  <span>·</span>
                  <span>{featuredPost.date}</span>
                  <span>·</span>
                  <span>{featuredPost.readingTime}</span>
                </div>
                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-foreground">
                  Read article
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </Link>
          </Container>
        </section>
      ) : null}

      {/* Grid */}
      <section>
        <Container className="py-16 sm:py-20">
          <SectionLabel>Latest articles</SectionLabel>
          <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {displayPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col bg-background transition-colors hover:bg-secondary/50"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={post.image || '/placeholder.svg'}
                    alt={post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <div className="label-mono text-muted-foreground">
                    {post.category}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold leading-snug tracking-tight">
                    {post.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                  <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{post.date}</span>
                    <span>{post.readingTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
