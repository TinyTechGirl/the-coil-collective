import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Salon {
  id: string
  name: string
  city: string
  services: string[]
  instagram_url?: string
}

export default async function Home({
  searchParams,
}: {
  searchParams: { search?: string; city?: string }
}) {
  // Get search params
  const search = searchParams?.search || ''
  const city = searchParams?.city || ''

  // Fetch salons with optional search and city filters
  let query = supabase.from('salons').select('*')
  
  if (search) {
    query = query.ilike('name', `%${search}%`)
  }
  
  if (city) {
    query = query.eq('city', city)
  }
  
  const { data: salons } = await query

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
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

        {/* Search Section */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <form className="flex-1 max-w-2xl">
            <div className="flex gap-2">
              <Input
                type="text"
                name="search"
                placeholder="Search salons..."
                defaultValue={search}
                className="flex-1"
              />
              <Input
                type="text"
                name="city"
                placeholder="City"
                defaultValue={city}
                className="w-32"
              />
              <Button type="submit">Search</Button>
            </div>
          </form>
          <Button variant="outline" asChild>
            <Link href="/submit-salon">Submit a Salon</Link>
          </Button>
        </div>

        {/* Salon Listings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {salons?.map((salon: Salon) => (
            <Link key={salon.id} href={`/salons/${salon.id}`}>
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-semibold mb-2">{salon.name}</h2>
                <p className="text-gray-600 mb-4">{salon.city}</p>
                <div className="flex flex-wrap gap-2">
                  {salon.services.map((service) => (
                    <span
                      key={service}
                      className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Email Capture Form */}
        <Card className="p-6 max-w-2xl mx-auto">
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
