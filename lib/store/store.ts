import {
  programmes as seedProgrammes,
  testimonials as seedTestimonials,
  videoTestimonials as seedVideoTestimonials,
  employers as seedEmployers,
  stats as seedStats,
  posts as seedPosts,
} from '@/lib/data'
import { defaultSettings } from './defaults'
import { createServerComponentClient, getServiceRoleClient, getPublicServerClient } from '@/lib/supabase'
import { unstable_cache, revalidateTag as nextRevalidateTag } from 'next/cache'
const revalidateTag = nextRevalidateTag as unknown as (tag: string) => void
import { sanitizeEmbedCode } from '@/lib/utils'
import type {
  Programme,
  Testimonial,
  VideoTestimonial,
  Employer,
  Stat,
  Post,
  SiteSettings,
  Track,
  ProgrammeApplication,
  ContactSubmission,
  ContactSource,
  SuccessStory,
  HireTalentSubmission,
  DiscoveryCallSubmission,
} from './types'

function id(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
}

/* ----------------------------- Helpers ------------------------------ */

async function isTableEmpty(table: string): Promise<boolean> {
  try {
    const supabase = getPublicServerClient()
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })
    if (error) return true
    return count === 0
  } catch {
    return true
  }
}

export async function checkDatabaseEmpty(): Promise<boolean> {
  return isTableEmpty('programmes')
}

function mapProgrammeFromDb(p: any): Programme {
  return {
    slug: p.slug,
    title: p.title,
    category: p.category,
    track: p.track,
    duration: p.duration || '',
    format: p.format || '',
    level: p.level || '',
    blurb: p.blurb || '',
    skills: p.skills || [],
    outcomes: p.outcomes || '',
    salary: p.salary || '',
    image: p.image || '',
    modules: p.modules || [],
    price: p.price || undefined,
    aboutRole: p.about_role || '',
    salaryLadder: p.salary_ladder || [],
    certifications: p.certifications || [],
    faqs: p.faqs || [],
    showInMenu: !!p.show_in_menu,
    paymentOptions: (p.programme_payment_options || []).map((o: any) => {
      let rawPillText = o.pill_text || ''
      const hasMarker = rawPillText.endsWith('::highlighted')
      const pillText = hasMarker ? rawPillText.replace(/::highlighted$/, '') : rawPillText
      const isHighlighted = !!o.is_highlighted || hasMarker

      return {
        id: o.id,
        pillText,
        title: o.title || '',
        description: o.description || '',
        bulletPoints: o.bullet_points || [],
        buttonLabel: o.button_label || '',
        icon: o.icon || 'Wallet',
        redirectUrl: o.redirect_url || '',
        isHighlighted,
      }
    }),
    seoTitle: p.seo_title || '',
    metaDescription: p.meta_description || '',
  }
}

function mapProgrammeToDb(p: Programme, hasSeo: boolean = false) {
  const obj: any = {
    slug: p.slug,
    title: p.title,
    category: p.category,
    track: p.track,
    duration: p.duration,
    format: p.format,
    level: p.level,
    blurb: p.blurb,
    skills: p.skills,
    outcomes: p.outcomes,
    salary: p.salary,
    image: p.image,
    modules: p.modules,
    price: p.price,
    about_role: p.aboutRole,
    salary_ladder: p.salaryLadder,
    certifications: p.certifications,
    faqs: p.faqs,
    show_in_menu: p.showInMenu || false,
    updated_at: new Date().toISOString(),
  }
  if (hasSeo) {
    obj.seo_title = p.seoTitle || ''
    obj.meta_description = p.metaDescription || ''
  }
  return obj
}

async function checkProgrammesHasSeo(): Promise<boolean> {
  try {
    const serviceClient = getServiceRoleClient()
    const { error } = await serviceClient
      .from('programmes')
      .select('seo_title')
      .limit(1)
    return !error
  } catch (e) {
    return false
  }
}

/* ----------------------------- Seed Database -------------------------- */

export async function seedDatabase() {
  const serviceClient = getServiceRoleClient()
  const hasSeo = await checkProgrammesHasSeo()

  try {
    console.log('Seeding programmes...')
    for (const prog of seedProgrammes) {
      await serviceClient.from('programmes').upsert(mapProgrammeToDb(prog, hasSeo))
    }
  } catch (e) { console.warn('Seeding programmes error:', e) }

  try {
    console.log('Seeding testimonials...')
    await serviceClient.from('testimonials').delete().neq('id', 0)
    for (let i = 0; i < seedTestimonials.length; i++) {
      const t = seedTestimonials[i]
      await serviceClient.from('testimonials').insert({
        quote: t.quote,
        name: t.name,
        role: t.role,
        programme: t.programme,
        rating: t.rating,
        order_index: i,
      })
    }
  } catch (e) { console.warn('Seeding testimonials error:', e) }

  try {
    console.log('Seeding video testimonials...')
    await serviceClient.from('video_testimonials').delete().neq('id', 0)
    for (let i = 0; i < seedVideoTestimonials.length; i++) {
      const v = seedVideoTestimonials[i]
      await serviceClient.from('video_testimonials').insert({
        name: v.name,
        role: v.role,
        programme: v.programme,
        quote: v.quote,
        poster: v.poster,
        src: v.src,
        order_index: i,
      })
    }
  } catch (e) { console.warn('Seeding video testimonials error:', e) }

  try {
    console.log('Seeding employers...')
    await serviceClient.from('employers').delete().neq('id', 0)
    for (let i = 0; i < seedEmployers.length; i++) {
      const emp = seedEmployers[i]
      await serviceClient.from('employers').insert({
        name: emp.name,
        slug: emp.slug,
        order_index: i,
      })
    }
  } catch (e) { console.warn('Seeding employers error:', e) }

  try {
    console.log('Seeding stats...')
    await serviceClient.from('stats').delete().neq('id', 0)
    for (let i = 0; i < seedStats.length; i++) {
      const s = seedStats[i]
      await serviceClient.from('stats').insert({
        value: s.value,
        label: s.label,
        order_index: i,
      })
    }
  } catch (e) { console.warn('Seeding stats error:', e) }

  try {
    console.log('Seeding posts...')
    for (let i = 0; i < seedPosts.length; i++) {
      const post = seedPosts[i]
      await serviceClient.from('posts').upsert({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        date: post.date,
        reading_time: post.readingTime,
        author: post.author,
        image: post.image,
        order_index: i,
      })
    }
  } catch (e) { console.warn('Seeding posts error:', e) }

  try {
    console.log('Seeding settings...')
    await serviceClient.from('site_settings').upsert({
      key: 'default',
      general: defaultSettings.general,
      contact: defaultSettings.contact,
      announcement: defaultSettings.announcement,
      header: defaultSettings.header,
      footer: defaultSettings.footer,
      social: defaultSettings.social,
    })
  } catch (e) { console.warn('Seeding settings error:', e) }

  console.log('Database seeded successfully!')
  try { revalidateTag('programmes') } catch (e) {}
  try { revalidateTag('testimonials') } catch (e) {}
  try { revalidateTag('video_testimonials') } catch (e) {}
  try { revalidateTag('employers') } catch (e) {}
  try { revalidateTag('stats') } catch (e) {}
  try { revalidateTag('posts') } catch (e) {}
  try { revalidateTag('settings') } catch (e) {}
}

/* ----------------------------- Programmes ------------------------------ */

export function getProgrammes(track?: string): Promise<Programme[]> {
  return unstable_cache(
    async () => {
      try {
        const supabase = getPublicServerClient()
        let query = supabase.from('programmes').select('*, programme_payment_options(*)')
        if (track) {
          query = query.eq('track', track)
        }
        let { data, error } = await query

        if (error && (error.code === 'PGRST205' || error.message.includes('programme_payment_options'))) {
          // Fallback if table doesn't exist yet
          let fallbackQuery = supabase.from('programmes').select('*')
          if (track) {
            fallbackQuery = fallbackQuery.eq('track', track)
          }
          const res = await fallbackQuery
          data = res.data
          error = res.error
        }

        if (error) throw error
        if (!data || data.length === 0) {
          return track ? seedProgrammes.filter((p) => p.track === track) : seedProgrammes
        }
        return data.map(mapProgrammeFromDb)
      } catch (err) {
        console.error('Error fetching programmes from Supabase, falling back to seed:', err)
        return track ? seedProgrammes.filter((p) => p.track === track) : seedProgrammes
      }
    },
    ['programmes', track || 'all'],
    { tags: ['programmes'], revalidate: 1 }
  )()
}

export function getProgramme(slug: string): Promise<Programme | undefined> {
  return unstable_cache(
    async () => {
      try {
        const supabase = getPublicServerClient()
        let { data, error } = await supabase
          .from('programmes')
          .select('*, programme_payment_options(*)')
          .eq('slug', slug)
          .single()

        if (error && (error.code === 'PGRST205' || error.message.includes('programme_payment_options'))) {
          // Fallback
          const res = await supabase
            .from('programmes')
            .select('*')
            .eq('slug', slug)
            .single()
          data = res.data
          error = res.error
        }

        if (error) {
          if (error.code === 'PGRST116') {
            if (await isTableEmpty('programmes')) {
              return seedProgrammes.find((p) => p.slug === slug)
            }
            return undefined
          }
          throw error
        }
        if (!data) return undefined
        return mapProgrammeFromDb(data)
      } catch (err) {
        console.error(`Error fetching programme ${slug} from Supabase, falling back to seed:`, err)
        return seedProgrammes.find((p) => p.slug === slug)
      }
    },
    ['programme', slug],
    { tags: ['programmes'], revalidate: 1 }
  )()
}

export function getFeaturedProgrammes(): Promise<Programme[]> {
  return unstable_cache(
    async () => {
      try {
        const supabase = getPublicServerClient()
        const { data, error } = await supabase
          .from('programmes')
          .select('*')
          .eq('show_in_menu', true)
        if (error) throw error
        if (!data || data.length === 0) {
          return seedProgrammes.filter((p) => p.showInMenu)
        }
        return data.map(mapProgrammeFromDb)
      } catch (err) {
        console.error('Error fetching featured programmes from Supabase:', err)
        return seedProgrammes.filter((p) => p.showInMenu)
      }
    },
    ['featured_programmes'],
    { tags: ['programmes'], revalidate: 1 }
  )()
}

export async function upsertProgramme(programme: Programme, originalSlug?: string) {
  const serviceClient = getServiceRoleClient()
  const key = originalSlug ?? programme.slug
  const hasSeo = await checkProgrammesHasSeo()

  // Enforce featured menu limit of 3 on backend
  if (programme.showInMenu) {
    const { data: featured, error: countErr } = await serviceClient
      .from('programmes')
      .select('slug')
      .eq('track', programme.track)
      .eq('show_in_menu', true)
      .neq('slug', originalSlug ?? programme.slug)
    if (countErr) throw countErr
    if (featured && featured.length >= 3) {
      const categoryName =
        programme.track === 'career'
          ? 'Career Programmes'
          : programme.track === 'bootcamp'
            ? 'Bootcamps'
            : 'Certifications'
      throw new Error(
        `Maximum of 3 featured programmes allowed in ${categoryName}. Turn one off before adding another.`
      )
    }
  }

  // If the slug changed, insert the new one first, migrate referenced rows, then delete the old one
  if (originalSlug && originalSlug !== programme.slug) {
    const payload = mapProgrammeToDb(programme, hasSeo)
    const { error } = await serviceClient.from('programmes').insert(payload)
    if (error) throw error

    // Update child references to the new slug
    await serviceClient
      .from('programme_payment_options')
      .update({ programme_slug: programme.slug })
      .eq('programme_slug', originalSlug)

    await serviceClient
      .from('testimonial_programmes')
      .update({ programme_slug: programme.slug })
      .eq('programme_slug', originalSlug)

    // Safely delete the old programme row
    await serviceClient.from('programmes').delete().eq('slug', originalSlug)
  } else {
    // Normal upsert (either new insert, or editing details without changing slug)
    const payload = mapProgrammeToDb(programme, hasSeo)
    const { error } = await serviceClient.from('programmes').upsert(payload)
    if (error) throw error
  }

  try {
    // Check if is_highlighted column exists in programme_payment_options
    let hasIsHighlighted = false
    try {
      const { error: colCheck } = await serviceClient
        .from('programme_payment_options')
        .select('is_highlighted')
        .limit(1)
      if (!colCheck) {
        hasIsHighlighted = true
      }
    } catch (e) {}

    await serviceClient.from('programme_payment_options').delete().eq('programme_slug', programme.slug)
    if (programme.paymentOptions && programme.paymentOptions.length > 0) {
      const highlightedIndex = programme.paymentOptions.findIndex((o) => !!o.isHighlighted)

      const rows = programme.paymentOptions.map((o, idx) => {
        const isOptHighlighted = idx === highlightedIndex
        let finalPillText = (o.pillText || '').replace(/::highlighted$/, '')
        if (!hasIsHighlighted && isOptHighlighted) {
          finalPillText = `${finalPillText}::highlighted`
        }

        const row: any = {
          programme_slug: programme.slug,
          pill_text: finalPillText,
          title: o.title,
          description: o.description,
          bullet_points: o.bulletPoints,
          button_label: o.buttonLabel,
          icon: o.icon || 'Wallet',
          redirect_url: o.redirectUrl || '',
          display_order: idx,
        }
        if (hasIsHighlighted) {
          row.is_highlighted = isOptHighlighted
        }
        return row
      })
      const { error: insErr } = await serviceClient.from('programme_payment_options').insert(rows)
      if (insErr) {
        console.warn('Could not insert payment options (table may not exist):', insErr)
      }
    }
  } catch (err) {
    console.warn('Could not save payment options (table may not exist):', err)
  }

  revalidateTag('programmes')
}

export async function deleteProgramme(slug: string) {
  const serviceClient = getServiceRoleClient()
  const { error } = await serviceClient.from('programmes').delete().eq('slug', slug)
  if (error) throw error

  revalidateTag('programmes')
}

/* ---------------------------- Testimonials ----------------------------- */

export function getTestimonials(): Promise<Testimonial[]> {
  return unstable_cache(
    async () => {
      try {
        const supabase = getPublicServerClient()
        
        let selectFields = ['quote', 'name', 'role', 'programme', 'rating', 'order_index']
        
        try {
          const { error: fError } = await supabase
            .from('testimonials')
            .select('is_featured')
            .limit(1)
          if (!fError) {
            selectFields.push('is_featured', 'featured_title')
          }
        } catch (e) {}

        let hasImage = false
        try {
          const { error: iError } = await supabase
            .from('testimonials')
            .select('image')
            .limit(1)
          if (!iError) {
            hasImage = true
            selectFields.push('image')
          }
        } catch (e) {}

        let hasIframeUrl = false
        try {
          const { error: ifError } = await supabase
            .from('testimonials')
            .select('iframe_url')
            .limit(1)
          if (!ifError) {
            hasIframeUrl = true
            selectFields.push('iframe_url')
          }
        } catch (e) {}

        const { data, error } = await supabase
          .from('testimonials')
          .select(selectFields.join(', '))
          .order('order_index', { ascending: true })
          .order('id', { ascending: true })

        if (error) throw error
        if (!data || data.length === 0) return seedTestimonials
        return data.map((t: any) => {
          let quote = t.quote || ''
          let iframeUrl = t.iframe_url || ''
          if (!iframeUrl && quote.startsWith('::iframe::')) {
            iframeUrl = quote.replace('::iframe::', '')
            quote = ''
          }
          return {
            quote,
            name: t.name || '',
            role: t.role || '',
            programme: t.programme || '',
            rating: t.rating || 5,
            isFeatured: !!t.is_featured,
            featuredTitle: t.featured_title || '',
            image: t.image || '',
            iframeUrl,
          }
        })
      } catch (err) {
        console.error('Error fetching testimonials from Supabase, falling back to seed:', err)
        return seedTestimonials
      }
    },
    ['testimonials'],
    { tags: ['testimonials'], revalidate: 1 }
  )()
}

export function getFeaturedTestimonial(): Promise<Testimonial | undefined> {
  return unstable_cache(
    async () => {
      try {
        const supabase = getPublicServerClient()
        const { data, error } = await supabase
          .from('testimonials')
          .select('quote, name, role, programme, rating, is_featured, featured_title')
          .eq('is_featured', true)
          .limit(1)

        if (error) {
          if (error.code === '42703' || error.message.includes('is_featured')) {
            return undefined
          }
          throw error
        }
        if (!data || data.length === 0) return undefined
        const t = data[0]
        return {
          quote: t.quote,
          name: t.name,
          role: t.role,
          programme: t.programme,
          rating: t.rating,
          isFeatured: !!t.is_featured,
          featuredTitle: t.featured_title || '',
        }
      } catch (err) {
        console.error('Error fetching featured testimonial:', err)
        return undefined
      }
    },
    ['featured_testimonial'],
    { tags: ['testimonials'], revalidate: 1 }
  )()
}

export async function setTestimonials(items: Testimonial[]) {
  const serviceClient = getServiceRoleClient()

  // Check if is_featured column exists
  let hasIsFeatured = false
  try {
    const { error: colCheckError } = await serviceClient
      .from('testimonials')
      .select('is_featured')
      .limit(1)
    if (!colCheckError) {
      hasIsFeatured = true
    }
  } catch (e) {
    // Ignore
  }

  // Check if image column exists
  let hasImage = false
  try {
    const { error: imgCheckError } = await serviceClient
      .from('testimonials')
      .select('image')
      .limit(1)
    if (!imgCheckError) {
      hasImage = true
    }
  } catch (e) {}

  // Check if iframe_url column exists
  let hasIframeUrl = false
  try {
    const { error: ifCheckError } = await serviceClient
      .from('testimonials')
      .select('iframe_url')
      .limit(1)
    if (!ifCheckError) {
      hasIframeUrl = true
    }
  } catch (e) {}

  // Clean slate replacement matching CollectionEditor logic
  const { error: delError } = await serviceClient.from('testimonials').delete().neq('id', 0)
  if (delError) throw delError

  for (let i = 0; i < items.length; i++) {
    const t = items[i]
    let quoteVal = t.quote || ''
    if (!hasIframeUrl && t.iframeUrl && t.iframeUrl.trim()) {
      quoteVal = `::iframe::${t.iframeUrl.trim()}`
    }

    const insertObj: any = {
      quote: quoteVal,
      name: t.name || '',
      role: t.role || '',
      programme: t.programme || '',
      rating: t.rating || 5,
      order_index: i,
    }
    if (hasIsFeatured) {
      if (t.isFeatured !== undefined) insertObj.is_featured = t.isFeatured
      if (t.featuredTitle !== undefined) insertObj.featured_title = t.featuredTitle
    }
    if (hasImage && t.image !== undefined) {
      insertObj.image = t.image
    }
    if (hasIframeUrl && t.iframeUrl !== undefined) {
      insertObj.iframe_url = t.iframeUrl
    }

    const { error } = await serviceClient.from('testimonials').insert(insertObj)
    if (error) throw error
  }

  try {
    revalidateTag('testimonials')
  } catch (e) {}
}

/* -------------------------- Success Stories ---------------------------- */

export const seedSuccessStories: SuccessStory[] = [
  {
    id: 1,
    name: 'Maya Thompson',
    fromRole: 'Barista',
    toRole: 'Data Analyst at Monzo',
    story: 'Maya joined our Data Analytics programme with zero technical background. Within four months of graduating she landed her first analyst role and has since been promoted twice.',
    isFeatured: true,
    featuredTitle: 'How Maya went from barista to data analyst.',
    displayOrder: 0,
  },
  {
    id: 2,
    name: 'Daniel Wright',
    fromRole: 'Admin assistant',
    toRole: 'Business Analyst at HSBC',
    story: 'Daniel used the portfolio he built on the Business Analysis bootcamp to walk into interviews with proof of his skills — and three competing offers.',
    isFeatured: false,
    featuredTitle: 'How Daniel went from admin assistant to business analyst.',
    displayOrder: 1,
  },
  {
    id: 3,
    name: 'Priya Sharma',
    fromRole: 'Teacher',
    toRole: 'Associate PM at Amazon',
    story: 'A career switcher in her late twenties, Priya credits the community and weekly mentor sessions for keeping her accountable through the transition.',
    isFeatured: false,
    featuredTitle: 'How Priya went from teacher to associate PM.',
    displayOrder: 2,
  },
]

export function getSuccessStories(): Promise<SuccessStory[]> {
  return unstable_cache(
    async () => {
      try {
        const supabase = getPublicServerClient()
        const { data, error } = await supabase
          .from('success_stories')
          .select('id, name, from_role, to_role, story, is_featured, featured_title, display_order')
          .order('display_order', { ascending: true })
          .order('id', { ascending: true })
        
        if (error) throw error
        if (!data || data.length === 0) return seedSuccessStories
        return data.map((s: any) => ({
          id: s.id,
          name: s.name,
          fromRole: s.from_role || '',
          toRole: s.to_role || '',
          story: s.story || '',
          isFeatured: !!s.is_featured,
          featuredTitle: s.featured_title || '',
          displayOrder: s.display_order || 0,
        }))
      } catch (err) {
        console.error('Error fetching success stories, falling back to seed:', err)
        return seedSuccessStories
      }
    },
    ['success_stories'],
    { tags: ['success_stories'], revalidate: 1 }
  )()
}

export function getFeaturedSuccessStory(): Promise<SuccessStory | undefined> {
  return unstable_cache(
    async () => {
      try {
        const supabase = getPublicServerClient()
        const { data, error } = await supabase
          .from('success_stories')
          .select('id, name, from_role, to_role, story, is_featured, featured_title, display_order')
          .eq('is_featured', true)
          .limit(1)
        
        if (error) throw error
        if (!data || data.length === 0) {
          return seedSuccessStories.find((s) => s.isFeatured)
        }
        const s = data[0]
        return {
          id: s.id,
          name: s.name,
          fromRole: s.from_role || '',
          toRole: s.to_role || '',
          story: s.story || '',
          isFeatured: !!s.is_featured,
          featuredTitle: s.featured_title || '',
          displayOrder: s.display_order || 0,
        }
      } catch (err) {
        console.error('Error fetching featured success story, falling back to seed:', err)
        return seedSuccessStories.find((s) => s.isFeatured)
      }
    },
    ['featured_success_story'],
    { tags: ['success_stories'], revalidate: 1 }
  )()
}

export async function setSuccessStories(items: SuccessStory[]) {
  const serviceClient = getServiceRoleClient()
  try {
    const { error: delError } = await serviceClient.from('success_stories').delete().neq('id', 0)
    if (delError) {
      if (delError.code === '42P01') {
        throw new Error("Database table 'success_stories' does not exist. Please run the SQL migration script to create it in your Supabase SQL Editor.")
      }
      throw delError
    }

    for (let i = 0; i < items.length; i++) {
      const s = items[i]
      const { error } = await serviceClient.from('success_stories').insert({
        name: s.name,
        from_role: s.fromRole,
        to_role: s.toRole,
        story: s.story,
        is_featured: s.isFeatured || false,
        featured_title: s.featuredTitle || '',
        display_order: i,
      })
      if (error) {
        if (error.code === '42P01') {
          throw new Error("Database table 'success_stories' does not exist. Please run the SQL migration script to create it in your Supabase SQL Editor.")
        }
        throw error
      }
    }
  } catch (err: any) {
    console.error('Could not save success stories:', err)
    if (err.code === '42P01' || (err.message && err.message.includes('success_stories'))) {
      throw new Error("Database table 'success_stories' does not exist. Please run the SQL migration script to create it in your Supabase SQL Editor.")
    }
    throw err
  }

  revalidateTag('success_stories')
}

/* ------------------------- Video testimonials -------------------------- */

export function getVideoTestimonials(): Promise<VideoTestimonial[]> {
  return unstable_cache(
    async () => {
      try {
        const supabase = getPublicServerClient()
        let data: any[] | null = null
        let error: any = null

        const firstQuery = await supabase
          .from('video_testimonials')
          .select(`
            id,
            name,
            role,
            programme,
            quote,
            poster,
            src,
            show_on_home,
            testimonial_programmes (
              programme_slug
            )
          `)
          .order('order_index', { ascending: true })
          .order('id', { ascending: true })

        data = firstQuery.data
        error = firstQuery.error

        if (error && (error.code === '42703' || error.message.includes('show_on_home'))) {
          // Retry without show_on_home
          const { data: retryData, error: retryError } = await supabase
            .from('video_testimonials')
            .select(`
              id,
              name,
              role,
              programme,
              quote,
              poster,
              src,
              testimonial_programmes (
                programme_slug
              )
            `)
            .order('order_index', { ascending: true })
            .order('id', { ascending: true })
          data = retryData
          error = retryError
        }

        if (error) {
          // Fallback if the join table does not exist in the database schema yet
          if (error.code === 'PGRST205' || error.message.includes('testimonial_programmes')) {
            const { data: fallbackData, error: fallbackError } = await supabase
              .from('video_testimonials')
              .select('*')
              .order('order_index', { ascending: true })
              .order('id', { ascending: true })
            if (fallbackError) throw fallbackError
            return (fallbackData || []).map((v: any) => ({
              id: v.id,
              name: v.name,
              role: v.role,
              programme: v.programme,
              quote: v.quote,
              poster: v.poster,
              src: v.src,
              programmeSlugs: [],
              showOnHome: !!v.show_on_home,
            }))
          }
          throw error
        }

        if (!data || data.length === 0) return seedVideoTestimonials
        return data.map((v: any) => ({
          id: v.id,
          name: v.name,
          role: v.role,
          programme: v.programme,
          quote: v.quote,
          poster: v.poster,
          src: v.src,
          programmeSlugs: (v.testimonial_programmes || []).map((tp: any) => tp.programme_slug),
          showOnHome: !!v.show_on_home,
        }))
      } catch (err) {
        console.error('Error fetching video testimonials from Supabase, falling back to seed:', err)
        return seedVideoTestimonials
      }
    },
    ['video_testimonials'],
    { tags: ['video_testimonials'], revalidate: 1 }
  )()
}

export function getHomeVideoTestimonials(): Promise<VideoTestimonial[]> {
  return unstable_cache(
    async () => {
      try {
        const supabase = getPublicServerClient()
        let { data, error } = await supabase
          .from('video_testimonials')
          .select(`
            id, name, role, programme, quote, poster, src, show_on_home,
            testimonial_programmes (programme_slug)
          `)
          .eq('show_on_home', true)
          .order('order_index', { ascending: true })

        if (error && (error.code === '42703' || error.message.includes('show_on_home'))) {
          // Fallback: return all video testimonials
          const all = await getVideoTestimonials()
          return all
        }

        if (error) throw error
        if (!data || data.length === 0) return []

        return data.map((v: any) => ({
          id: v.id,
          name: v.name,
          role: v.role,
          programme: v.programme,
          quote: v.quote,
          poster: v.poster,
          src: v.src,
          programmeSlugs: (v.testimonial_programmes || []).map((tp: any) => tp.programme_slug),
          showOnHome: !!v.show_on_home,
        }))
      } catch (err) {
        console.error('Error fetching home video testimonials:', err)
        return []
      }
    },
    ['home_video_testimonials'],
    { tags: ['video_testimonials'], revalidate: 1 }
  )()
}

export async function setVideoTestimonials(items: VideoTestimonial[]) {
  const serviceClient = getServiceRoleClient()

  // Validate and sanitize embed codes first
  const sanitizedItems = items.map((item) => {
    try {
      const cleanSrc = sanitizeEmbedCode(item.src)
      return { ...item, src: cleanSrc }
    } catch (err: any) {
      throw new Error(`Invalid embed code for "${item.name}": ${err.message}`)
    }
  })

  // Check if show_on_home column exists
  let hasShowOnHome = false
  try {
    const { error: colCheckError } = await serviceClient
      .from('video_testimonials')
      .select('show_on_home')
      .limit(1)
    if (!colCheckError) {
      hasShowOnHome = true
    }
  } catch (e) {
    // Ignore
  }

  const { error: delError } = await serviceClient.from('video_testimonials').delete().neq('id', 0)
  if (delError) throw delError

  for (let i = 0; i < sanitizedItems.length; i++) {
    const v = sanitizedItems[i]
    
    const insertObj: any = {
      name: v.name,
      role: v.role,
      programme: v.programme,
      quote: v.quote,
      poster: v.poster,
      src: v.src,
      order_index: i,
    }
    if (hasShowOnHome && v.showOnHome !== undefined) {
      insertObj.show_on_home = v.showOnHome
    }

    const { data: inserted, error } = await serviceClient
      .from('video_testimonials')
      .insert(insertObj)
      .select('id')
      .single()
    if (error) throw error

    // Insert join table relations
    if (inserted && v.programmeSlugs && v.programmeSlugs.length > 0) {
      const relations = v.programmeSlugs.map((slug) => ({
        testimonial_id: inserted.id,
        programme_slug: slug,
      }))
      const { error: relError } = await serviceClient
        .from('testimonial_programmes')
        .insert(relations)
      if (relError) {
        console.warn('Error inserting relations (table may be missing):', relError)
      }
    }
  }

  revalidateTag('video_testimonials')
}

export async function getProgrammeVideoTestimonials(programmeSlug: string): Promise<VideoTestimonial[]> {
  try {
    const supabase = getPublicServerClient()
    const { data, error } = await supabase
      .from('testimonial_programmes')
      .select(`
        video_testimonials (
          id,
          name,
          role,
          programme,
          quote,
          poster,
          src
        )
      `)
      .eq('programme_slug', programmeSlug)

    if (error) {
      // Fallback if the join table doesn't exist yet
      if (error.code === 'PGRST205' || error.message.includes('testimonial_programmes')) {
        const allVideos = await getVideoTestimonials()
        const { data: prog, error: progErr } = await supabase
          .from('programmes')
          .select('title')
          .eq('slug', programmeSlug)
          .single()
        if (progErr || !prog) return []
        return allVideos.filter((v) => v.programme === prog.title)
      }
      throw error
    }

    if (!data) return []
    return data
      .map((row: any) => row.video_testimonials)
      .filter(Boolean)
      .map((v: any) => ({
        id: v.id,
        name: v.name,
        role: v.role,
        programme: v.programme,
        quote: v.quote,
        poster: v.poster,
        src: v.src,
      }))
  } catch (err) {
    console.error(`Error fetching testimonials for ${programmeSlug}:`, err)
    try {
      const prog = await getProgramme(programmeSlug)
      if (!prog) return []
      const allVideos = await getVideoTestimonials()
      return allVideos.filter((v) => v.programme === prog.title)
    } catch (fallbackErr) {
      console.error(`Error in fallback video testimonial fetch for ${programmeSlug}:`, fallbackErr)
      return []
    }
  }
}

/* ------------------------------ Employers ------------------------------ */

export function getEmployers(): Promise<Employer[]> {
  return unstable_cache(
    async () => {
      try {
        const supabase = getPublicServerClient()
        const { data, error } = await supabase
          .from('employers')
          .select('*')
          .order('order_index', { ascending: true })
          .order('id', { ascending: true })
        if (error) throw error
        if (!data || data.length === 0) return seedEmployers
        return data.map((e: any) => ({
          name: e.name,
          slug: e.slug,
        }))
      } catch (err) {
        console.error('Error fetching employers from Supabase, falling back to seed:', err)
        return seedEmployers
      }
    },
    ['employers'],
    { tags: ['employers'], revalidate: 1 }
  )()
}

export async function setEmployers(items: Employer[]) {
  const serviceClient = getServiceRoleClient()
  const { error: delError } = await serviceClient.from('employers').delete().neq('id', 0)
  if (delError) throw delError

  for (let i = 0; i < items.length; i++) {
    const emp = items[i]
    const { error } = await serviceClient.from('employers').insert({
      name: emp.name,
      slug: emp.slug,
      order_index: i,
    })
    if (error) throw error
  }

  revalidateTag('employers')
}

/* -------------------------------- Stats -------------------------------- */

export function getStats(): Promise<Stat[]> {
  return unstable_cache(
    async () => {
      try {
        const supabase = getPublicServerClient()
        const { data, error } = await supabase
          .from('stats')
          .select('*')
          .order('order_index', { ascending: true })
          .order('id', { ascending: true })
        if (error) throw error
        if (!data || data.length === 0) return seedStats
        return data.map((s: any) => ({
          value: s.value,
          label: s.label,
        }))
      } catch (err) {
        console.error('Error fetching stats from Supabase, falling back to seed:', err)
        return seedStats
      }
    },
    ['stats'],
    { tags: ['stats'], revalidate: 1 }
  )()
}

export async function setStats(items: Stat[]) {
  const serviceClient = getServiceRoleClient()
  const { error: delError } = await serviceClient.from('stats').delete().neq('id', 0)
  if (delError) throw delError

  for (let i = 0; i < items.length; i++) {
    const s = items[i]
    const { error } = await serviceClient.from('stats').insert({
      value: s.value,
      label: s.label,
      order_index: i,
    })
    if (error) throw error
  }

  revalidateTag('stats')
}

/* -------------------------------- Posts -------------------------------- */

export function getPosts(): Promise<Post[]> {
  return unstable_cache(
    async () => {
      try {
        const supabase = getPublicServerClient()
        let data: any[] | null = null
        let error: any = null

        const firstQuery = await supabase
          .from('posts')
          .select('slug, title, excerpt, category, date, reading_time, author, image, body_content, order_index, is_featured')
          .order('order_index', { ascending: true })
          .order('created_at', { ascending: false })

        data = firstQuery.data
        error = firstQuery.error

        if (error && (error.code === '42703' || error.message.includes('body_content') || error.message.includes('is_featured'))) {
          const { data: retryData, error: retryError } = await supabase
            .from('posts')
            .select('slug, title, excerpt, category, date, reading_time, author, image, order_index')
            .order('order_index', { ascending: true })
            .order('created_at', { ascending: false })
          data = retryData
          error = retryError
        }

        if (error) throw error
        if (!data || data.length === 0) return seedPosts
        return data.map((p: any) => {
          const seed = seedPosts.find((sp) => sp.slug === p.slug)
          return {
            slug: p.slug,
            title: p.title,
            excerpt: p.excerpt,
            category: p.category,
            date: p.date,
            readingTime: p.reading_time,
            author: p.author,
            image: p.image,
            bodyContent: p.body_content ?? seed?.bodyContent ?? p.excerpt ?? '',
            isFeatured: !!p.is_featured,
          }
        })
      } catch (err) {
        console.error('Error fetching posts from Supabase, falling back to seed:', err)
        return seedPosts
      }
    },
    ['posts'],
    { tags: ['posts'], revalidate: 1 }
  )()
}

export async function setPosts(items: Post[]) {
  const serviceClient = getServiceRoleClient()

  let hasIsFeatured = false
  let hasBodyContent = false

  try {
    const { error: colCheckError } = await serviceClient
      .from('posts')
      .select('is_featured, body_content')
      .limit(1)
    if (!colCheckError) {
      hasIsFeatured = true
      hasBodyContent = true
    } else {
      if (!colCheckError.message.includes('is_featured')) hasIsFeatured = true
      if (!colCheckError.message.includes('body_content')) hasBodyContent = true
    }
  } catch (e) {
    // Ignore
  }

  const { error: delError } = await serviceClient.from('posts').delete().neq('slug', '')
  if (delError) throw delError

  for (let i = 0; i < items.length; i++) {
    const post = items[i]
    const insertObj: any = {
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      date: post.date,
      reading_time: post.readingTime,
      author: post.author,
      image: post.image,
      order_index: i,
    }
    if (hasIsFeatured && post.isFeatured !== undefined) {
      insertObj.is_featured = post.isFeatured
    }
    if (hasBodyContent && post.bodyContent !== undefined) {
      insertObj.body_content = post.bodyContent
    }

    let { error } = await serviceClient.from('posts').insert(insertObj)
    if (error && (error.code === '42703' || error.message.includes('body_content'))) {
      delete insertObj.body_content
      const retry = await serviceClient.from('posts').insert(insertObj)
      error = retry.error
    }
    if (error) throw error
  }

  revalidateTag('posts')
}

export function getPost(slug: string): Promise<Post | undefined> {
  return unstable_cache(
    async () => {
      try {
        const supabase = getPublicServerClient()
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('slug', slug)
          .single()
        if (error) {
          if (error.code === 'PGRST116') {
            if (await isTableEmpty('posts')) {
              return seedPosts.find((p) => p.slug === slug)
            }
            return undefined
          }
          throw error
        }
        if (!data) return undefined
        const seed = seedPosts.find((p) => p.slug === slug)
        return {
          slug: data.slug,
          title: data.title,
          excerpt: data.excerpt,
          category: data.category,
          date: data.date,
          readingTime: data.reading_time,
          author: data.author,
          image: data.image,
          bodyContent: data.body_content ?? seed?.bodyContent ?? data.excerpt ?? '',
          isFeatured: !!data.is_featured,
        }
      } catch (err) {
        console.error(`Error fetching post ${slug} from Supabase, falling back to seed:`, err)
        return seedPosts.find((p) => p.slug === slug)
      }
    },
    ['post', slug],
    { tags: ['posts'], revalidate: 1 }
  )()
}

export async function upsertPost(post: Post, originalSlug?: string) {
  const serviceClient = getServiceRoleClient()

  if (originalSlug && originalSlug !== post.slug) {
    await serviceClient.from('posts').delete().eq('slug', originalSlug)
  }

  const insertObj: any = {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    date: post.date,
    reading_time: post.readingTime,
    author: post.author,
    image: post.image,
    body_content: post.bodyContent || '',
  }

  let { error } = await serviceClient.from('posts').upsert(insertObj)
  if (error && (error.code === '42703' || error.message.includes('body_content'))) {
    delete insertObj.body_content
    const retry = await serviceClient.from('posts').upsert(insertObj)
    error = retry.error
  }
  if (error) throw error

  revalidateTag('posts')
}

export async function deletePost(slug: string) {
  const serviceClient = getServiceRoleClient()
  const { error } = await serviceClient.from('posts').delete().eq('slug', slug)
  if (error) throw error

  revalidateTag('posts')
}

/* ------------------------------ Settings ------------------------------- */

export function getSettings(): Promise<SiteSettings> {
  return unstable_cache(
    async () => {
      try {
        const supabase = getPublicServerClient()
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .eq('key', 'default')
          .single()
        if (error) throw error
        if (!data) return defaultSettings
        return {
          general: data.general,
          contact: data.contact,
          announcement: data.announcement,
          header: data.header,
          footer: data.footer,
          social: data.social,
        }
      } catch (err) {
        console.error('Error fetching settings from Supabase, falling back to defaults:', err)
        return defaultSettings
      }
    },
    ['settings'],
    { tags: ['settings'], revalidate: 1 }
  )()
}

export async function updateSettings(patch: Partial<SiteSettings>) {
  const serviceClient = getServiceRoleClient()
  const current = await getSettings()
  const updated = {
    general: { ...current.general, ...patch.general },
    contact: { ...current.contact, ...patch.contact },
    announcement: { ...current.announcement, ...patch.announcement },
    header: { ...current.header, ...patch.header },
    footer: { ...current.footer, ...patch.footer },
    social: { ...current.social, ...patch.social },
  }

  const { error } = await serviceClient.from('site_settings').upsert({
    key: 'default',
    ...updated,
    updated_at: new Date().toISOString(),
  })
  if (error) throw error

  revalidateTag('settings')
}

/* -------------------- Programme applications (3 areas) ------------------ */

export async function getApplications(track?: Track): Promise<ProgrammeApplication[]> {
  try {
    const supabase = getServiceRoleClient()
    let query = supabase.from('programme_applications').select('*')
    if (track) {
      query = query.eq('track', track)
    }
    // Try filtering by is_archived = false
    let { data, error } = await query.eq('is_archived', false).order('created_at', { ascending: false })
    if (error && (error.code === '42703' || error.code === 'PGRST204' || error.message?.includes('is_archived'))) { // Column does not exist
      // Retry without is_archived filter
      let queryRetry = supabase.from('programme_applications').select('*')
      if (track) {
        queryRetry = queryRetry.eq('track', track)
      }
      const res = await queryRetry.order('created_at', { ascending: false })
      data = res.data
      error = res.error
    }

    if (error) throw error
    if (!data) return []
    return data.map((a: any) => ({
      id: a.id,
      track: a.track as Track,
      programmeSlug: a.programme_slug,
      programmeTitle: a.programme_title,
      name: a.name,
      email: a.email,
      phone: a.phone,
      message: a.message,
      status: a.status,
      createdAt: a.created_at,
      isArchived: !!a.is_archived,
      paymentPlan: a.payment_plan || '',
    }))
  } catch (err) {
    console.error('Error fetching applications from Supabase:', err)
    return []
  }
}

export async function getApplicationsPaged(
  track: Track,
  page: number,
  pageSize: number = 100,
  isArchived: boolean = false
): Promise<{ items: ProgrammeApplication[]; totalCount: number }> {
  try {
    const supabase = getServiceRoleClient()
    const from = (page - 1) * pageSize
    const to = page * pageSize - 1

    let query = supabase
      .from('programme_applications')
      .select('*', { count: 'exact' })
      .eq('track', track)

    if (isArchived) {
      query = query.eq('status', 'archived')
    } else {
      query = query.neq('status', 'archived')
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) throw error

    const items = (data || []).map((a: any) => {
      let plan = a.payment_plan || ''
      let msg = a.message || ''
      if (!plan && msg.includes('[Plan: ')) {
        const match = msg.match(/\[Plan:\s*([^\]]+)\]/)
        if (match) {
          plan = match[1].trim()
          msg = msg.replace(/\[Plan:\s*[^\]]+\]\n?/, '').trim()
        }
      }
      return {
        id: a.id,
        track: a.track as Track,
        programmeSlug: a.programme_slug,
        programmeTitle: a.programme_title,
        name: a.name,
        email: a.email,
        phone: a.phone,
        message: msg,
        status: a.status,
        createdAt: a.created_at,
        isArchived: a.status === 'archived',
        paymentPlan: plan,
      }
    })

    return { items, totalCount: count || 0 }
  } catch (err) {
    console.error('Error fetching paged applications:', err)
    return { items: [], totalCount: 0 }
  }
}

export async function archiveApplications(ids: string[], archived: boolean) {
  const serviceClient = getServiceRoleClient()
  const { error } = await serviceClient
    .from('programme_applications')
    .update({ status: archived ? 'archived' : 'new' })
    .in('id', ids)
  if (error) throw error
  revalidateTag('applications')
}

export async function deleteApplications(ids: string[]) {
  const serviceClient = getServiceRoleClient()
  const { error } = await serviceClient
    .from('programme_applications')
    .delete()
    .in('id', ids)
  if (error) throw error
  revalidateTag('applications')
}

export async function getApplication(appId: string): Promise<ProgrammeApplication | undefined> {
  try {
    const supabase = getServiceRoleClient()
    const { data, error } = await supabase
      .from('programme_applications')
      .select('*')
      .eq('id', appId)
      .single()
    if (error) throw error
    if (!data) return undefined
    return {
      id: data.id,
      track: data.track as Track,
      programmeSlug: data.programme_slug,
      programmeTitle: data.programme_title,
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      status: data.status,
      createdAt: data.created_at,
      paymentPlan: data.payment_plan || '',
    }
  } catch (err) {
    console.error(`Error fetching application ${appId} from Supabase:`, err)
    return undefined
  }
}

export async function addApplication(
  input: Omit<ProgrammeApplication, 'id' | 'status' | 'createdAt'>,
) {
  const serviceClient = getServiceRoleClient()
  
  let formattedMessage = input.message || ''
  if (input.paymentPlan && !formattedMessage.includes('[Plan:')) {
    formattedMessage = `[Plan: ${input.paymentPlan}]\n${formattedMessage}`.trim()
  }

  const insertObj: any = {
    id: id('app'),
    track: input.track,
    programme_slug: input.programmeSlug,
    programme_title: input.programmeTitle,
    name: input.name,
    email: input.email,
    phone: input.phone || '',
    experience: '',
    availability: '',
    message: formattedMessage,
    status: 'new',
    created_at: new Date().toISOString(),
  }

  if (input.paymentPlan) {
    insertObj.payment_plan = input.paymentPlan
  }

  const { error } = await serviceClient.from('programme_applications').insert(insertObj)
  if (error && (error.code === '42703' || error.code === 'PGRST204' || error.message?.includes('payment_plan'))) {
    const fallbackObj = { ...insertObj, id: id('app') }
    delete fallbackObj.payment_plan
    const { error: retryError } = await serviceClient.from('programme_applications').insert(fallbackObj)
    if (retryError) {
      console.error('Database error in addApplication retry:', retryError)
      throw new Error(`Failed to save application to database: ${retryError.message}`)
    }
  } else if (error) {
    console.error('Database error in addApplication:', error)
    throw new Error(`Failed to save application to database: ${error.message}`)
  }
  try { revalidateTag('applications') } catch (e) {}
}

export async function setApplicationStatus(
  appId: string,
  status: ProgrammeApplication['status'],
) {
  const serviceClient = getServiceRoleClient()
  const { error } = await serviceClient
    .from('programme_applications')
    .update({ status })
    .eq('id', appId)
  if (error) throw error
  revalidateTag('applications')
}

export async function deleteApplication(appId: string) {
  const serviceClient = getServiceRoleClient()
  const { error } = await serviceClient
    .from('programme_applications')
    .delete()
    .eq('id', appId)
  if (error) throw error
  revalidateTag('applications')
}

/* ------------------ Contact submissions (separate system) --------------- */

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  try {
    const supabase = getServiceRoleClient()
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    if (!data) return []
    return data.map((m: any) => ({
      id: m.id,
      source: m.source,
      name: m.name,
      email: m.email,
      fields: m.fields,
      message: m.message,
      read: m.read,
      createdAt: m.created_at,
      isArchived: !!m.is_archived,
    }))
  } catch (err) {
    console.error('Error fetching contact submissions from Supabase:', err)
    return []
  }
}

export async function getContactSubmissionsPaged(
  page: number,
  pageSize: number = 100,
  isArchived: boolean = false,
  source?: ContactSource
): Promise<{ items: ContactSubmission[]; totalCount: number }> {
  try {
    const supabase = getServiceRoleClient()
    const from = (page - 1) * pageSize
    const to = page * pageSize - 1

    let query = supabase
      .from('contact_submissions')
      .select('*', { count: 'exact' })

    if (source) {
      query = query.eq('source', source)
    }

    let { data, error, count } = await query
      .eq('is_archived', isArchived)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error && (error.code === '42703' || error.code === 'PGRST204' || error.message?.includes('is_archived'))) { // Column does not exist
      if (isArchived) {
        return { items: [], totalCount: 0 }
      }
      let queryRetry = supabase
        .from('contact_submissions')
        .select('*', { count: 'exact' })
      if (source) {
        queryRetry = queryRetry.eq('source', source)
      }
      const res = await queryRetry
        .order('created_at', { ascending: false })
        .range(from, to)
      data = res.data
      error = res.error
      count = res.count
    }

    if (error) throw error

    const items = (data || []).map((m: any) => ({
      id: m.id,
      source: m.source,
      name: m.name,
      email: m.email,
      fields: m.fields,
      message: m.message,
      read: m.read,
      createdAt: m.created_at,
      isArchived: !!m.is_archived,
    }))

    return { items, totalCount: count || 0 }
  } catch (err) {
    console.error('Error fetching paged contact submissions:', err)
    return { items: [], totalCount: 0 }
  }
}

export async function addContactSubmission(
  input: Omit<ContactSubmission, 'id' | 'read' | 'createdAt'>,
) {
  const serviceClient = getServiceRoleClient()
  const { error } = await serviceClient.from('contact_submissions').insert({
    id: id('msg'),
    source: input.source,
    name: input.name,
    email: input.email,
    fields: input.fields,
    message: input.message,
    read: false,
    created_at: new Date().toISOString(),
  })
  if (error) throw error
}

export async function setContactSubmissionRead(msgId: string, read: boolean) {
  const serviceClient = getServiceRoleClient()
  const { error } = await serviceClient
    .from('contact_submissions')
    .update({ read })
    .eq('id', msgId)
  if (error) throw error
}

export async function deleteContactSubmission(msgId: string) {
  const serviceClient = getServiceRoleClient()
  const { error } = await serviceClient
    .from('contact_submissions')
    .delete()
    .eq('id', msgId)
  if (error) throw error
}

/* ------------------------ Hire Talent Submissions ------------------------ */

export async function addHireTalentSubmission(input: {
  name: string
  company: string
  email: string
  numberOfHires: string
  rolesHiringFor: string
  message: string
}): Promise<void> {
  const serviceClient = getServiceRoleClient()
  const insertObj = {
    id: id('hire'),
    name: input.name,
    company: input.company,
    email: input.email,
    number_of_hires: input.numberOfHires,
    roles_hiring_for: input.rolesHiringFor,
    message: input.message,
    status: 'new',
    created_at: new Date().toISOString(),
  }

  const { error } = await serviceClient.from('hire_talent_submissions').insert(insertObj)
  if (error && (error.code === '42P01' || error.code === 'PGRST205' || error.message.includes('hire_talent_submissions'))) {
    await addContactSubmission({
      source: 'business',
      name: input.name,
      email: input.email,
      message: input.message,
      fields: {
        Form: 'Hire Talent',
        Company: input.company,
        'Number of hires': input.numberOfHires,
        'Roles hiring for': input.rolesHiringFor,
      },
    })
  } else if (error) {
    throw error
  }
  try { revalidateTag('hire_talent_submissions') } catch (e) {}
}

export async function getHireTalentSubmissionsPaged(
  page: number,
  pageSize: number = 100,
  isArchived: boolean = false
): Promise<{ items: HireTalentSubmission[]; totalCount: number }> {
  try {
    const supabase = getServiceRoleClient()
    const from = (page - 1) * pageSize
    const to = page * pageSize - 1

    let query = supabase
      .from('hire_talent_submissions')
      .select('*', { count: 'exact' })

    if (isArchived) {
      query = query.eq('status', 'archived')
    } else {
      query = query.neq('status', 'archived')
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error && (error.code === '42P01' || error.code === 'PGRST205' || error.message.includes('hire_talent_submissions'))) {
      const { items: contactItems } = await getContactSubmissionsPaged(1, 1000, isArchived, 'business')
      const hireItems = contactItems
        .filter((c) => c.fields?.Form === 'Hire Talent')
        .map((c) => ({
          id: c.id,
          name: c.name,
          company: c.fields?.Company || '',
          email: c.email,
          numberOfHires: c.fields?.['Number of hires'] || '',
          rolesHiringFor: c.fields?.['Roles hiring for'] || '',
          message: c.message,
          status: c.isArchived ? ('archived' as const) : ('new' as const),
          createdAt: c.createdAt,
        }))
      return { items: hireItems.slice(from, to + 1), totalCount: hireItems.length }
    } else if (error) {
      throw error
    }

    const items = (data || []).map((h: any) => ({
      id: h.id,
      name: h.name,
      company: h.company || '',
      email: h.email,
      numberOfHires: h.number_of_hires || '',
      rolesHiringFor: h.roles_hiring_for || '',
      message: h.message || '',
      status: (h.status === 'archived' ? 'archived' : 'new') as 'new' | 'archived',
      createdAt: h.created_at,
    }))

    return { items, totalCount: count || 0 }
  } catch (err) {
    console.error('Error fetching paged hire talent submissions:', err)
    return { items: [], totalCount: 0 }
  }
}

export async function archiveHireTalentSubmissions(ids: string[], archived: boolean) {
  const serviceClient = getServiceRoleClient()
  const { error } = await serviceClient
    .from('hire_talent_submissions')
    .update({ status: archived ? 'archived' : 'new' })
    .in('id', ids)
  if (error && (error.code === '42P01' || error.code === 'PGRST205' || error.message.includes('hire_talent_submissions'))) {
    // Table does not exist in schema
  } else if (error) {
    throw error
  }
  try { revalidateTag('hire_talent_submissions') } catch (e) {}
}

export async function deleteHireTalentSubmissions(ids: string[]) {
  const serviceClient = getServiceRoleClient()
  const { error } = await serviceClient
    .from('hire_talent_submissions')
    .delete()
    .in('id', ids)
  if (error && (error.code === '42P01' || error.code === 'PGRST205' || error.message.includes('hire_talent_submissions'))) {
    // Table does not exist in schema
  } else if (error) {
    throw error
  }
  try { revalidateTag('hire_talent_submissions') } catch (e) {}
}

/* ---------------------- Discovery Call Submissions ----------------------- */

export async function addDiscoveryCallSubmission(input: {
  name: string
  company: string
  email: string
  teamSize: string
  trainingArea: string
  message: string
}): Promise<void> {
  const serviceClient = getServiceRoleClient()
  const insertObj = {
    id: id('disc'),
    name: input.name,
    company: input.company,
    email: input.email,
    team_size: input.teamSize,
    training_area: input.trainingArea,
    message: input.message,
    status: 'new',
    created_at: new Date().toISOString(),
  }

  const { error } = await serviceClient.from('discovery_call_submissions').insert(insertObj)
  if (error && (error.code === '42P01' || error.code === 'PGRST205' || error.message.includes('discovery_call_submissions'))) {
    await addContactSubmission({
      source: 'business',
      name: input.name,
      email: input.email,
      message: input.message,
      fields: {
        Form: 'Book Discovery Call',
        Company: input.company,
        'Team size': input.teamSize,
        'Training area': input.trainingArea,
      },
    })
  } else if (error) {
    throw error
  }
  try { revalidateTag('discovery_call_submissions') } catch (e) {}
}

export async function getDiscoveryCallSubmissionsPaged(
  page: number,
  pageSize: number = 100,
  isArchived: boolean = false
): Promise<{ items: DiscoveryCallSubmission[]; totalCount: number }> {
  try {
    const supabase = getServiceRoleClient()
    const from = (page - 1) * pageSize
    const to = page * pageSize - 1

    let query = supabase
      .from('discovery_call_submissions')
      .select('*', { count: 'exact' })

    if (isArchived) {
      query = query.eq('status', 'archived')
    } else {
      query = query.neq('status', 'archived')
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error && (error.code === '42P01' || error.code === 'PGRST205' || error.message.includes('discovery_call_submissions'))) {
      const { items: contactItems } = await getContactSubmissionsPaged(1, 1000, isArchived, 'business')
      const discItems = contactItems
        .filter((c) => c.fields?.Form === 'Book Discovery Call')
        .map((c) => ({
          id: c.id,
          name: c.name,
          company: c.fields?.Company || '',
          email: c.email,
          teamSize: c.fields?.['Team size'] || '',
          trainingArea: c.fields?.['Training area'] || '',
          message: c.message,
          status: c.isArchived ? ('archived' as const) : ('new' as const),
          createdAt: c.createdAt,
        }))
      return { items: discItems.slice(from, to + 1), totalCount: discItems.length }
    } else if (error) {
      throw error
    }

    const items = (data || []).map((d: any) => ({
      id: d.id,
      name: d.name,
      company: d.company || '',
      email: d.email,
      teamSize: d.team_size || '',
      trainingArea: d.training_area || '',
      message: d.message || '',
      status: (d.status === 'archived' ? 'archived' : 'new') as 'new' | 'archived',
      createdAt: d.created_at,
    }))

    return { items, totalCount: count || 0 }
  } catch (err) {
    console.error('Error fetching paged discovery call submissions:', err)
    return { items: [], totalCount: 0 }
  }
}

export async function archiveDiscoveryCallSubmissions(ids: string[], archived: boolean) {
  const serviceClient = getServiceRoleClient()
  const { error } = await serviceClient
    .from('discovery_call_submissions')
    .update({ status: archived ? 'archived' : 'new' })
    .in('id', ids)
  if (error && (error.code === '42P01' || error.code === 'PGRST205' || error.message.includes('discovery_call_submissions'))) {
    // Table does not exist in schema
  } else if (error) {
    throw error
  }
  try { revalidateTag('discovery_call_submissions') } catch (e) {}
}

export async function deleteDiscoveryCallSubmissions(ids: string[]) {
  const serviceClient = getServiceRoleClient()
  const { error } = await serviceClient
    .from('discovery_call_submissions')
    .delete()
    .in('id', ids)
  if (error && (error.code === '42P01' || error.code === 'PGRST205' || error.message.includes('discovery_call_submissions'))) {
    // Table does not exist in schema
  } else if (error) {
    throw error
  }
  try { revalidateTag('discovery_call_submissions') } catch (e) {}
}

export async function getApplicationSummary(): Promise<{
  programmeTitle: string
  today: number
  yesterday: number
  last7: number
  last14: number
  lastMonth: number
}[]> {
  try {
    const now = new Date()

    // Today (local day boundaries mapped to UTC ISO)
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    // Yesterday
    const yesterdayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
    const yesterdayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, -1)

    // Last 7 Days (rolling, including today - i.e. 6 full days prior + today)
    const last7DaysStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6)

    // Last 14 Days (rolling, including today - i.e. 13 full days prior + today)
    const last14DaysStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 13)

    // Last Month (Month-to-date calendar month: from 1st of current calendar month through today)
    const monthToDateStart = new Date(now.getFullYear(), now.getMonth(), 1)

    // Oldest date threshold for query filter
    const oldestDate = monthToDateStart < last14DaysStart ? monthToDateStart : last14DaysStart

    const supabase = getServiceRoleClient()
    const { data: apps, error } = await supabase
      .from('programme_applications')
      .select('programme_title, created_at')
      .gte('created_at', oldestDate.toISOString())

    if (error) {
      console.warn('Error fetching application summary from Supabase:', error.message)
      return []
    }

    const programmes = await getProgrammes()
    const summaryMap: Record<string, { today: number; yesterday: number; last7: number; last14: number; lastMonth: number }> = {}

    // Initialize list with all known active programmes
    programmes.forEach(p => {
      summaryMap[p.title] = { today: 0, yesterday: 0, last7: 0, last14: 0, lastMonth: 0 }
    })

    if (apps) {
      apps.forEach((app: any) => {
        const appDate = new Date(app.created_at)
        const title = app.programme_title || 'Unknown Programme'

        if (!summaryMap[title]) {
          summaryMap[title] = { today: 0, yesterday: 0, last7: 0, last14: 0, lastMonth: 0 }
        }

        const isToday = appDate >= todayStart
        const isYesterday = appDate >= yesterdayStart && appDate <= yesterdayEnd
        const isLast7 = appDate >= last7DaysStart
        const isLast14 = appDate >= last14DaysStart
        const isLastMonth = appDate >= monthToDateStart

        if (isToday) summaryMap[title].today++
        if (isYesterday) summaryMap[title].yesterday++
        if (isLast7) summaryMap[title].last7++
        if (isLast14) summaryMap[title].last14++
        if (isLastMonth) summaryMap[title].lastMonth++
      })
    }

    return Object.entries(summaryMap).map(([title, counts]) => ({
      programmeTitle: title,
      ...counts
    }))
  } catch (err) {
    console.error('Error generating application summary:', err)
    return []
  }
}
