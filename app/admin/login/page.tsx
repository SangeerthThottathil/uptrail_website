import type { Metadata } from 'next'
import { LoginForm } from '@/components/admin/login-form'

export const metadata: Metadata = {
  title: 'Admin login | Uptrail',
  robots: { index: false, follow: false },
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>
}) {
  const { from } = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <img src="/uptrail-logo.svg" alt="Uptrail" className="h-8 w-auto" />
          <h1 className="mt-6 text-xl font-semibold tracking-tight text-foreground">
            Admin sign in
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Sign in to manage programmes, content and site settings.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <LoginForm from={from ?? '/admin'} />
        </div>
      </div>
    </div>
  )
}
