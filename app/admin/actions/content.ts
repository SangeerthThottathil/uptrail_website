'use server'

import { revalidatePath } from 'next/cache'
import * as store from '@/lib/store/store'
import { createActionClient, getServiceRoleClient } from '@/lib/supabase'
import fs from 'fs/promises'
import path from 'path'
import type {
  Programme,
  Testimonial,
  VideoTestimonial,
  Employer,
  Stat,
  Post,
  SiteSettings,
  ApplicationStatus,
  Track,
  ContactSource,
  SuccessStory,
} from '@/lib/store/types'

async function requireAdmin() {
  const supabase = await createActionClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Unauthorized: Admin access required')
  }
  return user
}

/** Refresh both the admin views and the public site after any content change. */
function refreshAll() {
  try {
    revalidatePath('/')
    revalidatePath('/success-stories')
    revalidatePath('/admin', 'layout')
  } catch (e) {}
}

/* ----------------------------- Seeding --------------------------------- */

export async function seedDbAction() {
  try {
    await requireAdmin()
    await store.seedDatabase()
    refreshAll()
  } catch (err: any) {
    console.error('Error seeding database:', err)
  }
}

/* ----------------------------- Programmes ------------------------------ */

export async function saveProgramme(programme: Programme, originalSlug?: string) {
  await requireAdmin()
  await store.upsertProgramme(programme, originalSlug)
  refreshAll()
}

export async function removeProgramme(slug: string) {
  await requireAdmin()
  await store.deleteProgramme(slug)
  refreshAll()
}

/* ---------------------------- Testimonials ----------------------------- */

export async function saveTestimonials(items: Testimonial[]) {
  await requireAdmin()
  await store.setTestimonials(items)
  refreshAll()
}

export async function saveSuccessStories(items: SuccessStory[]) {
  await requireAdmin()
  await store.setSuccessStories(items)
  refreshAll()
}

export async function saveVideoTestimonials(items: VideoTestimonial[]) {
  await requireAdmin()
  await store.setVideoTestimonials(items)
  refreshAll()
}

/* --------------------------- Employers / stats -------------------------- */

export async function saveEmployers(items: Employer[]) {
  await requireAdmin()
  await store.setEmployers(items)
  refreshAll()
}

export async function saveStats(items: Stat[]) {
  await requireAdmin()
  await store.setStats(items)
  refreshAll()
}

/* -------------------------------- Posts -------------------------------- */

export async function savePost(post: Post, originalSlug?: string) {
  await requireAdmin()
  await store.upsertPost(post, originalSlug)
  refreshAll()
}

export async function removePost(slug: string) {
  await requireAdmin()
  await store.deletePost(slug)
  refreshAll()
}

export async function savePosts(items: Post[]) {
  await requireAdmin()
  await store.setPosts(items)
  refreshAll()
}

/* ------------------------------ Settings ------------------------------- */

export async function saveSettings(patch: Partial<SiteSettings>) {
  await requireAdmin()
  await store.updateSettings(patch)
  refreshAll()
}

/* -------------------------- Applications ------------------------------- */

export async function changeApplicationStatus(
  appId: string,
  status: ApplicationStatus,
) {
  await requireAdmin()
  await store.setApplicationStatus(appId, status)
  revalidatePath('/admin', 'layout')
}

export async function removeApplication(appId: string) {
  await requireAdmin()
  await store.deleteApplication(appId)
  revalidatePath('/admin', 'layout')
}

/* ---------------------- Contact submissions ---------------------------- */

export async function markSubmissionRead(msgId: string, read: boolean) {
  await requireAdmin()
  await store.setContactSubmissionRead(msgId, read)
  revalidatePath('/admin', 'layout')
}

export async function removeSubmission(msgId: string) {
  await requireAdmin()
  await store.deleteContactSubmission(msgId)
  revalidatePath('/admin', 'layout')
}

export async function fetchContactSubmissionsPaged(
  page: number,
  pageSize: number = 100,
  isArchived: boolean = false,
  source?: ContactSource
) {
  await requireAdmin()
  return store.getContactSubmissionsPaged(page, pageSize, isArchived, source)
}

export async function archiveContactSubmissionsAction(ids: string[], archived: boolean) {
  await requireAdmin()
  const serviceClient = getServiceRoleClient()
  const { error } = await serviceClient
    .from('contact_submissions')
    .update({ is_archived: archived })
    .in('id', ids)
  if (error) throw error
  revalidatePath('/admin', 'layout')
}

export async function deleteContactSubmissionsAction(ids: string[]) {
  await requireAdmin()
  const serviceClient = getServiceRoleClient()
  const { error } = await serviceClient
    .from('contact_submissions')
    .delete()
    .in('id', ids)
  if (error) throw error
  revalidatePath('/admin', 'layout')
}

/* -------------------------- File Uploads ------------------------------- */

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.pdf']
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
]
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB limit

export async function uploadFile(formData: FormData): Promise<{ url?: string; error?: string }> {
  try {
    await requireAdmin()

    const file = formData.get('file') as File | null
    if (!file) {
      return { error: 'No file provided' }
    }

    if (file.size > MAX_FILE_SIZE) {
      return { error: 'File size exceeds maximum allowed limit of 5MB.' }
    }

    const ext = path.extname(file.name).toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return { error: `File type ${ext} is not allowed.` }
    }

    if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
      return { error: `MIME type ${file.type} is not allowed.` }
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    if (ext === '.svg') {
      const svgText = buffer.toString('utf8')
      if (/<script/i.test(svgText) || /javascript:/i.test(svgText) || /on\w+\s*=/i.test(svgText)) {
        return { error: 'SVG contains disallowed executable content or script handlers.' }
      }
    }

    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9]/g, '_')
    const fileName = `${baseName}_${Date.now()}${ext}`

    // 1. Try Supabase Storage
    try {
      const serviceClient = getServiceRoleClient()

      // Ensure bucket exists
      try {
        await serviceClient.storage.createBucket('uploads', { public: true })
      } catch {
        // Ignore if exists
      }

      const { error } = await serviceClient.storage
        .from('uploads')
        .upload(fileName, buffer, {
          contentType: file.type || 'application/octet-stream',
          upsert: true,
        })

      if (!error) {
        const { data: { publicUrl } } = serviceClient.storage
          .from('uploads')
          .getPublicUrl(fileName)
        return { url: publicUrl }
      } else {
        console.warn('Supabase upload error, falling back to local:', error)
      }
    } catch (err: any) {
      console.warn('Supabase upload failed, falling back to local:', err)
    }

    // 2. Fallback: Local public/uploads folder
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads')
      await fs.mkdir(uploadDir, { recursive: true })
      const localFilePath = path.join(uploadDir, fileName)
      await fs.writeFile(localFilePath, buffer)
      return { url: `/uploads/${fileName}` }
    } catch (err: any) {
      console.error('Local upload failed:', err)
      return { error: `Failed to upload file locally: ${err.message}.` }
    }
  } catch (err: any) {
    console.error('Upload action error:', err)
    return { error: err.message || 'Upload failed' }
  }
}

/* ----------------------- Applications Paged & Bulk ---------------------- */

export async function fetchApplicationsPaged(
  track: Track,
  page: number,
  pageSize: number = 100,
  isArchived: boolean = false,
  plan?: string
) {
  await requireAdmin()
  return store.getApplicationsPaged(track, page, pageSize, isArchived)
}

export async function archiveApplicationsAction(ids: string[], archived: boolean) {
  await requireAdmin()
  await store.archiveApplications(ids, archived)
  revalidatePath('/admin', 'layout')
}

export async function deleteApplicationsAction(ids: string[]) {
  await requireAdmin()
  await store.deleteApplications(ids)
  revalidatePath('/admin', 'layout')
}

/* -------------------- Hire Talent Submissions Actions ------------------- */

export async function fetchHireTalentSubmissionsPaged(
  page: number,
  pageSize: number = 100,
  isArchived: boolean = false
) {
  await requireAdmin()
  return store.getHireTalentSubmissionsPaged(page, pageSize, isArchived)
}

export async function archiveHireTalentSubmissionsAction(ids: string[], archived: boolean) {
  await requireAdmin()
  await store.archiveHireTalentSubmissions(ids, archived)
  refreshAll()
}

export async function deleteHireTalentSubmissionsAction(ids: string[]) {
  await requireAdmin()
  await store.deleteHireTalentSubmissions(ids)
  refreshAll()
}

/* ------------------ Discovery Call Submissions Actions ------------------ */

export async function fetchDiscoveryCallSubmissionsPaged(
  page: number,
  pageSize: number = 100,
  isArchived: boolean = false
) {
  await requireAdmin()
  return store.getDiscoveryCallSubmissionsPaged(page, pageSize, isArchived)
}

export async function archiveDiscoveryCallSubmissionsAction(ids: string[], archived: boolean) {
  await requireAdmin()
  await store.archiveDiscoveryCallSubmissions(ids, archived)
  refreshAll()
}

export async function deleteDiscoveryCallSubmissionsAction(ids: string[]) {
  await requireAdmin()
  await store.deleteDiscoveryCallSubmissions(ids)
  refreshAll()
}

