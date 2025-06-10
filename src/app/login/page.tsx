import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Toaster } from 'sonner'

interface Props {
  searchParams: {
    redirectTo?: string
  }
}

export default async function LoginPage({ searchParams }: Props) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const signIn = async (formData: FormData) => {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const redirectTo = formData.get('redirectTo') as string

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new Error(error.message)
    }

    redirect(redirectTo || '/dashboard')
  }

  const redirectTo = searchParams?.redirectTo || '/dashboard'

  return (
    <>
      <Toaster position="top-center" />
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Sign In</h1>

          <form action={signIn} className="space-y-4">
            <input type="hidden" name="redirectTo" value={redirectTo} />

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                required
                className="mt-1"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                type="password"
                id="password"
                name="password"
                required
                className="mt-1"
                placeholder="Enter your password"
              />
            </div>

            <Button type="submit" className="w-full">
              Sign In
            </Button>

            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/signup" className="text-indigo-600 hover:text-indigo-800">
                Sign up
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </>
  )
} 