import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Toaster } from 'sonner'

interface Props {
  params: {
    id: string
  }
}

export default async function SalonPage({ params }: Props) {
  const supabase = createClient(cookies())
  const salonId = params.id

  const { data: salon, error } = await supabase
    .from('salons')
    .select('*')
    .eq('id', salonId)
    .single()

  if (error || !salon) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto p-6">
          <h1 className="text-2xl font-bold text-red-600">Salon not found</h1>
          <p className="mt-2">The salon you're looking for doesn't exist or has been removed.</p>
          <Button asChild className="mt-4">
            <Link href="/">Return Home</Link>
          </Button>
        </Card>
      </div>
    )
  }

  // Track view
  await supabase.from('salon_views').insert({
    salon_id: salonId,
    owner_email: salon.owner_email,
  })

  return (
    <>
      <Toaster position="top-center" />
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold">{salon.name}</h1>
              <p className="text-gray-600 mt-2">{salon.city}</p>
            </div>
            <Button variant="outline" asChild>
              <Link href={`/salons/${salon.id}/claim`}>Claim this Salon</Link>
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Address</h2>
              <p className="text-gray-600">{salon.address}</p>
              <p className="text-gray-600">{salon.postcode}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Services</h2>
              <div className="flex flex-wrap gap-2">
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

            {(salon.instagram_url || salon.website_url || salon.phone) && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
                <div className="space-y-2">
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
            )}
          </div>
        </Card>
      </div>
    </>
  )
} 