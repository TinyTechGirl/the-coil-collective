import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Toaster } from 'sonner'

export default async function SignUpPage() {
  const supabase = createClient(cookies())

  const signUp = async (formData: FormData) => {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })

    if (error) {
      throw new Error(error.message)
    }

    redirect('/login?message=Check your email to confirm your account')
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Sign Up</h1>

          <form action={signUp} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1"
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-indigo-600 hover:text-indigo-800">
                Sign in
              </a>
            </p>
          </div>
        </Card>
      </div>
    </>
  )
} 