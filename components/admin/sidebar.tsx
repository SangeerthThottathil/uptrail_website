'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  GraduationCap,
  Award,
  Rocket,
  Inbox,
  MessageSquare,
  Quote,
  Video,
  Building2,
  BarChart3,
  Newspaper,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { logout } from '@/app/admin/actions/auth'

type Item = { label: string; href: string; icon: typeof LayoutDashboard }
type Group = { title?: string; items: Item[] }

const groups: Group[] = [
  {
    items: [{ label: 'Dashboard', href: '/admin', icon: LayoutDashboard }],
  },
  {
    title: 'Programmes',
    items: [
      { label: 'Career Programmes', href: '/admin/programmes/career', icon: GraduationCap },
      { label: 'Certifications', href: '/admin/programmes/certifications', icon: Award },
      { label: 'Bootcamps', href: '/admin/programmes/bootcamps', icon: Rocket },
    ],
  },
  {
    title: 'Applications & Submissions',
    items: [
      { label: 'Career Applications', href: '/admin/applications/career', icon: Inbox },
      { label: 'Certification Applications', href: '/admin/applications/certifications', icon: Inbox },
      { label: 'Bootcamp Applications', href: '/admin/applications/bootcamps', icon: Inbox },
      { label: 'Contact Submissions', href: '/admin/contact-submissions', icon: MessageSquare },
      { label: 'Hire Talent Submissions', href: '/admin/submissions/hire-talent', icon: Building2 },
      { label: 'Discovery Call Submissions', href: '/admin/submissions/discovery-calls', icon: Calendar },
    ],
  },
  {
    title: 'Content',
    items: [
      { label: 'Testimonials', href: '/admin/testimonials', icon: Quote },
      { label: 'Success Stories', href: '/admin/success-stories', icon: Award },
      { label: 'Video Testimonials', href: '/admin/video-testimonials', icon: Video },
      { label: 'Employers', href: '/admin/employers', icon: Building2 },
      { label: 'Stats', href: '/admin/stats', icon: BarChart3 },
      { label: 'Blog', href: '/admin/blog', icon: Newspaper },
    ],
  },
  {
    title: 'Configuration',
    items: [{ label: 'Site Settings', href: '/admin/settings', icon: Settings }],
  },
]

function isActive(pathname: string, href: string) {
  if (href === '/admin') return pathname === '/admin'
  return pathname === href || pathname.startsWith(href + '/')
}

export function AdminSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved !== null) {
      setCollapsed(saved === 'true')
    }
  }, [])

  return (
    <>
      {/* Mobile Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-sidebar-border bg-sidebar px-4 py-3 lg:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <img src="/uptrail-logo.svg" alt="Uptrail" className="h-6 w-auto" />
          <span className="label-mono text-muted-foreground">Admin</span>
        </Link>
        <button
          type="button"
          aria-label="Toggle admin menu"
          onClick={() => setOpen((v) => !v)}
          className="flex size-9 items-center justify-center rounded-md border border-sidebar-border text-foreground"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 max-w-[80vw] shrink-0 flex-col border-sidebar-border bg-sidebar transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:border-r lg:z-0',
          collapsed ? 'lg:w-16' : 'lg:w-64',
          open ? 'translate-x-0' : '-translate-x-full lg:flex',
        )}
      >
        <div className={cn(
          "flex items-center border-b border-sidebar-border py-5 justify-between px-5",
          collapsed ? "lg:flex-col lg:gap-3 lg:px-2" : "lg:px-5"
        )}>
          <Link href="/admin" className="flex items-center gap-2">
            <img src="/uptrail-logo.svg" alt="Uptrail" className="h-7 w-auto" />
            <span className={cn(
              "label-mono text-muted-foreground font-semibold",
              collapsed ? "lg:hidden" : "block"
            )}>
              Admin
            </span>
          </Link>
          
          {/* Close button on mobile */}
          <button
            type="button"
            className="lg:hidden flex size-8 items-center justify-center rounded-md border border-sidebar-border text-muted-foreground hover:bg-sidebar-accent hover:text-foreground cursor-pointer transition-all"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="size-4" />
          </button>
          
          {/* Collapse/Expand button on desktop */}
          <button
            type="button"
            suppressHydrationWarning
            onClick={() => {
              const next = !collapsed
              setCollapsed(next)
              localStorage.setItem('sidebar-collapsed', String(next))
            }}
            className="hidden lg:flex size-8 items-center justify-center rounded-md border border-sidebar-border text-muted-foreground hover:bg-sidebar-accent hover:text-foreground cursor-pointer transition-all"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 lg:py-5">
          {groups.map((group, i) => (
            <div key={group.title ?? i} className={cn(i > 0 && 'mt-6')}>
              {group.title && (
                <p className={cn(
                  "label-mono px-3 pb-2 text-muted-foreground/70",
                  collapsed ? "lg:hidden" : "block"
                )}>
                  {group.title}
                </p>
              )}
              <ul className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const active = isActive(pathname, item.href)
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'flex items-center rounded-md py-2 text-sm transition-colors relative group',
                          collapsed ? 'gap-3 px-3 lg:justify-center lg:px-2' : 'gap-3 px-3',
                          active
                            ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
                            : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                        )}
                      >
                        <item.icon className="size-4 shrink-0" />
                        <span className={cn(collapsed ? "lg:hidden" : "block")}>
                          {item.label}
                        </span>
                        {collapsed && (
                          <div className="absolute left-full ml-3 z-50 hidden lg:group-hover:block rounded-md bg-foreground text-background text-xs px-2.5 py-1.5 whitespace-nowrap shadow-md pointer-events-none">
                            {item.label}
                          </div>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-3 flex flex-col gap-1.5">
          <Link
            href="/"
            target="_blank"
            className={cn(
              "flex items-center rounded-md py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground relative group",
              collapsed ? 'gap-3 px-3 lg:justify-center lg:px-2' : 'gap-3 px-3'
            )}
          >
            <ExternalLink className="size-4 shrink-0" />
            <span className={cn(collapsed ? "lg:hidden" : "block")}>
              View live site
            </span>
            {collapsed && (
              <div className="absolute left-full ml-3 z-50 hidden lg:group-hover:block rounded-md bg-foreground text-background text-xs px-2.5 py-1.5 whitespace-nowrap shadow-md pointer-events-none">
                View live site
              </div>
            )}
          </Link>
          <form action={logout}>
            <button
              type="submit"
              suppressHydrationWarning
              className={cn(
                "flex w-full items-center rounded-md py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-destructive/10 hover:text-destructive relative group cursor-pointer",
                collapsed ? 'gap-3 px-3 lg:justify-center lg:px-2' : 'gap-3 px-3'
              )}
            >
              <LogOut className="size-4 shrink-0" />
              <span className={cn(collapsed ? "lg:hidden" : "block")}>
                Log out
              </span>
              {collapsed && (
                <div className="absolute left-full ml-3 z-50 hidden lg:group-hover:block rounded-md bg-destructive text-destructive-foreground text-xs px-2.5 py-1.5 whitespace-nowrap shadow-md pointer-events-none">
                  Log out
                </div>
              )}
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}
