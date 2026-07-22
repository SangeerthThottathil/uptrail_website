import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Container } from '@/components/site-ui'
import { FinalCta } from '@/components/final-cta'
import { getPost, getPosts } from '@/lib/store/store'

import { sanitizeHtml } from '@/lib/sanitize'

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'Article | Uptrail' }
  return {
    title: post.seoTitle || `${post.title} | Uptrail`,
    description: post.metaDescription || post.excerpt,
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const cleanBodyHtml = sanitizeHtml(post.bodyContent || '')

  return (
    <>
      <article className="border-b border-border">
        <Container className="max-w-3xl pt-28 pb-16 sm:pt-32">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to blog
          </Link>

          <div className="label-mono mt-8 text-accent">{post.category}</div>
          <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
            {post.title}
          </h1>
          <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
            <span>{post.author}</span>
            <span>·</span>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>

          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl border border-border">
            <Image
              src={post.image || '/placeholder.svg'}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>

          <div className="mt-10 space-y-6 text-pretty text-lg leading-relaxed text-muted-foreground">
            {post.excerpt && (
              <p className="text-xl font-medium text-foreground leading-relaxed border-b border-border/60 pb-6">
                {post.excerpt}
              </p>
            )}
            {cleanBodyHtml ? (
              <div
                className="prose prose-lg max-w-none text-muted-foreground prose-headings:text-foreground prose-headings:font-semibold prose-a:text-accent prose-strong:text-foreground prose-blockquote:border-l-accent prose-blockquote:text-foreground/90 prose-img:rounded-xl prose-iframe:rounded-xl prose-table:border prose-th:bg-muted/50 prose-th:p-2 prose-td:p-2 prose-td:border"
                dangerouslySetInnerHTML={{ __html: cleanBodyHtml }}
              />
            ) : (
              <p className="italic text-muted-foreground">No article content available.</p>
            )}
          </div>
        </Container>
      </article>

      <FinalCta />
    </>
  )
}
