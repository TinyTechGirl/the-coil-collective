import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">The Coil Collective</span>
            <span className="block text-indigo-600">Find Your Perfect Curl</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Discover and connect with the best curly hair salons in your area. Join our community of curl enthusiasts.
          </p>
        </div>

        {/* Email Capture Form */}
        <Card className="p-6">
          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Join the waitlist
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <Input
                  type="email"
                  name="email"
                  id="email"
                  className="flex-1"
                  placeholder="Enter your email"
                  required
                />
                <Button type="submit" className="ml-3">
                  Join
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
