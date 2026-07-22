import Link from 'next/link'
import { ArrowRight, GraduationCap, Award, Rocket, Quote, Newspaper, Inbox } from 'lucide-react'
import {
  getProgrammes,
  getApplications,
  getContactSubmissions,
  getTestimonials,
  getPosts,
  checkDatabaseEmpty,
  getApplicationSummary,
} from '@/lib/store/store'
import { AdminPageHeader, Card, Badge } from '@/components/admin/ui'

import { seedDbAction } from '@/app/admin/actions/content'

export default async function AdminDashboard() {
  const [allProgrammes, applications, submissions, testimonials, posts, isDatabaseEmpty, applicationSummary] = await Promise.all([
    getProgrammes().catch(() => []),
    getApplications().catch(() => []),
    getContactSubmissions().catch(() => []),
    getTestimonials().catch(() => []),
    getPosts().catch(() => []),
    checkDatabaseEmpty().catch(() => true),
    getApplicationSummary().catch(() => []),
  ])

  const career = allProgrammes.filter((p) => p.track === 'career')
  const certification = allProgrammes.filter((p) => p.track === 'certification')
  const bootcamp = allProgrammes.filter((p) => p.track === 'bootcamp')

  const newApplications = applications.filter((a) => a.status === 'new').length
  const unreadSubmissions = submissions.filter((m) => !m.read).length

  const stats = [
    { label: 'Career programmes', value: career.length, href: '/admin/programmes/career', icon: GraduationCap },
    { label: 'Certifications', value: certification.length, href: '/admin/programmes/certifications', icon: Award },
    { label: 'Bootcamps', value: bootcamp.length, href: '/admin/programmes/bootcamps', icon: Rocket },
    { label: 'Testimonials', value: testimonials.length, href: '/admin/testimonials', icon: Quote },
    { label: 'Blog posts', value: posts.length, href: '/admin/blog', icon: Newspaper },
    { label: 'New applications', value: newApplications, href: '/admin/applications/career', icon: Inbox },
  ]

  const recentSubmissions = submissions.slice(0, 5)

  const totals = applicationSummary.reduce(
    (acc, curr) => {
      acc.today += curr.today
      acc.yesterday += curr.yesterday
      acc.last7 += curr.last7
      acc.last14 += curr.last14
      acc.lastMonth += curr.lastMonth
      return acc
    },
    { today: 0, yesterday: 0, last7: 0, last14: 0, lastMonth: 0 }
  )

  // isDatabaseEmpty is now fetched from checkDatabaseEmpty() above to correctly detect empty DB vs seed fallback

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Dashboard"
        description="Manage every part of the Uptrail site — programmes, content, enquiries and global settings — from one place."
      />

      {isDatabaseEmpty && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/50 dark:bg-amber-950/10">
          <h3 className="font-semibold text-amber-900 dark:text-amber-400 text-lg">Database Setup Required</h3>
          <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
            Your Supabase database is empty. Click the button below to seed it with the default Uptrail programmes, testimonials, posts, and settings.
          </p>
          <form action={seedDbAction} className="mt-4">
            <button type="submit" className="rounded-md bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 text-sm font-medium transition-all">
              Seed Database with Default Data
            </button>
          </form>
        </div>
      )}

      {/* Compact Tabular Metric Card */}
      <Card className="p-0 overflow-hidden shadow-sm border-border">
        <div className="grid grid-cols-2 divide-y divide-border sm:grid-cols-3 lg:grid-cols-6 sm:divide-y-0 sm:divide-x">
          {stats.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="group flex flex-col justify-between p-4 transition-colors hover:bg-muted/30"
            >
              <div className="flex items-center justify-between gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors truncate">
                  {s.label}
                </span>
                <s.icon className="size-3.5 text-muted-foreground/70 group-hover:text-accent transition-colors shrink-0" />
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl font-bold tracking-tight text-foreground group-hover:text-accent transition-colors">
                  {s.value}
                </span>
                <span className="text-[11px] font-medium text-muted-foreground/50 group-hover:text-accent group-hover:translate-x-0.5 transition-all">
                  &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Card>

      {/* Application Summary - Full Width */}
      <Card className="flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Application Summary</h2>
          <Badge tone="accent">By Programme</Badge>
        </div>
        <div className="mt-4 overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-border text-[11px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/20">
                <th className="p-3 font-semibold">Programme</th>
                <th className="p-3 font-semibold text-center w-16">Today</th>
                <th className="p-3 font-semibold text-center w-20">Yesterday</th>
                <th className="p-3 font-semibold text-center w-24">Last 7d</th>
                <th className="p-3 font-semibold text-center w-24">Last 14d</th>
                <th className="p-3 font-semibold text-center w-28">MTD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {applicationSummary.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-muted-foreground">
                    No applications found.
                  </td>
                </tr>
              ) : (
                applicationSummary.map((row) => (
                  <tr key={row.programmeTitle} className="hover:bg-muted/5 transition-colors">
                    <td className="p-3 font-medium text-foreground max-w-[200px] truncate" title={row.programmeTitle}>
                      {row.programmeTitle}
                    </td>
                    <td className="p-3 text-center text-foreground/80">{row.today}</td>
                    <td className="p-3 text-center text-foreground/80">{row.yesterday}</td>
                    <td className="p-3 text-center text-foreground/80">{row.last7}</td>
                    <td className="p-3 text-center text-foreground/80">{row.last14}</td>
                    <td className="p-3 text-center text-foreground/80">{row.lastMonth}</td>
                  </tr>
                ))
              )}
              {applicationSummary.length > 0 && (
                <tr className="bg-muted/10 font-semibold text-foreground border-t border-border">
                  <td className="p-3 font-semibold">TOTALS</td>
                  <td className="p-3 text-center font-bold">{totals.today}</td>
                  <td className="p-3 text-center font-bold">{totals.yesterday}</td>
                  <td className="p-3 text-center font-bold">{totals.last7}</td>
                  <td className="p-3 text-center font-bold">{totals.last14}</td>
                  <td className="p-3 text-center font-bold">{totals.lastMonth}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recent Messages - Repositioned Below */}
      <Card className="w-full lg:max-w-2xl">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Recent messages</h2>
          <Badge tone={unreadSubmissions ? 'warn' : 'neutral'}>
            {unreadSubmissions} unread
          </Badge>
        </div>
        <div className="mt-4 flex flex-col divide-y divide-border">
          {recentSubmissions.length === 0 ? (
            <p className="py-4 text-sm text-muted-foreground">
              No contact submissions yet.
            </p>
          ) : (
            recentSubmissions.map((m) => (
              <div key={m.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {m.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {m.email}
                  </p>
                </div>
                <Badge tone="neutral">{m.source}</Badge>
              </div>
            ))
          )}
        </div>
        <Link
          href="/admin/contact-submissions"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
        >
          View all messages
          <ArrowRight className="size-3.5" />
        </Link>
      </Card>
    </div>
  )
}
