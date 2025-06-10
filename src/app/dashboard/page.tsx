import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Salon } from '@/types'

export default async function OwnerDashboard() {
  const { data: salons } = await supabase
    .from('salons')
    .select('*')
    .eq('claimed_by', 'current_user_id') // This will be replaced with actual auth
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Salons</h1>

      <div className="grid gap-6">
        {salons?.map((salon: Salon) => (
          <Card key={salon.id} className="p-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">{salon.name}</h2>
                <p className="text-gray-600">{salon.city}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <Input
                    type="text"
                    defaultValue={salon.address}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Postcode
                  </label>
                  <Input
                    type="text"
                    defaultValue={salon.postcode}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Instagram URL
                  </label>
                  <Input
                    type="url"
                    defaultValue={salon.instagram_url || ''}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Website URL
                  </label>
                  <Input
                    type="url"
                    defaultValue={salon.website_url || ''}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <Input
                    type="tel"
                    defaultValue={salon.phone || ''}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button>
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 