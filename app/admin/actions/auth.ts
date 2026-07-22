'use server'

import { redirect } from 'next/navigation'
import { createActionClient } from '@/lib/supabase'

export type LoginState = { error?: string }

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  const from = String(formData.get('from') ?? '/admin')

  const supabase = await createActionClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect(from.startsWith('/admin') ? from : '/admin')
}

export async function logout() {
  const supabase = await createActionClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
