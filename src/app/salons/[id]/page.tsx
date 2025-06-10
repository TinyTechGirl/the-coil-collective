import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Salon } from '@/types'

interface Props {
  params: {
    id: string
  }
}

export default async function SalonPage({ params }: Props) {
  const { data: salon, error } = await supabase
    .from('salons')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !salon) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6">
        <h1 className="text-3xl font-bold mb-4">{salon.name}</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Location</h2>
            <p>{salon.address}</p>
            <p>{salon.city}, {salon.postcode}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Services</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {salon.services.map((service: string) => (
                <span
                  key={service}
                  className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          {salon.instagram_url && (
            <div>
              <h2 className="text-lg font-semibold">Social Media</h2>
              <a
                href={salon.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800"
              >
                Instagram
              </a>
            </div>
          )}

          {salon.website_url && (
            <div>
              <h2 className="text-lg font-semibold">Website</h2>
              <a
                href={salon.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800"
              >
                Visit Website
              </a>
            </div>
          )}

          {!salon.claimed && (
            <Button className="mt-4">
              Claim This Salon
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
} 