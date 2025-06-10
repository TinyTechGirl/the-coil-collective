import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Toaster } from 'sonner'

export default async function DashboardPage() {
  const supabase = createClient(cookies())

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  const ownerEmail = session.user.email!

  const { data: claimedSalons, error } = await supabase
    .from('salons')
    .select('*')
    .eq('owner_email', ownerEmail)

  // Get analytics data
  const { data: totalViews } = await supabase
    .from('salon_views')
    .select('count')
    .eq('owner_email', ownerEmail)
    .single()

  const { data: recentViews } = await supabase
    .from('salon_views')
    .select('salon_id, viewed_at')
    .eq('owner_email', ownerEmail)
    .order('viewed_at', { ascending: false })
    .limit(5)

  // Get view trends (views per day for last 7 days)
  const { data: viewTrends } = await supabase
    .from('salon_views')
    .select('viewed_at')
    .eq('owner_email', ownerEmail)
    .gte('viewed_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

  // Calculate views per day
  const viewsPerDay = viewTrends?.reduce((acc: { [key: string]: number }, view) => {
    const date = new Date(view.viewed_at).toLocaleDateString()
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  // Get popular services across all salons
  const popularServices = claimedSalons?.reduce((acc: { [key: string]: number }, salon) => {
    salon.services.forEach((service: string) => {
      acc[service] = (acc[service] || 0) + 1
    })
    return acc
  }, {})

  // Sort services by popularity
  const sortedServices = Object.entries(popularServices || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto p-6">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="mt-2">Failed to load your salons. Please try again later.</p>
        </Card>
      </div>
    )
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Your Salons</h1>
              <p className="text-gray-600 mt-1">Welcome back, {session.user.user_metadata.name}</p>
            </div>
            <Button asChild>
              <Link href="/submit-salon">Add New Salon</Link>
            </Button>
          </div>

          {/* Analytics Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-2">Total Views</h2>
              <p className="text-3xl font-bold">{totalViews?.count || 0}</p>
            </Card>
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-2">Views Last 7 Days</h2>
              <p className="text-3xl font-bold">{recentViews?.length || 0}</p>
            </Card>
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-2">Active Salons</h2>
              <p className="text-3xl font-bold">{claimedSalons?.length || 0}</p>
            </Card>
          </div>

          {/* View Trends */}
          <Card className="mb-8 p-6">
            <h2 className="text-xl font-semibold mb-4">View Trends (Last 7 Days)</h2>
            <div className="h-48 flex items-end space-x-2">
              {Object.entries(viewsPerDay || {}).map(([date, count]) => (
                <div key={date} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-indigo-600 rounded-t"
                    style={{ height: `${(count / Math.max(...Object.values(viewsPerDay || {}))) * 100}%` }}
                  />
                  <span className="text-xs mt-2">{new Date(date).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Popular Services */}
          <Card className="mb-8 p-6">
            <h2 className="text-xl font-semibold mb-4">Popular Services</h2>
            <div className="space-y-2">
              {sortedServices.map(([service, count]) => (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
              {recentViews?.length === 0 ? (
                <p className="text-gray-600">No recent views</p>
              ) : (
                <ul className="space-y-2">
                  {recentViews?.map((view) => (
                    <li key={view.salon_id} className="text-sm">
                      <span className="text-gray-600">
                        {new Date(view.viewed_at).toLocaleDateString()}
                      </span>
                      {' - '}
                      <span className="text-indigo-600">
                        {claimedSalons?.find((s) => s.id === view.salon_id)?.name}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          {claimedSalons?.length === 0 ? (
            <Card className="p-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">No Salons Yet</h2>
                <p className="text-gray-600 mb-4">
                  You haven't claimed any salons yet. Start by adding a new salon or claiming an existing one.
                </p>
                <div className="space-x-4">
                  <Button asChild>
                    <Link href="/submit-salon">Add New Salon</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/">Browse Salons</Link>
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <div className="grid gap-6">
              {claimedSalons?.map((salon) => (
                <Card key={salon.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold">{salon.name}</h2>
                      <p className="text-gray-600 mt-1">{salon.city}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" asChild>
                        <Link href={`/salons/${salon.id}/edit`}>Edit</Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href={`/salons/${salon.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Address</h3>
                      <p className="mt-1">{salon.address}</p>
                      <p>{salon.postcode}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Services</h3>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {salon.services.map((service: string) => (
                          <span
                            key={service}
                            className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                    <div className="mt-1 space-y-1">
                      {salon.instagram_url && (
                        <p>
                          <a
                            href={salon.instagram_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            Instagram
                          </a>
                        </p>
                      )}
                      {salon.website_url && (
                        <p>
                          <a
                            href={salon.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            Website
                          </a>
                        </p>
                      )}
                      {salon.phone && (
                        <p>
                          <a
                            href={`tel:${salon.phone}`}
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            {salon.phone}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
} 